ALTER TABLE friendships
ADD CONSTRAINT unique_friendship
UNIQUE (user_id, friend_id);