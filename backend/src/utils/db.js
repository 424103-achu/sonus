import mysql from "mysql2";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Ap25m@6430",
  database: "sonus"
});

connection.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

export default connection;
