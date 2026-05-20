const { Pool } = require("pg");

const connectionString =
  "postgresql://neondb_owner:npg_lYg4WyXnwve8@ep-lingering-tree-almuarr5.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require";

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;

/*
git add .
git commit -m "Оновив дизайн уроків"
git push origin master

cd '/d/сайт диплом'
cd javascript_learning

*/
