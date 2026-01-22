#!/bin/bash

# EC2 인스턴스 초기 설정 스크립트
# Amazon Linux 2023 기준

echo "🚀 EC2 인스턴스 초기 설정 시작..."

# 시스템 업데이트
echo "📦 시스템 패키지 업데이트..."
sudo yum update -y

# Docker 설치
echo "🐳 Docker 설치..."
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user

# Docker Compose 설치
echo "🔧 Docker Compose 설치..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# AWS CLI 설치 (이미 설치되어 있을 수 있음)
echo "☁️ AWS CLI 확인..."
if ! command -v aws &> /dev/null; then
    echo "AWS CLI 설치..."
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip awscliv2.zip
    sudo ./aws/install
    rm -rf aws awscliv2.zip
fi

# Git 설치
echo "📝 Git 설치..."
sudo yum install -y git

# 프로젝트 디렉토리 생성
echo "📁 프로젝트 디렉토리 생성..."
mkdir -p ~/pixel-todo-deploy
cd ~/pixel-todo-deploy

echo "✅ EC2 초기 설정 완료!"
echo ""
echo "📋 다음 단계:"
echo "1. AWS CLI 설정: aws configure"
echo "2. ECR 로그인 및 이미지 pull"
echo "3. 환경 변수 설정"
echo "4. Docker Compose 실행"
echo ""
echo "⚠️ 주의: 새 터미널 세션을 시작하거나 다음 명령어를 실행하세요:"
echo "newgrp docker"