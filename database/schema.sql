-- =========================================
-- USERS
-- =========================================
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,

    first_name VARCHAR(50),
    last_name VARCHAR(50),

    phone VARCHAR(20),
    gender VARCHAR(20),
    location VARCHAR(100),

    dob DATE,
    resume TEXT,

    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- MOVIES
-- =========================================
CREATE TABLE movies (
    movie_id SERIAL PRIMARY KEY,
    movie_name VARCHAR(150) NOT NULL
);

-- =========================================
-- FOODS
-- =========================================
CREATE TABLE foods (
    food_id SERIAL PRIMARY KEY,
    food_name VARCHAR(150) NOT NULL
);

-- =========================================
-- SCHOOLS
-- =========================================
CREATE TABLE schools (
    school_id SERIAL PRIMARY KEY,
    school_name VARCHAR(150) NOT NULL,
    place VARCHAR(100)
);

-- =========================================
-- PROJECTS
-- =========================================
CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    project_name VARCHAR(150) NOT NULL,
    description TEXT
);

-- =========================================
-- FAVORITE MOVIES
-- =========================================
CREATE TABLE favorite_movies (
    favorite_movie_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    movie_id INT NOT NULL,
    comment TEXT,

    CONSTRAINT fk_fav_movie_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_fav_movie_movie
        FOREIGN KEY (movie_id)
        REFERENCES movies(movie_id)
        ON DELETE CASCADE
);

-- =========================================
-- FAVORITE FOODS
-- =========================================
CREATE TABLE favorite_foods (
    favorite_food_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    food_id INT NOT NULL,
    comment TEXT,

    CONSTRAINT fk_fav_food_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_fav_food_food
        FOREIGN KEY (food_id)
        REFERENCES foods(food_id)
        ON DELETE CASCADE
);

-- =========================================
-- FRIENDSHIPS
-- =========================================
CREATE TABLE friendships (
    friendship_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    friend_id INT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_friend_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_friend_friend
        FOREIGN KEY (friend_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT no_self_friend
        CHECK (user_id <> friend_id)
);

-- =========================================
-- EDUCATION
-- =========================================
CREATE TABLE education (
    education_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    school_id INT NOT NULL,
    degree VARCHAR(100),
    field VARCHAR(100),
    start_year INT,
    end_year INT,
    comment TEXT,

    CONSTRAINT fk_edu_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_edu_school
        FOREIGN KEY (school_id)
        REFERENCES schools(school_id)
        ON DELETE CASCADE
);

-- =========================================
-- USER PROJECTS
-- =========================================
CREATE TABLE user_projects (
    user_project_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    project_id INT NOT NULL,
    role VARCHAR(100),
    joined_at DATE,

    CONSTRAINT fk_user_project_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_user_project_project
        FOREIGN KEY (project_id)
        REFERENCES projects(project_id)
        ON DELETE CASCADE
);