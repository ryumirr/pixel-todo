# Pixel TODO - 3-Tier Architecture

픽셀 TODO 앱을 3-tier 아키텍처로 재구성한 버전입니다.

## 아키텍처 개요

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Presentation   │    │   Application   │    │      Data       │
│      Tier       │    │      Tier       │    │      Tier       │
│                 │    │                 │    │                 │
│  React/Next.js  │◄──►│ Node.js/Express │◄──►│   PostgreSQL    │
│   (Frontend)    │    │   (Backend)     │    │   (Database)    │
│                 │    │                 │    │                 │
│   Port: 3000    │    │   Port: 3001    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 프로젝트 구조

```
pixel-todo-3tier/
├── frontend/              # Presentation Tier
│   ├── src/
│   │   ├── app/          # Next.js App Router
│   │   ├── components/   # React 컴포넌트
│   │   ├── contexts/     # React Context (Auth)
│   │   ├── lib/          # API 클라이언트
│   │   └── ...
│   ├── Dockerfile
│   └── package.json
│
├── backend/               # Application Tier
│   ├── src/
│   │   ├── controllers/  # API 컨트롤러
│   │   ├── routes/       # Express 라우터
│   │   ├── middleware/   # 미들웨어 (인증 등)
│   │   ├── config/       # 설정 파일
│   │   └── types/        # TypeScript 타입
│   ├── Dockerfile
│   └── package.json
│
├── database/              # Data Tier
│   ├── init/             # 초기화 스크립트
│   └── migrations/       # 마이그레이션 파일
│
└── docker-compose.yml     # 전체 서비스 오케스트레이션
```

## 주요 변경사항

### 1. Presentation Tier (Frontend)
- **기술 스택**: React, Next.js, TypeScript, Tailwind CSS
- **주요 기능**:
  - 사용자 인증 (로그인/회원가입)
  - TODO 관리 UI
  - 픽셀 아트 시각화
  - 갤러리 및 통계 표시
- **API 통신**: Axios를 통한 REST API 호출
- **상태 관리**: React Context API

### 2. Application Tier (Backend)
- **기술 스택**: Node.js, Express, TypeScript
- **주요 기능**:
  - RESTful API 제공
  - JWT 기반 인증
  - 비즈니스 로직 처리
  - 데이터베이스 연동
- **API 엔드포인트**:
  - `/api/auth/*` - 인증 관련
  - `/api/todos/*` - TODO 관리
  - `/api/frames/*` - 픽셀 프레임 관리
  - `/api/stats/*` - 통계 조회

### 3. Data Tier (Database)
- **기술 스택**: PostgreSQL
- **주요 테이블**:
  - `users` - 사용자 정보
  - `todos` - TODO 아이템
  - `frames` - 픽셀 프레임
  - `pixel_cells` - 픽셀 셀 정보
  - `gallery_items` - 완성된 작품
  - `user_stats` - 사용자 통계

## 실행 방법

### Docker Compose 사용 (권장)

```bash
# 전체 서비스 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 서비스 중지
docker-compose down
```

### 개별 서비스 실행

#### 1. 데이터베이스 실행
```bash
docker run -d \
  --name pixel-todo-db \
  -e POSTGRES_DB=pixel_todo \
  -e POSTGRES_USER=pixel_user \
  -e POSTGRES_PASSWORD=pixel_pass \
  -p 5432:5432 \
  postgres:15-alpine
```

#### 2. 백엔드 실행
```bash
cd backend
npm install
npm run dev
```

#### 3. 프론트엔드 실행
```bash
cd frontend
npm install
npm run dev
```

## 환경 변수

### Backend (.env)
```
NODE_ENV=development
DATABASE_URL=postgresql://pixel_user:pixel_pass@localhost:5432/pixel_todo
JWT_SECRET=your-jwt-secret-key
PORT=3001
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## API 문서

### 인증 API
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인

### TODO API
- `GET /api/todos` - TODO 목록 조회
- `POST /api/todos` - TODO 생성
- `PUT /api/todos/:id` - TODO 수정
- `DELETE /api/todos/:id` - TODO 삭제

### 프레임 API
- `GET /api/frames/current` - 현재 프레임 조회
- `POST /api/frames/fill-cell` - 셀 색칠
- `GET /api/frames/gallery` - 갤러리 조회

### 통계 API
- `GET /api/stats` - 사용자 통계 조회

## 보안 고려사항

1. **인증**: JWT 토큰 기반 인증
2. **비밀번호**: bcrypt를 통한 해시화
3. **CORS**: 프론트엔드 도메인만 허용
4. **Helmet**: 보안 헤더 설정
5. **환경 변수**: 민감한 정보 분리

## 확장 가능성

1. **로드 밸런싱**: 백엔드 서버 다중화
2. **캐싱**: Redis를 통한 세션/데이터 캐싱
3. **CDN**: 정적 파일 배포 최적화
4. **모니터링**: 로그 수집 및 성능 모니터링
5. **CI/CD**: 자동화된 배포 파이프라인

## 개발 팀을 위한 가이드

### 새로운 API 추가
1. `backend/src/types/index.ts`에 타입 정의
2. `backend/src/controllers/`에 컨트롤러 생성
3. `backend/src/routes/`에 라우터 등록
4. `frontend/src/lib/api.ts`에 클라이언트 함수 추가

### 데이터베이스 스키마 변경
1. `database/migrations/`에 마이그레이션 파일 생성
2. 개발 환경에서 마이그레이션 실행
3. 타입 정의 업데이트

이제 3-tier 아키텍처로 확장 가능하고 유지보수가 용이한 픽셀 TODO 앱이 완성되었습니다!