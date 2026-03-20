import pool from "../utils/db.js";

const GRADUATION_DEGREE_PATTERN =
  "(bachelor|master|phd|degree|diploma|b\\.?tech|m\\.?tech|mba|bsc|msc|ba|ma)";

const mapEducationTypeCondition = (storyId) => {
  if (storyId === "graduation") {
    return `COALESCE(e.degree, '') ~* '${GRADUATION_DEGREE_PATTERN}'`;
  }

  return `COALESCE(e.degree, '') !~* '${GRADUATION_DEGREE_PATTERN}'`;
};

export const getStoryItems = async (userId, storyId) => {
  if (storyId === "close-friends") {
    const result = await pool.query(
      `SELECT
          f.friendship_id AS id,
          u.user_id AS friend_id,
          u.username,
          CONCAT(COALESCE(u.first_name, ''), ' ', COALESCE(u.last_name, '')) AS name
       FROM friendships f
       JOIN users u ON u.user_id = f.friend_id
       WHERE f.user_id = $1
         AND f.status = 'accepted'
         AND f.favorite = true
       ORDER BY f.friendship_id DESC`,
      [userId]
    );

    return result.rows;
  }

  if (storyId === "friends") {
    const result = await pool.query(
      `SELECT
          f.friendship_id AS id,
          u.user_id AS friend_id,
          u.username,
          CONCAT(COALESCE(u.first_name, ''), ' ', COALESCE(u.last_name, '')) AS name
       FROM friendships f
       JOIN users u ON u.user_id = f.friend_id
       WHERE f.user_id = $1
         AND f.status = 'accepted'
       ORDER BY f.friendship_id DESC`,
      [userId]
    );

    return result.rows;
  }

  if (storyId === "creative-works") {
    const result = await pool.query(
      `SELECT
          up.user_project_id AS id,
          p.project_name,
          p.description,
          up.role,
          up.joined_at
       FROM user_projects up
       JOIN projects p ON p.project_id = up.project_id
       WHERE up.user_id = $1
       ORDER BY up.user_project_id DESC`,
      [userId]
    );

    return result.rows;
  }

  if (storyId === "school" || storyId === "graduation") {
    const condition = mapEducationTypeCondition(storyId);
    const result = await pool.query(
      `SELECT
          e.education_id AS id,
          s.school_name,
          s.place,
          e.degree,
          e.field,
          e.start_year,
          e.end_year,
          e.comment
       FROM education e
       JOIN schools s ON s.school_id = e.school_id
       WHERE e.user_id = $1
         AND ${condition}
       ORDER BY e.education_id DESC`,
      [userId]
    );

    return result.rows;
  }

  return [];
};

export const addStoryItem = async (userId, storyId, payload) => {
  if (storyId === "friends") {
    const result = await pool.query(
      `INSERT INTO friendships (user_id, friend_id, favorite, status)
       VALUES ($1, $2, false, 'accepted')
       ON CONFLICT (user_id, friend_id)
       DO UPDATE SET
         favorite = false,
         status = 'accepted'
       RETURNING friendship_id AS id, friend_id`,
      [userId, payload.friend_id]
    );

    return result.rows[0];
  }

  if (storyId === "creative-works") {
    const projectResult = await pool.query(
      `INSERT INTO projects (project_name, description)
       VALUES ($1, $2)
       RETURNING project_id`,
      [payload.project_name, payload.description || null]
    );

    const projectId = projectResult.rows[0].project_id;

    const userProjectResult = await pool.query(
      `INSERT INTO user_projects (user_id, project_id, role, joined_at)
       VALUES ($1, $2, $3, $4)
       RETURNING user_project_id AS id`,
      [userId, projectId, payload.role || null, payload.joined_at || null]
    );

    return {
      id: userProjectResult.rows[0].id,
      project_name: payload.project_name,
      description: payload.description || "",
      role: payload.role || "",
      joined_at: payload.joined_at || null,
    };
  }

  if (storyId === "school" || storyId === "graduation") {
    const schoolResult = await pool.query(
      `INSERT INTO schools (school_name, place)
       VALUES ($1, $2)
       RETURNING school_id`,
      [payload.school_name, payload.place || null]
    );

    const schoolId = schoolResult.rows[0].school_id;

    const educationResult = await pool.query(
      `INSERT INTO education (user_id, school_id, degree, field, start_year, end_year, comment)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING education_id AS id`,
      [
        userId,
        schoolId,
        payload.degree || null,
        payload.field || null,
        payload.start_year || null,
        payload.end_year || null,
        payload.comment || null,
      ]
    );

    return {
      id: educationResult.rows[0].id,
      school_name: payload.school_name,
      place: payload.place || "",
      degree: payload.degree || "",
      field: payload.field || "",
      start_year: payload.start_year || null,
      end_year: payload.end_year || null,
      comment: payload.comment || "",
    };
  }

  return null;
};

export const deleteStoryItem = async (userId, storyId, itemId) => {
  if (storyId === "friends") {
    const result = await pool.query(
      `DELETE FROM friendships
       WHERE user_id = $1
         AND friend_id = $2
         AND favorite = false`,
      [userId, itemId]
    );

    return result.rowCount;
  }

  if (storyId === "creative-works") {
    const result = await pool.query(
      `DELETE FROM user_projects
       WHERE user_id = $1
         AND user_project_id = $2`,
      [userId, itemId]
    );

    return result.rowCount;
  }

  if (storyId === "school" || storyId === "graduation") {
    const result = await pool.query(
      `DELETE FROM education
       WHERE user_id = $1
         AND education_id = $2`,
      [userId, itemId]
    );

    return result.rowCount;
  }

  return 0;
};

export const updateStoryItem = async (userId, storyId, itemId, payload) => {
  if (storyId === "creative-works") {
    const ownershipResult = await pool.query(
      `SELECT project_id
       FROM user_projects
       WHERE user_id = $1
         AND user_project_id = $2
       LIMIT 1`,
      [userId, itemId]
    );

    if (!ownershipResult.rows.length) {
      return null;
    }

    const projectId = ownershipResult.rows[0].project_id;

    await pool.query(
      `UPDATE projects
       SET project_name = $1,
           description = $2
       WHERE project_id = $3`,
      [payload.project_name, payload.description || null, projectId]
    );

    const userProjectResult = await pool.query(
      `UPDATE user_projects
       SET role = $1,
           joined_at = $2
       WHERE user_id = $3
         AND user_project_id = $4
       RETURNING user_project_id AS id`,
      [payload.role || null, payload.joined_at || null, userId, itemId]
    );

    if (!userProjectResult.rows.length) {
      return null;
    }

    return {
      id: userProjectResult.rows[0].id,
      project_name: payload.project_name,
      description: payload.description || "",
      role: payload.role || "",
      joined_at: payload.joined_at || null,
    };
  }

  if (storyId === "school" || storyId === "graduation") {
    const ownershipResult = await pool.query(
      `SELECT school_id
       FROM education
       WHERE user_id = $1
         AND education_id = $2
       LIMIT 1`,
      [userId, itemId]
    );

    if (!ownershipResult.rows.length) {
      return null;
    }

    const schoolId = ownershipResult.rows[0].school_id;

    await pool.query(
      `UPDATE schools
       SET school_name = $1,
           place = $2
       WHERE school_id = $3`,
      [payload.school_name, payload.place || null, schoolId]
    );

    const educationResult = await pool.query(
      `UPDATE education
       SET degree = $1,
           field = $2,
           start_year = $3,
           end_year = $4,
           comment = $5
       WHERE user_id = $6
         AND education_id = $7
       RETURNING education_id AS id`,
      [
        payload.degree || null,
        payload.field || null,
        payload.start_year || null,
        payload.end_year || null,
        payload.comment || null,
        userId,
        itemId,
      ]
    );

    if (!educationResult.rows.length) {
      return null;
    }

    return {
      id: educationResult.rows[0].id,
      school_name: payload.school_name,
      place: payload.place || "",
      degree: payload.degree || "",
      field: payload.field || "",
      start_year: payload.start_year || null,
      end_year: payload.end_year || null,
      comment: payload.comment || "",
    };
  }

  return null;
};

export const getComfortZoneItems = async (userId, itemType) => {
  if (itemType === "movies") {
    const result = await pool.query(
      `SELECT
          fm.favorite_movie_id AS id,
          m.movie_name AS name,
          fm.comment
       FROM favorite_movies fm
       JOIN movies m ON m.movie_id = fm.movie_id
       WHERE fm.user_id = $1
       ORDER BY fm.favorite_movie_id DESC`,
      [userId]
    );

    return result.rows;
  }

  if (itemType === "foods") {
    const result = await pool.query(
      `SELECT
          ff.favorite_food_id AS id,
          f.food_name AS name,
          ff.comment
       FROM favorite_foods ff
       JOIN foods f ON f.food_id = ff.food_id
       WHERE ff.user_id = $1
       ORDER BY ff.favorite_food_id DESC`,
      [userId]
    );

    return result.rows;
  }

  return [];
};

export const addComfortZoneItem = async (userId, itemType, payload) => {
  if (itemType === "movies") {
    const lookup = await pool.query(
      `SELECT movie_id
       FROM movies
       WHERE LOWER(movie_name) = LOWER($1)
       LIMIT 1`,
      [payload.name]
    );

    let movieId = lookup.rows[0]?.movie_id;

    if (!movieId) {
      const insertedMovie = await pool.query(
        `INSERT INTO movies (movie_name)
         VALUES ($1)
         RETURNING movie_id`,
        [payload.name]
      );

      movieId = insertedMovie.rows[0].movie_id;
    }

    const existingFavorite = await pool.query(
      `SELECT favorite_movie_id AS id
       FROM favorite_movies
       WHERE user_id = $1
         AND movie_id = $2
       LIMIT 1`,
      [userId, movieId]
    );

    if (existingFavorite.rows.length) {
      return {
        id: existingFavorite.rows[0].id,
        name: payload.name,
        comment: payload.comment || "",
      };
    }

    const favoriteResult = await pool.query(
      `INSERT INTO favorite_movies (user_id, movie_id, comment)
       VALUES ($1, $2, $3)
       RETURNING favorite_movie_id AS id`,
      [userId, movieId, payload.comment || null]
    );

    return {
      id: favoriteResult.rows[0].id,
      name: payload.name,
      comment: payload.comment || "",
    };
  }

  if (itemType === "foods") {
    const lookup = await pool.query(
      `SELECT food_id
       FROM foods
       WHERE LOWER(food_name) = LOWER($1)
       LIMIT 1`,
      [payload.name]
    );

    let foodId = lookup.rows[0]?.food_id;

    if (!foodId) {
      const insertedFood = await pool.query(
        `INSERT INTO foods (food_name)
         VALUES ($1)
         RETURNING food_id`,
        [payload.name]
      );

      foodId = insertedFood.rows[0].food_id;
    }

    const existingFavorite = await pool.query(
      `SELECT favorite_food_id AS id
       FROM favorite_foods
       WHERE user_id = $1
         AND food_id = $2
       LIMIT 1`,
      [userId, foodId]
    );

    if (existingFavorite.rows.length) {
      return {
        id: existingFavorite.rows[0].id,
        name: payload.name,
        comment: payload.comment || "",
      };
    }

    const favoriteResult = await pool.query(
      `INSERT INTO favorite_foods (user_id, food_id, comment)
       VALUES ($1, $2, $3)
       RETURNING favorite_food_id AS id`,
      [userId, foodId, payload.comment || null]
    );

    return {
      id: favoriteResult.rows[0].id,
      name: payload.name,
      comment: payload.comment || "",
    };
  }

  return null;
};

export const deleteComfortZoneItem = async (userId, itemType, itemId) => {
  if (itemType === "movies") {
    const result = await pool.query(
      `DELETE FROM favorite_movies
       WHERE user_id = $1
         AND favorite_movie_id = $2`,
      [userId, itemId]
    );

    return result.rowCount;
  }

  if (itemType === "foods") {
    const result = await pool.query(
      `DELETE FROM favorite_foods
       WHERE user_id = $1
         AND favorite_food_id = $2`,
      [userId, itemId]
    );

    return result.rowCount;
  }

  return 0;
};

export const updateComfortZoneItem = async (userId, itemType, itemId, payload) => {
  if (itemType === "movies") {
    const lookup = await pool.query(
      `SELECT movie_id
       FROM movies
       WHERE LOWER(movie_name) = LOWER($1)
       LIMIT 1`,
      [payload.name]
    );

    let movieId = lookup.rows[0]?.movie_id;

    if (!movieId) {
      const insertedMovie = await pool.query(
        `INSERT INTO movies (movie_name)
         VALUES ($1)
         RETURNING movie_id`,
        [payload.name]
      );

      movieId = insertedMovie.rows[0].movie_id;
    }

    const result = await pool.query(
      `UPDATE favorite_movies
       SET movie_id = $1,
           comment = $2
       WHERE user_id = $3
         AND favorite_movie_id = $4
       RETURNING favorite_movie_id AS id`,
      [movieId, payload.comment || null, userId, itemId]
    );

    if (!result.rows.length) {
      return null;
    }

    return {
      id: result.rows[0].id,
      name: payload.name,
      comment: payload.comment || "",
    };
  }

  if (itemType === "foods") {
    const lookup = await pool.query(
      `SELECT food_id
       FROM foods
       WHERE LOWER(food_name) = LOWER($1)
       LIMIT 1`,
      [payload.name]
    );

    let foodId = lookup.rows[0]?.food_id;

    if (!foodId) {
      const insertedFood = await pool.query(
        `INSERT INTO foods (food_name)
         VALUES ($1)
         RETURNING food_id`,
        [payload.name]
      );

      foodId = insertedFood.rows[0].food_id;
    }

    const result = await pool.query(
      `UPDATE favorite_foods
       SET food_id = $1,
           comment = $2
       WHERE user_id = $3
         AND favorite_food_id = $4
       RETURNING favorite_food_id AS id`,
      [foodId, payload.comment || null, userId, itemId]
    );

    if (!result.rows.length) {
      return null;
    }

    return {
      id: result.rows[0].id,
      name: payload.name,
      comment: payload.comment || "",
    };
  }

  return null;
};
