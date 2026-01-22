#!/bin/bash

# EC2에서 애플리케이션 배포 스크립트

# 설정 변수
AWS_REGION="ap-northeast-2"
AWS_ACCOUNT_ID="YOUR_AWS_ACCOUNT_ID"  # 실제 AWS 계정 ID로 변경
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

echo "🚀 EC2에 Pixel TODO 애플리케이션 배포 시작..."

# 환경 변수 파일 생성
echo "📝 환경 변수 설정..."
cat > .env << EOF
# AWS 설정
AWS_ACCOUNT_ID=${AWS_ACCOUNT_ID}
AWS_REGION=${AWS_REGION}

# 데이터베이스 설정
DB_PASSWORD=your_secure_db_password_here

# JWT 시크릿 (강력한 랜덤 문자열로 변경)
JWT_SECRET=your_super_secure_jwt_secret_key_here

# URL 설정 (EC2 퍼블릭 IP 또는 도메인으로 변경)
API_URL=http://YOUR_EC2_PUBLIC_IP:3001
FRONTEND_URL=http://YOUR_EC2_PUBLIC_IP:3000
EOF

echo "⚠️ .env 파일이 생성되었습니다. 실제 값으로 수정해주세요!"

# ECR 로그인
echo "🔐 ECR 로그인..."
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}

# 최신 이미지 pull
echo "📥 최신 이미지 다운로드..."
docker pull ${ECR_REGISTRY}/pixel-todo-frontend:latest
docker pull ${ECR_REGISTRY}/pixel-todo-backend:latest

# 기존 컨테이너 중지 및 제거
echo "🛑 기존 컨테이너 중지..."
docker-compose -f docker-compose.prod.yml down

# 새 컨테이너 실행
echo "🚀 새 컨테이너 실행..."
docker-compose -f docker-compose.prod.yml up -d

# 컨테이너 상태 확인
echo "📊 컨테이너 상태 확인..."
docker-compose -f docker-compose.prod.yml ps

# 로그 확인
echo "📋 애플리케이션 로그 (10초간)..."
timeout 10 docker-compose -f docker-compose.prod.yml logs -f

echo "✅ 배포 완료!"
echo ""
echo "📋 접속 정보:"
echo "Frontend: http://YOUR_EC2_PUBLIC_IP:3000"
echo "Backend API: http://YOUR_EC2_PUBLIC_IP:3001"
echo "Health Check: http://YOUR_EC2_PUBLIC_IP:3001/health"
echo ""
echo "📊 로그 확인: docker-compose -f docker-compose.prod.yml logs -f"
echo "🔄 재시작: docker-compose -f docker-compose.prod.yml restart"