-- 1. Clear tables (delete posts first because they depend on users)
TRUNCATE TABLE posts RESTART IDENTITY CASCADE;
TRUNCATE TABLE users RESTART IDENTITY CASCADE;

-- 2. Insert demo users
INSERT INTO users (username, email, password_hash, avatar_url)
VALUES 
('demo_user1', 'demo1@example.com', 'hashed_password_here', 'https://robohash.org/1.png'),
('demo_user2', 'demo2@example.com', 'hashed_password_here', 'https://robohash.org/2.png');

-- 3. Insert demo posts
INSERT INTO posts (user_id, title, content, image_url, likes_count, likes_exists)
VALUES
(1, 'Hello World', 'My first post linked to user 1', 'https://picsum.photos/300/200', 5, true),
(1, 'Another Day', 'A second post for demo_user1', 'https://picsum.photos/400/250', 2, false),
(2, 'Welcome!', 'First post from demo_user2', 'https://picsum.photos/350/220', 3, true);
