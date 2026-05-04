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
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: false,
                        icon: '',
                        keepAll: false,
                        reportDir: 'coverage/lcov-report',
                        reportFiles: 'index.html',
                        reportName: 'HTML Report',
                        reportTitles: '',
                        useWrapperFileDirectly: true
                    ])
                }
            }
        }

        stage('SAST - Sonarqube') {
            steps {
                withSonarQubeEnv('sonarqube-server') {
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
                timeout(time: 130, unit: 'SECONDS') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build docker image') {
            steps {
                sh 'docker build -t humayun27/solar-system:$GIT_COMMIT .'
            }
        }

        stage('Trivy vulnerability scanner') {
            steps {
                sh '''
                    trivy image humayun27/solar-system:$GIT_COMMIT \
                        --severity LOW,MEDIUM,HIGH \
                        --exit-code 0 \
                        --quiet \
                        --format json -o trivy-image-LOW-MEDIUM-results.json

                    trivy image humayun27/solar-system:$GIT_COMMIT \
                        --severity CRITICAL \
                        --exit-code 1 \
                        --quiet \
                        --format json -o trivy-image-HIGH-CRITICAL-results.json
                '''
            }

            post {
                always {
                    sh '''
                        trivy convert \
                            --format template --template "@/usr/local/share/trivy/templates/junit.tpl" \
                            --output trivy-image-HIGH-CRITICAL-results.xml trivy-image-HIGH-CRITICAL-results.json

                        trivy convert \
                            --format template --template "@/usr/local/share/trivy/templates/junit.tpl" \
                            --output trivy-image-LOW-MEDIUM-results.xml trivy-image-LOW-MEDIUM-results.json

                        trivy convert \
                            --format template --template "@/usr/local/share/trivy/templates/html.tpl" \
                            --output trivy-image-HIGH-CRITICAL-results.html trivy-image-HIGH-CRITICAL-results.json

                        trivy convert \
                            --format template --template "@/usr/local/share/trivy/templates/html.tpl" \
                            --output trivy-image-LOW-MEDIUM-results.html trivy-image-LOW-MEDIUM-results.json
                    '''

                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: false,
                        icon: '',
                        keepAll: false,
                        reportDir: './',
                        reportFiles: 'trivy-image-HIGH-CRITICAL-results.html',
                        reportName: 'trivy-image-HIGH-CRITICAL report'
                    ])

                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: false,
                        icon: '',
                        keepAll: false,
                        reportDir: './',
                        reportFiles: 'trivy-image-LOW-MEDIUM-results.html',
                        reportName: 'trivy-image-LOW-MEDIUM report'
                    ])
                }
            }
        }
    }
}
