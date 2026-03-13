CREATE INDEX idx_users_username_search
ON users (username text_pattern_ops);