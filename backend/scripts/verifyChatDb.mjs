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

async function main() {
  await client.connect();

  const tables = await client.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name IN ('direct_chats','direct_chat_messages') ORDER BY table_name;"
  );

  const indexes = await client.query(
    "SELECT indexname, tablename FROM pg_indexes WHERE schemaname='public' AND tablename IN ('direct_chat_messages','friendships') AND indexname IN ('idx_direct_chat_messages_chat_created','idx_friendships_pair_status') ORDER BY tablename, indexname;"
  );

  const constraints = await client.query(
    "SELECT tc.table_name, tc.constraint_name, tc.constraint_type FROM information_schema.table_constraints tc WHERE tc.table_schema='public' AND tc.table_name='direct_chats' AND tc.constraint_name IN ('direct_chat_unique_pair','direct_chat_ordered_pair','direct_chat_distinct_users') ORDER BY tc.constraint_name;"
  );

  const publicTableCount = await client.query(
    "SELECT COUNT(*)::int AS total FROM information_schema.tables WHERE table_schema='public';"
  );

  const usersTable = await client.query(
    "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='users') AS users_exists;"
  );

  console.log("TABLES", tables.rows);
  console.log("INDEXES", indexes.rows);
  console.log("CONSTRAINTS", constraints.rows);
  console.log("PUBLIC_TABLE_COUNT", publicTableCount.rows[0]?.total ?? 0);
  console.log("USERS_EXISTS", usersTable.rows[0]?.users_exists ?? false);

  await client.end();
}

main().catch(async (error) => {
  console.error("DB verification failed:", error.message);
  try {
    await client.end();
  } catch {}
  process.exit(1);
});
