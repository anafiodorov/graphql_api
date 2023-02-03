const Sequelize = require('sequelize');
const sequelize = require('../db.config');

const PostSchema = sequelize.define('post', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  content: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  creator: {
    type: Sequelize.INTEGER,
    ref: 'User',
    rallowNull: false,
  },
});

module.exports = PostSchema;
