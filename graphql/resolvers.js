const bcrypt = require('bcryptjs');
const User = require('../models/user');
const validator = require('validator');
const jwt = require('jsonwebtoken');

module.exports = {
  createUser: async ({ userInput }) => {
    const errors = [];
    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: 'E-Mail is invalid' });
    }
    if (
      validator.isEmpty(userInput.password) ||
      !validator.isLength(userInput.password, { min: 5 })
    ) {
      errors.push({ message: 'Password too short' });
    }
    if (errors.length > 0) {
      const error = new Error('Invalid input.');
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const existingUser = await User.findOne({
      where: { email: userInput.email },
    });
    if (existingUser) {
      const error = new Error('User exists already');
      throw error;
    }
    const hashedPw = await bcrypt.hash(userInput.password, 12);
    const createdUser = await User.create({
      name: userInput.name,
      email: userInput.email,
      password: hashedPw,
    });
    console.log({ ...createdUser });
    return { ...createdUser.dataValues };
  },

  login: async ({ email, password }) => {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      const error = new Error('User not found');
      error.code = 401;
      throw error;
    }
    console.log(user.id);
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Password is incorrect');
      error.code = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        userId: user.id.toString(),
        email: user.email,
      },
      'somesupersecretsecret',
      { expiresIn: '1h' }
    );
    return { token: token, userId: user.id.toString() };
  },

  // getUsers: async () => {
  //   const users = await User.findAll();
  //   return users.map((user) => {
  //     console.log(user.dataValues.name);
  //     return {
  //       id: user.dataValues.id,
  //       name: user.dataValues.name,
  //       email: user.dataValues.email,
  //       password: user.dataValues.password,
  //     };
  //   });
  // },
};

/*
curl -X POST http://localhost:8080/graphql -H "Content-Type: application/json" -d '{"query": "{ getUsers { name password }}"}'  
*/
