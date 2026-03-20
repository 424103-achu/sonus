-- Auto resequence triggers for tables where primary keys are not referenced by other tables.
-- NOTE:
-- 1) This keeps ids gapless after INSERT/DELETE.
-- 2) Triggers below are configured for INSERT/UPDATE/DELETE (all write-side CRUD operations).
-- 3) PostgreSQL does not support triggers on SELECT/READ operations.
-- 2) It intentionally excludes parent tables such as users, movies, foods, schools, projects
--    because changing those PK values would break foreign-key references.

CREATE OR REPLACE FUNCTION resequence_table_ids(p_table_name TEXT, p_pk_column TEXT, p_sequence_name TEXT)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    v_max_id BIGINT;
BEGIN
    EXECUTE format('LOCK TABLE %I IN EXCLUSIVE MODE', p_table_name);

    EXECUTE format(
        'WITH ordered AS (
           SELECT ctid, ROW_NUMBER() OVER (ORDER BY %I) AS new_id
           FROM %I
         )
         UPDATE %I t
         SET %I = o.new_id
         FROM ordered o
         WHERE t.ctid = o.ctid
           AND t.%I IS DISTINCT FROM o.new_id',
        p_pk_column,
        p_table_name,
        p_table_name,
        p_pk_column,
        p_pk_column
    );

    EXECUTE format('SELECT COALESCE(MAX(%I), 0) FROM %I', p_pk_column, p_table_name)
      INTO v_max_id;

    IF v_max_id = 0 THEN
        EXECUTE format('SELECT setval(%L, 1, false)', p_sequence_name);
    ELSE
        EXECUTE format('SELECT setval(%L, %s, true)', p_sequence_name, v_max_id);
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION trg_resequence_after_insert_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    PERFORM resequence_table_ids(TG_ARGV[0], TG_ARGV[1], TG_ARGV[2]);
    RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_resequence_favorite_movies ON favorite_movies;
CREATE TRIGGER trg_resequence_favorite_movies
AFTER INSERT OR UPDATE OR DELETE ON favorite_movies
FOR EACH STATEMENT
EXECUTE FUNCTION trg_resequence_after_insert_delete(
    'favorite_movies',
    'favorite_movie_id',
    'favorite_movies_favorite_movie_id_seq'
);

DROP TRIGGER IF EXISTS trg_resequence_favorite_foods ON favorite_foods;
CREATE TRIGGER trg_resequence_favorite_foods
AFTER INSERT OR UPDATE OR DELETE ON favorite_foods
FOR EACH STATEMENT
EXECUTE FUNCTION trg_resequence_after_insert_delete(
    'favorite_foods',
    'favorite_food_id',
    'favorite_foods_favorite_food_id_seq'
);

DROP TRIGGER IF EXISTS trg_resequence_friendships ON friendships;
CREATE TRIGGER trg_resequence_friendships
AFTER INSERT OR UPDATE OR DELETE ON friendships
FOR EACH STATEMENT
EXECUTE FUNCTION trg_resequence_after_insert_delete(
    'friendships',
    'friendship_id',
    'friendships_friendship_id_seq'
);

DROP TRIGGER IF EXISTS trg_resequence_education ON education;
CREATE TRIGGER trg_resequence_education
AFTER INSERT OR UPDATE OR DELETE ON education
FOR EACH STATEMENT
EXECUTE FUNCTION trg_resequence_after_insert_delete(
    'education',
    'education_id',
    'education_education_id_seq'
);

DROP TRIGGER IF EXISTS trg_resequence_user_projects ON user_projects;
CREATE TRIGGER trg_resequence_user_projects
AFTER INSERT OR UPDATE OR DELETE ON user_projects
FOR EACH STATEMENT
EXECUTE FUNCTION trg_resequence_after_insert_delete(
    'user_projects',
    'user_project_id',
    'user_projects_user_project_id_seq'
);
