pipeline {
    agent any
    environment {
        ECR_REGION = 'ap-south-1' // AWS region
        ECR_URL = '535002868961.dkr.ecr.ap-south-1.amazonaws.com' // AWS ECR base URL
        ECR_REACT_REPO = "${ECR_URL}/frontend/frontend"
        ECR_NODE_REPO = "${ECR_URL}/backend/backend"
        ECR_DB_REPO = "${ECR_URL}/db/db"
        EC2_IP = '13.203.77.71' // Your EC2 IP address
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
       //here u may thought again why we are cloning and navigating to repo to get the compose file
       //bacause in above stages stage1 we are cloning our repo to jenkins server workspace
       //there only we are building our images and pushing to ecr
       //so to run the app in your host 
       //you need remotly connect to that and navigate to your compose file to 
       //run the app
        stage('Deploy on EC2 Instance') {
            steps {
                script {
                    // Use SSH credentials stored in Jenkins to SSH into EC2 instance and run docker-compose
                    sshagent(['ec2-ssh-key']) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_IP} '
                                # Pull the latest code from GitHub on the EC2 instance
                                cd /home/ubuntu
                                git clone https://github.com/DeviPothula/Three-Tier-App.git
                                cd Three-Tier-App
                                # Login to AWS ECR
                                # aws ecr get-login-password --region ${ECR_REGION} | docker login --username AWS --password-stdin ${ECR_URL}
                                # Pull images from ECR and start containers
                                # docker-compose pull
                                docker compose up -d
                            '
                        """
                    }
                }
            }
        }
    }

   post {
    success {
        // Print a success message if deployment succeeds
        echo 'Deployment succeeded'
    }
    failure {
        // Clean up Docker Compose on the EC2 instance only on failure
        sshagent(['ec2-ssh-key']) {
            sh """
                ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_IP} '
                    cd /home/ubuntu/Three-Tier-App
                    docker-compose down
                '
            """
        }
    }
    always {
        // Clean up the Jenkins workspace after the pipeline runs, regardless of success or failure
        emailext(
                subject: "Jenkins Build: ${currentBuild.fullDisplayName}",
                body: """<p>Build Details:</p>
                         <ul>
                           <li>Status: ${currentBuild.currentResult}</li>
                           <li>Project: ${env.JOB_NAME}</li>
                           <li>Build Number: ${env.BUILD_NUMBER}</li>
                           <li>Build URL: <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></li>
                         </ul>""",
                recipientProviders: [[$class: 'DevelopersRecipientProvider'], [$class: 'RequesterRecipientProvider']],
                to:"devikapothula597@gmail.com",
                mimeType: 'text/html'
            )
        
        cleanWs()
    }
}
}
