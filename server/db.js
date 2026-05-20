/*const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "lessonsdb",
  password: "sergtorit-22",
  port: 5432,
});

module.exports = pool;*/
const { Pool } = require("pg");

// Вставь СВОЮ строку из Neon вместо этого примера:
const connectionString =
  "postgresql://neondb_owner:npg_lYg4WyXnwve8@ep-lingering-tree-almuarr5.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require";

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false, // ОБЯЗАТЕЛЬНО для работы SSL в облаке Neon
  },
});

module.exports = pool;
