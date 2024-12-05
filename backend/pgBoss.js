const { getDatabaseUri } = require("./config");

const PgBoss = require('pg-boss');
const boss = new PgBoss(getDatabaseUri());

boss.on('error', console.error)

module.exports = {
  boss
}
