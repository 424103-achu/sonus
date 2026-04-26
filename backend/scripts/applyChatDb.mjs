import dotenv from "dotenv";
import pkg from "pg";

dotenv.config({ path: "./.env" });

const { Client } = pkg;

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432
});

const migrationSql = `
CREATE TABLE IF NOT EXISTS direct_chats (
  chat_id SERIAL PRIMARY KEY,
  user_low_id INT NOT NULL,
  user_high_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_direct_chat_user_low
    FOREIGN KEY (user_low_id)
    REFERENCES users(user_id)
    ON DELETE CASCADE,
  CONSTRAINT fk_direct_chat_user_high
    FOREIGN KEY (user_high_id)
    REFERENCES users(user_id)
    ON DELETE CASCADE,
  CONSTRAINT direct_chat_distinct_users
    CHECK (user_low_id <> user_high_id),
  CONSTRAINT direct_chat_ordered_pair
    CHECK (user_low_id < user_high_id),
  CONSTRAINT direct_chat_unique_pair
    UNIQUE (user_low_id, user_high_id)
);

CREATE TABLE IF NOT EXISTS direct_chat_messages (
  message_id SERIAL PRIMARY KEY,
  chat_id INT NOT NULL,
  sender_id INT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_direct_chat_message_chat
    FOREIGN KEY (chat_id)
    REFERENCES direct_chats(chat_id)
    ON DELETE CASCADE,
  CONSTRAINT fk_direct_chat_message_sender
    FOREIGN KEY (sender_id)
    REFERENCES users(user_id)
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_direct_chat_messages_chat_created
ON direct_chat_messages (chat_id, created_at DESC, message_id DESC);

CREATE INDEX IF NOT EXISTS idx_friendships_pair_status
ON friendships (user_id, friend_id, status);
`;

async function main() {
  await client.connect();
  await client.query("BEGIN");
  await client.query(migrationSql);
  await client.query("COMMIT");
  console.log("Chat DB migration applied successfully.");
  await client.end();
}

main().catch(async (error) => {
  console.error("Chat DB migration failed:", error.message);
  try {
    await client.query("ROLLBACK");
  } catch {}
  try {
    await client.end();
  } catch {}
  process.exit(1);
});
