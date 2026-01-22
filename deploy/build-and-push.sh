#!/bin/bash

# AWS ECR에 Docker 이미지 빌드 및 푸시 스크립트

# 설정 변수
AWS_REGION="ap-northeast-2"  # 서울 리전
AWS_ACCOUNT_ID="YOUR_AWS_ACCOUNT_ID"  # 실제 AWS 계정 ID로 변경
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

# ECR 리포지토리 이름
FRONTEND_REPO="pixel-todo-frontend"
BACKEND_REPO="pixel-todo-backend"

# 이미지 태그
TAG="latest"

echo "🚀 AWS ECR에 Pixel TODO 이미지 빌드 및 푸시 시작..."

# AWS 계정 ID 확인
if [ "$AWS_ACCOUNT_ID" = "YOUR_AWS_ACCOUNT_ID" ]; then
    echo "❌ AWS_ACCOUNT_ID를 실제 계정 ID로 변경해주세요!"
    exit 1
fi

# AWS CLI 로그인 확인
echo "📋 AWS CLI 설정 확인..."
aws sts get-caller-identity || {
    echo "❌ AWS CLI 설정이 필요합니다. 'aws configure' 명령어를 실행하세요."
    exit 1
}

# ECR 로그인
echo "🔐 ECR 로그인..."
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY} || {
    echo "❌ ECR 로그인에 실패했습니다."
    exit 1
}

# ECR 리포지토리 생성 (이미 존재하면 무시)
echo "📦 ECR 리포지토리 생성..."
aws ecr create-repository --repository-name ${FRONTEND_REPO} --region ${AWS_REGION} 2>/dev/null || true
aws ecr create-repository --repository-name ${BACKEND_REPO} --region ${AWS_REGION} 2>/dev/null || true

# Backend 이미지 빌드 및 푸시
echo "⚙️ Backend 이미지 빌드 중..."
docker build -t ${BACKEND_REPO}:${TAG} ./backend || {
    echo "❌ Backend 이미지 빌드에 실패했습니다."
    exit 1
}
docker tag ${BACKEND_REPO}:${TAG} ${ECR_REGISTRY}/${BACKEND_REPO}:${TAG}

echo "📤 Backend 이미지 푸시 중..."
docker push ${ECR_REGISTRY}/${BACKEND_REPO}:${TAG} || {
    echo "❌ Backend 이미지 푸시에 실패했습니다."
    exit 1
}

# Frontend 이미지 빌드 및 푸시
echo "🎨 Frontend 이미지 빌드 중..."
docker build -t ${FRONTEND_REPO}:${TAG} ./frontend || {
    echo "❌ Frontend 이미지 빌드에 실패했습니다."
    exit 1
}
docker tag ${FRONTEND_REPO}:${TAG} ${ECR_REGISTRY}/${FRONTEND_REPO}:${TAG}

echo "📤 Frontend 이미지 푸시 중..."
docker push ${ECR_REGISTRY}/${FRONTEND_REPO}:${TAG} || {
    echo "❌ Frontend 이미지 푸시에 실패했습니다."
    exit 1
}

echo "✅ 모든 이미지가 성공적으로 ECR에 푸시되었습니다!"
echo ""
echo "📋 이미지 URI:"
echo "Frontend: ${ECR_REGISTRY}/${FRONTEND_REPO}:${TAG}"
echo "Backend: ${ECR_REGISTRY}/${BACKEND_REPO}:${TAG}"
echo ""
echo "🚀 다음 단계: EC2에서 배포 스크립트를 실행하세요."