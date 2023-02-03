const bcrypt = require('bcryptjs');
const User = require('../models/user');
const validator = require('validator');
module.exports = {
  createUser: async ({ userInput }) => {
    console.log('hello');
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

  getUsers: async () => {
    const users = await User.findAll();
    return users.map((user) => {
      console.log(user.dataValues.name);
      return {
        id: user.dataValues.id,
        name: user.dataValues.name,
        email: user.dataValues.email,
        password: user.dataValues.password,
      };
    });
  },
};

/*
curl -X POST http://localhost:8080/graphql -H "Content-Type: application/json" -d '{"query": "{ getUsers { name password }}"}'  
*/
