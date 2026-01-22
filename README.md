# Pixel TODO

할 일을 완료하면 픽셀 아트가 완성되는 재미있는 TODO 앱입니다.

## Features

- **픽셀 아트 연동**: TODO를 완료할 때마다 액자의 칸이 하나씩 색칠됩니다
- **레벨 시스템**: 25개의 TODO를 완료하면 액자가 완성되고 다음 그림으로 진행
- **갤러리**: 완성한 픽셀 아트를 갤러리에서 확인
- **통계**: 완료한 TODO 수와 진행 상황 추적
- **로컬 저장**: 브라우저에 데이터가 자동 저장됩니다

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Storage**: Local Storage

## Getting Started

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

개발 서버 실행 후 [http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

## Project Structure

```
src/
├── app/              # Next.js App Router
├── components/       # React 컴포넌트
│   ├── Gallery.tsx      # 완성된 픽셀 아트 갤러리
│   ├── PixelFrame.tsx   # 픽셀 아트 액자
│   ├── StatsPanel.tsx   # 통계 패널
│   └── TodoList.tsx     # TODO 리스트
├── hooks/            # Custom Hooks
├── types/            # TypeScript 타입 정의
├── data/             # 픽셀 아트 데이터
└── utils/            # 유틸리티 함수
```
