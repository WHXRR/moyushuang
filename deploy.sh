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

# 综合评估部署结果
echo "\n📊 部署结果汇总:"
echo "MySQL: $([ "$mysql_ready" = true ] && echo "✅ 正常" || echo "❌ 异常")"
echo "Redis: $([ "$redis_ready" = true ] && echo "✅ 正常" || echo "❌ 异常")"

# 智能判断部署是否成功
if [ "$mysql_ready" = true ] && [ "$redis_ready" = true ]; then
    echo "\n🎉 部署成功！核心服务已正常启动。"
    echo "💡 提示：前后端服务可能需要额外时间完成初始化，请稍等片刻后访问应用。"
    exit 0
else
    echo "\n❌ 部署失败！关键服务未能正常启动。"
    echo "💡 建议检查:"
    echo "   1. Docker容器状态: docker-compose ps"
    echo "   2. 服务日志: docker-compose logs"
    echo "   3. 系统资源: df -h && free -h"
    exit 1
fi