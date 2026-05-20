const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "lessonsdb",
  password: "sergtorit-22",
  port: 5432,
});

module.exports = pool;
