import pool from "../utils/db.js";
export const createUser=async(uid,email,password)=>{
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const {rows}=
    }
}