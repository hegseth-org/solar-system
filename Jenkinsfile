pipeline {
    agent any
    environment {
        MONGO_URI = "mongodb://localhost:27017/mydb"
        MONGO_USERNAME = ""
        MONGO_PASSWORD = ""
	SONAR_TOKEN = credentials('sonar-token')
	SONAR_SCANNER_HOME = tool 'sonarqube-scanner-610'
		
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
				sh 'echo $SONAR_SCANNER_HOME'
				sh '''
					$SONAR_SCANNER_HOME/bin/sonar-scanner \
          					-Dsonar.projectKey=Solar-System_project \
          					-Dsonar.sources=. \
          					-Dsonar.host.url=http://51.20.127.252:9000 \
          					-Dsonar.token=$SONAR_TOKEN \
						-Dsonar.nodejs.executable=/usr/bin/node
				'''
			}
		}
    }
}
