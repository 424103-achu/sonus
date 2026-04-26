CREATE INDEX idx_users_username_search
ON users (username text_pattern_ops);

CREATE INDEX idx_direct_chat_messages_chat_created
ON direct_chat_messages (chat_id, created_at DESC, message_id DESC);

CREATE INDEX idx_friendships_pair_status
ON friendships (user_id, friend_id, status);