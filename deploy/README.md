# AWS ECR + EC2 배포 가이드

이 가이드는 Pixel TODO 애플리케이션을 AWS ECR에 업로드하고 EC2에서 실행하는 방법을 설명합니다.

## 사전 준비사항

### 1. AWS 계정 및 권한
- AWS 계정 필요
- ECR, EC2 권한이 있는 IAM 사용자
- AWS CLI 설치 및 설정

### 2. 로컬 환경
- Docker 설치
- AWS CLI 설치
- Git 설치

## 배포 단계

### 1단계: 로컬에서 이미지 빌드 및 ECR 푸시

```bash
# 1. AWS CLI 설정
aws configure
# Access Key ID, Secret Access Key, Region(ap-northeast-2), Output format(json) 입력

# 2. 스크립트 실행 권한 부여
chmod +x deploy/build-and-push.sh

# 3. 스크립트 내 AWS_ACCOUNT_ID 수정
# deploy/build-and-push.sh 파일에서 YOUR_AWS_ACCOUNT_ID를 실제 계정 ID로 변경

# 4. 이미지 빌드 및 푸시
./deploy/build-and-push.sh
```

### 2단계: EC2 인스턴스 생성

1. **EC2 인스턴스 생성**
   - AMI: Amazon Linux 2023
   - 인스턴스 타입: t3.medium 이상 권장
   - 키 페어: 새로 생성하거나 기존 것 사용
   - 보안 그룹: HTTP(80), HTTPS(443), SSH(22), 3000, 3001 포트 허용

2. **보안 그룹 설정**
   ```
   Type        Protocol    Port Range    Source
   SSH         TCP         22           0.0.0.0/0
   HTTP        TCP         80           0.0.0.0/0
   HTTPS       TCP         443          0.0.0.0/0
   Custom TCP  TCP         3000         0.0.0.0/0
   Custom TCP  TCP         3001         0.0.0.0/0
   ```

### 3단계: EC2 인스턴스 설정

```bash
# 1. EC2에 SSH 접속
ssh -i your-key.pem ec2-user@YOUR_EC2_PUBLIC_IP

# 2. 초기 설정 스크립트 다운로드 및 실행
curl -O https://raw.githubusercontent.com/your-repo/pixel-todo/main/deploy/ec2-setup.sh
chmod +x ec2-setup.sh
./ec2-setup.sh

# 3. 새 터미널 세션 시작 또는 Docker 그룹 적용
newgrp docker

# 4. AWS CLI 설정
aws configure
```

### 4단계: 애플리케이션 배포

```bash
# 1. 배포 파일 다운로드
mkdir -p ~/pixel-todo-deploy
cd ~/pixel-todo-deploy

# 배포 스크립트와 docker-compose 파일 다운로드
curl -O https://raw.githubusercontent.com/your-repo/pixel-todo/main/deploy/deploy-to-ec2.sh
curl -O https://raw.githubusercontent.com/your-repo/pixel-todo/main/deploy/docker-compose.prod.yml
curl -O https://raw.githubusercontent.com/your-repo/pixel-todo/main/database/init/01-init.sql

# 2. 스크립트 실행 권한 부여
chmod +x deploy-to-ec2.sh

# 3. 스크립트 내 설정 수정
# deploy-to-ec2.sh에서 YOUR_AWS_ACCOUNT_ID를 실제 값으로 변경

# 4. 배포 실행
./deploy-to-ec2.sh

# 5. .env 파일 수정
nano .env
# 다음 값들을 실제 값으로 변경:
# - YOUR_EC2_PUBLIC_IP
# - DB_PASSWORD
# - JWT_SECRET

# 6. 애플리케이션 재시작
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

## 환경 변수 설정

`.env` 파일에서 다음 값들을 수정해야 합니다:

```bash
# AWS 설정
AWS_ACCOUNT_ID=123456789012  # 실제 AWS 계정 ID
AWS_REGION=ap-northeast-2

# 데이터베이스 설정
DB_PASSWORD=your_secure_db_password_here  # 강력한 비밀번호

# JWT 시크릿
JWT_SECRET=your_super_secure_jwt_secret_key_here  # 강력한 랜덤 문자열

# URL 설정
API_URL=http://3.34.123.45:3001  # EC2 퍼블릭 IP
FRONTEND_URL=http://3.34.123.45:3000  # EC2 퍼블릭 IP
```

## 유용한 명령어

### 애플리케이션 관리
```bash
# 컨테이너 상태 확인
docker-compose -f docker-compose.prod.yml ps

# 로그 확인
docker-compose -f docker-compose.prod.yml logs -f

# 특정 서비스 로그 확인
docker-compose -f docker-compose.prod.yml logs -f backend

# 애플리케이션 재시작
docker-compose -f docker-compose.prod.yml restart

# 애플리케이션 중지
docker-compose -f docker-compose.prod.yml down

# 애플리케이션 시작
docker-compose -f docker-compose.prod.yml up -d
```

### 이미지 업데이트
```bash
# 최신 이미지 다운로드
docker-compose -f docker-compose.prod.yml pull

# 컨테이너 재생성
docker-compose -f docker-compose.prod.yml up -d --force-recreate
```

## 트러블슈팅

### 1. 컨테이너가 시작되지 않는 경우
```bash
# 로그 확인
docker-compose -f docker-compose.prod.yml logs

# 개별 컨테이너 로그 확인
docker logs pixel-todo-web
docker logs pixel-todo-api
docker logs pixel-todo-db
```

### 2. 데이터베이스 연결 오류
- `.env` 파일의 `DATABASE_URL` 확인
- PostgreSQL 컨테이너 상태 확인
- 네트워크 연결 확인

### 3. 프론트엔드에서 API 호출 실패
- `.env` 파일의 `NEXT_PUBLIC_API_URL` 확인
- EC2 보안 그룹에서 3001 포트 허용 확인
- 백엔드 컨테이너 상태 확인

## 보안 고려사항

1. **환경 변수**: 강력한 비밀번호와 JWT 시크릿 사용
2. **보안 그룹**: 필요한 포트만 열기
3. **SSL/TLS**: 프로덕션에서는 HTTPS 사용 권장
4. **데이터베이스**: 외부 접근 차단, 백업 설정
5. **모니터링**: CloudWatch 로그 설정

## 접속 확인

배포 완료 후 다음 URL로 접속 확인:

- **Frontend**: `http://YOUR_EC2_PUBLIC_IP:3000`
- **Backend Health Check**: `http://YOUR_EC2_PUBLIC_IP:3001/health`
- **API 문서**: `http://YOUR_EC2_PUBLIC_IP:3001/api`

성공적으로 배포되면 픽셀 TODO 애플리케이션을 사용할 수 있습니다!