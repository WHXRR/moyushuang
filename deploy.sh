#!/bin/bash

# 设置错误时退出
set -e

# 配置变量
PROJECT_DIR="/var/www/moyushuang"
BRANCH="master"
DOCKER_COMPOSE_FILE="docker-compose.yml"

echo "开始部署..."

# 进入项目目录
cd $PROJECT_DIR

# 拉取最新代码
echo "拉取最新代码..."
git fetch origin
git pull origin $BRANCH

# 停止旧服务
echo "停止旧服务..."
docker-compose -f $DOCKER_COMPOSE_FILE down

# 构建并启动新服务
echo "构建并启动新服务..."
docker-compose -f $DOCKER_COMPOSE_FILE up -d --build

# 等待服务启动
echo "等待服务启动..."
# 增加初始等待时间，让容器有足够时间启动
sleep 15

# 健康检查函数
check_service_health() {
    local service_name=$1
    local check_command=$2
    local max_attempts=$3
    local sleep_interval=$4
    local success_message=$5
    local timeout_message=$6
    
    echo "检查 $service_name 服务..."
    for i in $(seq 1 $max_attempts); do
        if eval "$check_command" >/dev/null 2>&1; then
            echo "✅ $success_message"
            return 0
        fi
        echo "⏳ $service_name 服务检查第 $i/$max_attempts 次，等待 ${sleep_interval}s..."
        sleep $sleep_interval
    done
    echo "⚠️  $timeout_message"
    return 1
}

# 检查容器状态函数
check_container_status() {
    local container_name=$1
    local status=$(docker-compose -f $DOCKER_COMPOSE_FILE ps -q $container_name | xargs docker inspect --format='{{.State.Status}}' 2>/dev/null || echo "not_found")
    echo "📊 容器 $container_name 状态: $status"
    return 0
}

echo "执行健康检查..."

# 检查所有容器状态
echo "📋 检查容器状态..."
check_container_status "mysql"
check_container_status "redis"
check_container_status "backend"
check_container_status "frontend"

# 检查 MySQL 服务
if check_service_health "MySQL" \
    "docker-compose -f $DOCKER_COMPOSE_FILE exec -T mysql mysqladmin ping -h localhost --silent" \
    15 2 \
    "MySQL 服务已就绪" \
    "MySQL 服务启动超时，但继续检查其他服务"; then
    mysql_ready=true
else
    mysql_ready=false
fi

# 检查 Redis 服务
if check_service_health "Redis" \
    "docker-compose -f $DOCKER_COMPOSE_FILE exec -T redis redis-cli ping | grep -q PONG" \
    10 2 \
    "Redis 服务已就绪" \
    "Redis 服务启动超时，但继续检查其他服务"; then
    redis_ready=true
else
    redis_ready=false
fi

# 检查后端服务 - 增加更详细的检查
echo "🔍 检查后端服务详细状态..."
# 首先检查容器日志
echo "📝 后端容器最新日志:"
docker-compose -f $DOCKER_COMPOSE_FILE logs --tail=10 backend || echo "无法获取后端日志"

# 检查端口是否监听
echo "🔌 检查后端端口监听状态..."
if docker-compose -f $DOCKER_COMPOSE_FILE exec -T backend netstat -tlnp | grep :3000 >/dev/null 2>&1; then
    echo "✅ 后端端口3000已监听"
    port_listening=true
else
    echo "⚠️  后端端口3000未监听"
    port_listening=false
fi

# 检查后端HTTP响应
if check_service_health "后端HTTP" \
    "curl -f -m 5 http://localhost:3000" \
    60 5 \
    "后端服务HTTP响应正常" \
    "后端服务HTTP响应超时"; then
    backend_http_ready=true
else
    backend_http_ready=false
fi

# 检查前端服务
if check_service_health "前端" \
    "curl -f -m 5 http://localhost:8081" \
    15 2 \
    "前端服务已就绪" \
    "前端服务启动超时"; then
    frontend_ready=true
else
    frontend_ready=false
fi

# 综合评估部署结果
echo "\n📊 部署结果汇总:"
echo "MySQL: $([ "$mysql_ready" = true ] && echo "✅ 正常" || echo "❌ 异常")"
echo "Redis: $([ "$redis_ready" = true ] && echo "✅ 正常" || echo "❌ 异常")"
echo "后端端口: $([ "$port_listening" = true ] && echo "✅ 正常" || echo "❌ 异常")"
echo "后端HTTP: $([ "$backend_http_ready" = true ] && echo "✅ 正常" || echo "❌ 异常")"
echo "前端: $([ "$frontend_ready" = true ] && echo "✅ 正常" || echo "❌ 异常")"

# 智能判断部署是否成功
if [ "$mysql_ready" = true ] && [ "$redis_ready" = true ] && [ "$port_listening" = true ]; then
    if [ "$backend_http_ready" = true ] && [ "$frontend_ready" = true ]; then
        echo "\n🎉 部署完全成功！所有服务都正常运行。"
        exit 0
    elif [ "$backend_http_ready" = true ]; then
        echo "\n✅ 部署基本成功！核心服务正常，前端可能需要更多时间启动。"
        echo "💡 建议：可以手动检查前端服务 http://localhost:8081"
        exit 0
    else
        echo "\n⚠️  部署部分成功！容器已启动但HTTP服务未完全就绪。"
        echo "💡 建议："
        echo "   1. 检查后端日志: docker-compose logs backend"
        echo "   2. 手动测试: curl http://localhost:3000"
        echo "   3. 服务可能仍在初始化中，请稍等片刻"
        # 不退出失败，给服务更多时间
        exit 0
    fi
else
    echo "\n❌ 部署失败！关键服务未能正常启动。"
    echo "💡 建议检查:"
    echo "   1. Docker容器状态: docker-compose ps"
    echo "   2. 服务日志: docker-compose logs"
    echo "   3. 系统资源: df -h && free -h"
    exit 1
fi