import pkg from "pg";
const { Pool } = pkg;
const pool = new Pool({
  host: "localhost",
  user: "sonus", 
  password: "kushiadi",
  database: "sonus",
  port: 5432
});
pool.connect((err, client, release) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to PostgreSQL");
    release(); 
  }
});
export default pool;