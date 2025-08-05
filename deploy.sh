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
# 等待容器启动
sleep 10

# 健康检查
echo "执行健康检查..."

# 检查 MySQL 服务
echo "检查 MySQL 服务..."
for i in {1..15}; do
    if docker-compose -f $DOCKER_COMPOSE_FILE exec -T mysql mysqladmin ping -h localhost --silent 2>/dev/null; then
        echo "MySQL 服务已就绪"
        break
    fi
    if [ $i -eq 15 ]; then
        echo "MySQL 服务启动超时"
        exit 1
    fi
    sleep 2
done

# 检查 Redis 服务
echo "检查 Redis 服务..."
for i in {1..10}; do
    if docker-compose -f $DOCKER_COMPOSE_FILE exec -T redis redis-cli ping 2>/dev/null | grep -q PONG; then
        echo "Redis 服务已就绪"
        break
    fi
    if [ $i -eq 10 ]; then
        echo "Redis 服务启动超时"
        exit 1
    fi
    sleep 2
done

# 检查后端服务
echo "检查后端服务..."
for i in {1..20}; do
    if curl -f http://localhost:3000 >/dev/null 2>&1; then
        echo "后端服务已就绪"
        break
    fi
    if [ $i -eq 20 ]; then
        echo "后端服务启动超时"
        exit 1
    fi
    sleep 3
done

# 检查前端服务
echo "检查前端服务..."
for i in {1..15}; do
    if curl -f http://localhost:8081 >/dev/null 2>&1; then
        echo "前端服务已就绪"
        break
    fi
    if [ $i -eq 15 ]; then
        echo "前端服务启动超时"
        exit 1
    fi
    sleep 2
done

echo "部署完成！"