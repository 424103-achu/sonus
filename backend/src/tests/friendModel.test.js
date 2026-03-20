/**
 * Friend Model Test Suite
 * 
 * Tests for friend-related functionality:
 * - Adding close friends (including duplicate additions)
 * - Retrieving close friends
 * - Removing close friends
 * 
 * Run with: npm test -- --testPathPattern="friendModel"
 */

import { pool } from "../utils/db.js";
import {
  addCloseFriend,
  getCloseFriends,
  removeCloseFriend
} from "../models/friendModel.js";

describe("Friend Model Tests", () => {
  
  // Setup: Create test users before running tests
  beforeAll(async () => {
    try {
      // Create test users
      await pool.query(
        `INSERT INTO users (username, email, password_hash) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (email) DO NOTHING`,
        ["testuser1", "test1@example.com", "hashed_password"]
      );
      
      await pool.query(
        `INSERT INTO users (username, email, password_hash) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (email) DO NOTHING`,
        ["testuser2", "test2@example.com", "hashed_password"]
      );
      
      // Create friendship between them
      await pool.query(
        `INSERT INTO friendships (user_id, friend_id, status) 
         SELECT u1.user_id, u2.user_id, 'accepted'
         FROM users u1, users u2 
         WHERE u1.username = $1 AND u2.username = $2
         ON CONFLICT (user_id, friend_id) DO NOTHING`,
        ["testuser1", "testuser2"]
      );
    } catch (err) {
      console.error("Setup error:", err);
    }
  });

  // Teardown: Delete test users after all tests
  afterAll(async () => {
    try {
      await pool.query(`DELETE FROM friendships WHERE user_id IN (
        SELECT user_id FROM users WHERE username LIKE 'testuser%'
      )`);
      
      await pool.query(
        `DELETE FROM users WHERE username LIKE 'testuser%'`
      );
    } catch (err) {
      console.error("Teardown error:", err);
    }
  });

  test("addCloseFriend should mark friend as favorite (first time)", async () => {
    const users = await pool.query(
      `SELECT user_id FROM users WHERE username IN ('testuser1', 'testuser2')`
    );
    
    const userId = users.rows[0].user_id;
    const friendId = users.rows[1].user_id;

    const result = await addCloseFriend(userId, friendId);
    
    expect(result).toBeDefined();
    expect(result.favorite).toBe(true);
    expect(result.status).toBe("accepted");
  });

  test("addCloseFriend should handle duplicate additions (idempotent)", async () => {
    const users = await pool.query(
      `SELECT user_id FROM users WHERE username IN ('testuser1', 'testuser2')`
    );
    
    const userId = users.rows[0].user_id;
    const friendId = users.rows[1].user_id;

    // First addition
    const result1 = await addCloseFriend(userId, friendId);
    expect(result1.favorite).toBe(true);

    // Second addition (should not throw error)
    const result2 = await addCloseFriend(userId, friendId);
    expect(result2.favorite).toBe(true);

    // Verify only one record exists
    const count = await pool.query(
      `SELECT COUNT(*) FROM friendships WHERE user_id = $1 AND friend_id = $2`,
      [userId, friendId]
    );
    expect(parseInt(count.rows[0].count)).toBe(1);
  });

  test("getCloseFriends should return favorite friends", async () => {
    const users = await pool.query(
      `SELECT user_id FROM users WHERE username IN ('testuser1', 'testuser2')`
    );
    
    const userId = users.rows[0].user_id;

    const closeFriends = await getCloseFriends(userId);
    
    expect(Array.isArray(closeFriends)).toBe(true);
    expect(closeFriends.length).toBeGreaterThan(0);
    expect(closeFriends[0]).toHaveProperty("friend_id");
  });

  test("removeCloseFriend should unmark friend as favorite", async () => {
    const users = await pool.query(
      `SELECT user_id FROM users WHERE username IN ('testuser1', 'testuser2')`
    );
    
    const userId = users.rows[0].user_id;
    const friendId = users.rows[1].user_id;

    // First mark as close friend
    await addCloseFriend(userId, friendId);

    // Then remove
    const result = await removeCloseFriend(userId, friendId);
    
    expect(result.favorite).toBe(false);
  });
});

/**
 * Manual Testing Guide (without Jest):
 * 
 * 1. Open terminal in backend directory
 * 2. Run: node
 * 3. Copy and paste these commands:
 * 
 * import { pool } from "./src/utils/db.js";
 * import { addCloseFriend } from "./src/models/friendModel.js";
 * 
 * // Get any two connected friends
 * const friendships = await pool.query("SELECT * FROM friendships LIMIT 1");
 * const userId = friendships.rows[0].user_id;
 * const friendId = friendships.rows[0].friend_id;
 * 
 * // Test: Add as close friend (first time)
 * console.log("Adding friend first time...");
 * const result1 = await addCloseFriend(userId, friendId);
 * console.log("Result 1:", result1);
 * 
 * // Test: Add same friend again (should update, not error)
 * console.log("Adding same friend second time...");
 * const result2 = await addCloseFriend(userId, friendId);
 * console.log("Result 2:", result2);
 * 
 * // Verify only one record
 * const check = await pool.query(
 *   "SELECT COUNT(*) as count FROM friendships WHERE user_id = $1 AND friend_id = $2",
 *   [userId, friendId]
 * );
 * console.log("Record count:", check.rows[0].count);
 * 
 * // Cleanup
 * await pool.end();
 */
