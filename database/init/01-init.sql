-- 데이터베이스 초기화 스크립트

-- 사용자 테이블
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TODO 테이블
CREATE TABLE todos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL
);

-- 픽셀 프레임 테이블
CREATE TABLE frames (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    theme VARCHAR(20) NOT NULL,
    level INTEGER NOT NULL,
    grid_size INTEGER DEFAULT 25,
    filled_count INTEGER DEFAULT 0,
    total_cells INTEGER DEFAULT 25,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    image_data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 픽셀 셀 테이블
CREATE TABLE pixel_cells (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    frame_id UUID NOT NULL REFERENCES frames(id) ON DELETE CASCADE,
    x INTEGER NOT NULL,
    y INTEGER NOT NULL,
    color VARCHAR(7) NOT NULL,
    filled BOOLEAN DEFAULT FALSE,
    fill_order INTEGER NOT NULL,
    filled_at TIMESTAMP NULL
);

-- 갤러리 테이블 (완성된 프레임)
CREATE TABLE gallery_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    frame_id UUID NOT NULL REFERENCES frames(id),
    name VARCHAR(100) NOT NULL,
    theme VARCHAR(20) NOT NULL,
    completed_at TIMESTAMP NOT NULL,
    image_data JSONB NOT NULL
);

-- 사용자 통계 테이블
CREATE TABLE user_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    today_completed INTEGER DEFAULT 0,
    total_completed INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_completed_date DATE NULL,
    completed_frames INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_todos_completed ON todos(completed);
CREATE INDEX idx_frames_user_id ON frames(user_id);
CREATE INDEX idx_frames_completed ON frames(completed);
CREATE INDEX idx_pixel_cells_frame_id ON pixel_cells(frame_id);
CREATE INDEX idx_gallery_items_user_id ON gallery_items(user_id);

-- 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 업데이트 트리거 적용
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at BEFORE UPDATE ON user_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();