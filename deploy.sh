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
git reset --hard origin/$BRANCH

# 停止旧服务
echo "停止旧服务..."
docker-compose -f $DOCKER_COMPOSE_FILE down --remove-orphans || true

# 构建并启动新服务
echo "构建并启动新服务..."
docker-compose -f $DOCKER_COMPOSE_FILE up -d --build

# 等待服务启动
echo "等待服务启动..."
sleep 30

# 健康检查
echo "执行健康检查..."

echo "部署完成！"