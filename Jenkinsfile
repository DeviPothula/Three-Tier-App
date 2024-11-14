pipeline {
    agent any
    environment {
        ECR_REGION = 'ap-south-1' // AWS region
        ECR_URL = '535002868961.dkr.ecr.ap-south-1.amazonaws.com' // AWS ECR base URL
        ECR_REACT_REPO = "${ECR_URL}/frontend/frontend"
        ECR_NODE_REPO = "${ECR_URL}/backend/backend"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/DeviPothula/Three-Tier-App.git'
            }
        }

        stage('Login to AWS ECR') {
            steps {
                script {
                    // Login to AWS ECR using AWS CLI (ensure AWS CLI is installed and configured)
                    sh """
                        aws ecr get-login-password --region ${ECR_REGION} | docker login --username AWS --password-stdin ${ECR_URL}
                    """
                }
            }
        }

        stage('Build and Run with Docker Compose') {
            steps {
                script {
                    // Run docker-compose to build and start the services
                    sh "docker-compose up --build -d"
                }
            }
        }

        stage('Push Docker Images to ECR') {
            steps {
                script {
                    // Tag and push React front-end image to ECR
                    sh """
                        docker tag frontend:latest ${ECR_REACT_REPO}:latest
                        docker push ${ECR_REACT_REPO}:latest
                    """
                    
                    // Tag and push Node backend image to ECR
                    sh """
                        docker tag backend:latest ${ECR_NODE_REPO}:latest
                        docker push ${ECR_NODE_REPO}:latest
                    """
                }
            }
        }
    }

    post {
        always {
            // Stop and remove containers after each run
            sh "docker-compose down"
        }
    }
}
