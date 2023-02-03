const Sequelize = require('sequelize');
require('dotenv').config({ path: './dev.env' });

const user = process.env.DB_USER;
const host = process.env.DB_HOST;
const database = process.env.DB_DATABASE;
const password = process.env.DB_PASSWORD;

const sequelize = new Sequelize(database, user, password, {
  dialect: 'postgres',
  host: host,
});

module.exports = sequelize;
