pipeline {
    agent any
    environment {
        ECR_REGION = 'ap-south-1' // AWS region
        ECR_URL = '535002868961.dkr.ecr.ap-south-1.amazonaws.com' // AWS ECR base URL
        ECR_REACT_REPO = "${ECR_URL}/frontend/frontend"
        ECR_NODE_REPO = "${ECR_URL}/backend/backend"
        EC2_IP = '13.235.48.28' // Your EC2 IP address
        EC2_USER = 'ubuntu'  // EC2 username 
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

        stage('Deploy on EC2 Instance') {
            steps {
                script {
                    // Use SSH credentials stored in Jenkins to SSH into EC2 instance and run docker-compose
                    sshagent(['ec2-ssh-key']) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_IP} '
                                aws ecr get-login-password --region ${ECR_REGION} | docker login --username AWS --password-stdin ${ECR_URL}
                                docker-compose pull
                                docker-compose up -d
                            '
                        """
                    }
                }
            }
        }
    }

    
    post {
        always {
            // Clean up Docker Compose on the EC2 instance after deployment
            sshagent(['ec2-ssh-key']) {
                sh """
                    ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_IP} 'docker-compose down'
                """
            }
        }
    }
}
