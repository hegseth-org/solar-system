pipeline {
    agent any
    environment {
        MONGO_URI = "mongodb://localhost:27017/mydb"
        MONGO_USERNAME = ""
        MONGO_PASSWORD = ""		
    }
    stages {
        stage('Install dependencies') {
            steps {
                sh 'npm install --no-audit'
            }
        }
        stage('Scan vulnerabilities') {
            steps {
                sh 'npm audit --audit-level=critical'
            }
        }
        stage('Unit testing') {
            steps {
                sh 'npm test'
            }
            post {
                    always {
                        junit 'test-results.xml'
                    }
            }
        }
        stage('Code coverage') {
            steps {
                catchError(buildResult: 'SUCCESS', message: 'Oops! It will be fixed in future releases.', stageResult: 'UNSTABLE') {
                        sh 'npm run coverage'
                }
            }
            post {
                    always {
                        publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, icon: '', keepAll: false, reportDir: 'coverage/lcov-report', reportFiles: 'index.html', reportName: 'HTML Report', reportTitles: '', useWrapperFileDirectly: true])
                    }
            }
        }
		stage('SAST - Sonarqube') {
			steps {
				sh '''
					sonar \
					  -Dsonar.host.url=http://13.60.92.74:9000 \
					  -Dsonar.token=sqp_e8153c0795fab3b5c961212efa0c2ff4ec2d720a \
					  -Dsonar.projectKey=Solar-System_project
											
				'''
			}
		}
    }
}
