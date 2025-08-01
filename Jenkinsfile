pipeline {
    agent any
    
    environment {
        PROJECT_NAME = 'moyushuang'
        DEPLOY_PATH = '/var/www/moyushuang'
        DEPLOY_SCRIPT = '/var/www/moyushuang/deploy.sh'
    }
    
    stages {
        stage('环境检查') {
            steps {
                echo "开始部署项目: ${PROJECT_NAME}"
                echo "部署路径: ${DEPLOY_PATH}"
                
                // 检查部署脚本是否存在
                script {
                    def scriptExists = sh(
                        script: "test -f ${DEPLOY_SCRIPT}",
                        returnStatus: true
                    )
                    if (scriptExists != 0) {
                        error "部署脚本不存在: ${DEPLOY_SCRIPT}"
                    }
                }
            }
        }
        
        stage('执行部署') {
            steps {
                echo "执行部署脚本..."
                sh "bash ${DEPLOY_SCRIPT}"
            }
        }
    }
    
    post {
        success {
            echo "🎉 部署成功！"
        }
        
        failure {
            echo "❌ 部署失败！请检查日志。"
        }
        
        always {
            echo "部署流程结束"
        }
    }
}