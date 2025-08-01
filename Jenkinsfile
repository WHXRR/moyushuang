pipeline {
    agent any
    
    environment {
        PROJECT_NAME = 'moyushuang'
        DEPLOY_PATH = '/var/www/moyushuang'
        GIT_REPO = 'https://github.com/WHXRR/moyushuang.git'
        GIT_BRANCH = 'master'
        COMPOSE_CMD = 'docker compose'
    }
    
    stages {
        stage('🔧 环境检查') {
            steps {
                script {
                    echo '检查Docker环境...'
                    sh '''
                        echo "Docker版本:"
                        docker --version
                        echo "当前用户: $(whoami)"
                        echo "当前目录: $(pwd)"
                    '''
                }
            }
        }
        
        stage('📥 拉取代码') {
            steps {
                echo '开始拉取最新代码...'
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: "*/${GIT_BRANCH}"]],
                    userRemoteConfigs: [[url: "${GIT_REPO}"]]
                ])
                echo '✅ 代码拉取完成'
            }
        }
        
        stage('📋 同步代码') {
            steps {
                script {
                    echo '同步最新代码到部署目录...'
                    sh '''
                        # 确保部署目录存在
                        sudo mkdir -p ${DEPLOY_PATH}
                        
                        # 同步代码（保留你的 .env 文件）
                        sudo rsync -av --delete \
                            --exclude='.git' \
                            --exclude='node_modules' \
                            --exclude='moyushuang-frontend/.env.production' \
                            --exclude='moyushuang-backend/.env.production' \
                            ./ ${DEPLOY_PATH}/
                        
                        # 设置权限
                        sudo chown -R jenkins:jenkins ${DEPLOY_PATH}
                        
                        echo "代码同步到: ${DEPLOY_PATH}"
                        ls -la ${DEPLOY_PATH}
                    '''
                    echo '✅ 代码同步完成'
                }
            }
        }

        stage('🛑 停止旧服务') {
            steps {
                script {
                    echo '停止现有服务...'
                    sh '''
                        cd ${DEPLOY_PATH}
                        
                        # 停止并移除现有容器
                        ${COMPOSE_CMD} down --remove-orphans || echo "没有运行中的服务"
                        
                    '''
                    echo '✅ 旧服务已停止'
                }
            }
        }
        
        stage('🏗️ 构建和启动') {
            steps {
                script {
                    echo '开始构建和启动服务...'
                    sh '''
                        cd ${DEPLOY_PATH}
                        
                        # 构建并启动服务
                        ${COMPOSE_CMD} up -d --build
                        
                        # 等待服务启动
                        echo "等待服务启动..."
                        sleep 45
                        
                        # 显示容器状态
                        echo "=== 容器状态 ==="
                        ${COMPOSE_CMD} ps
                    '''
                    echo '✅ 服务构建和启动完成'
                }
            }
        }
        
        stage('🔍 健康检查') {
            steps {
                script {
                    echo '执行健康检查...'
                    sh '''
                        cd ${DEPLOY_PATH}
                        
                        # 等待更长时间确保服务完全启动
                        echo "等待服务完全启动..."
                        sleep 30
                        
                        # 检查容器状态
                        echo "=== 最终容器状态 ==="
                        ${COMPOSE_CMD} ps
                        
                        # 检查容器健康状态
                        echo "=== 容器健康检查 ==="
                        for service in frontend backend mysql redis; do
                            if ${COMPOSE_CMD} ps $service | grep -q "Up"; then
                                echo "✅ $service: 运行中"
                            else
                                echo "❌ $service: 异常"
                                ${COMPOSE_CMD} logs --tail=10 $service
                            fi
                        done
                        
                        # 网络连通性测试
                        echo "=== 网络连通性测试 ==="
                        
                        # 测试前端服务
                        if curl -f -m 10 http://localhost:8081 > /dev/null 2>&1; then
                            echo "✅ 前端服务 (8081): 正常"
                        else
                            echo "❌ 前端服务 (8081): 异常"
                            ${COMPOSE_CMD} logs --tail=10 frontend
                        fi
                        
                        # 测试后端服务
                        if curl -f -m 10 http://localhost:3000 > /dev/null 2>&1; then
                            echo "✅ 后端服务 (3000): 正常"
                        else
                            echo "⚠️ 后端服务 (3000): 可能还在启动中"
                            ${COMPOSE_CMD} logs --tail=10 backend
                        fi
                        
                        # 显示最新日志
                        echo "=== 最新服务日志 ==="
                        ${COMPOSE_CMD} logs --tail=5 --timestamps
                    '''
                    echo '✅ 健康检查完成'
                }
            }
        }
    }
    
    post {
        always {
            script {
                // 保存部署日志
                sh '''
                    cd ${DEPLOY_PATH} || exit 0
                    echo "=== 部署完成时间: $(date) ===" >> deploy.log
                    ${COMPOSE_CMD} down ps >> deploy.log 2>&1 || true
                    echo "" >> deploy.log
                '''
            }
        }
        
        success {
            echo '🎉 部署成功！'
            script {
                sh '''
                    echo "\n🎉 部署成功通知："
                    echo "项目：${PROJECT_NAME}"
                    echo "分支：${GIT_BRANCH}"
                    echo "部署时间：$(date)"
                    echo "\n服务状态："
                    cd ${DEPLOY_PATH}
                    ${COMPOSE_CMD} down ps
                '''
            }
        }
        
        failure {
            echo '❌ 部署失败！'
            script {
                sh '''
                    echo "\n❌ 部署失败，错误信息："
                    cd ${DEPLOY_PATH} || exit 0
                    echo "=== 容器状态 ==="
                    ${COMPOSE_CMD} down ps || true
                    echo "=== 错误日志 ==="
                    ${COMPOSE_CMD} down logs --tail=20 || true
                    echo "=== 系统资源 ==="
                    df -h
                    free -h
                '''
            }
        }
    }
}