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
					sonar-scanner \
					-Dsonar.projectKey=Solar-System_project \
              				-Dsonar.sources=. \
              				-Dsonar.host.url=http://16.171.43.38:9000 \
					-Dsonar.token=sqp_a3bf9dc04ca284c6a96feff3d5c43198c84674d9 \
					-Dsonar.nodejs.executable=/usr/bin/node
					-Dsonar.javascript.lcov.reportPaths=./coverage/lcov.info
				'''
			}
		}
    }
}
