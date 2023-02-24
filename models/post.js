const Sequelize = require('sequelize');
const sequelize = require('../db.config');

const Post = sequelize.define('post', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  imageUrl: {
    type: Sequelize.STRING,
  },
  content: {
    type: Sequelize.STRING,
  },
});

module.exports = Post;
