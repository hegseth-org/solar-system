pipeline {
    agent any
    environment {
    	MONGO_URI = "mongodb://localhost:27017/mydb"
	MONGO_USERNAME = ""
	MONGO_PASSWORD = ""
    }
    stages {
        stage('Instal dependencies') {
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
        }
    }
}
