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
                    withSonarQubeEnv('sonarqube-server') { /*injects env variables such as SONAR_HOST_URL, SONAR_AUTH_TOKEN*/
                        sh '''
                            sonar-scanner \
                                -Dsonar.projectKey=solar-system \
                                -Dsonar.sources=. \
                                -Dsonar.nodejs.executable=/usr/bin/node \
                                -Dsonar.javascript.lcov.reportPaths=./coverage/lcov.info
                        '''
                    }
            }
        }
        stage('Quality gate') {
            steps {
                timeout(time:130, unit: 'SECONDS') {
                    waitForQualityGate abortPipeline: true /*makes jenkins wait for sonarqube's pass/fail decision and then allows or blocks the pipeline*/
                }
            }
        }
	stage('Build docker image') {
	    steps {
	   	sh 'docker build -t ":$GIT_COMMIT" .'
            }
	}
    }
}
