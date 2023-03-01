const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Post = require('../models/post');
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
      status: userInput.status,
      posts: userInput.posts,
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
  createPost: async ({ postInput }, req) => {
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    const errors = [];
    if (
      validator.isEmpty(postInput.title) ||
      !validator.isLength(postInput.title, { min: 5 })
    ) {
      errors.push({ message: 'Title is invalid' });
    }
    if (
      validator.isEmpty(postInput.content) ||
      !validator.isLength(postInput.content, { min: 5 })
    ) {
      errors.push({ message: 'Content is invalid' });
    }
    if (errors.length > 0) {
      console.log(errors);
      const error = new Error('Invalid input.');
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const user = await User.findByPk(req.userId);
    if (!user) {
      const error = new Error('Invalid user.');
      error.data = errors;
      error.code = 401;
      throw error;
    }
    console.log(user.dataValues);
    console.log(postInput.title);
    console.log(postInput.content);
    const post = await Post.create({
      title: postInput.title,
      imageUrl: postInput.imageUrl,
      content: postInput.content,
      userId: user.dataValues.id,
    });
    console.log(post);
    console.log('debug return');
    const debugObj = {
      ...post.dataValues,
      // createdAt: post.dataValues.createdAt.toISOString(),
      // updatedAt: post.dataValues.updatedAt.toISOString(),
    };
    console.log(debugObj);
    // user.posts.push(post);
    return {
      ...post.dataValues,
      // createdAt: post.dataValues.createdAt.toISOString(),
      // updatedAt: post.dataValues.updatedAt.toISOString(),
    };
  },
  posts: async (req) => {
    // if (!req.isAuth) {
    //   const error = new Error('Not authenticated!');
    //   error.code = 401;
    //   throw error;
    // }
    console.log('findallposts');
    const posts = await Post.findAll();
    console.log('Posts');
    return posts.map((post) => {
      console.log(post.dataValues.id);
      console.log(post.dataValues.title);
      return {
        id: post.dataValues.id,
        title: post.dataValues.title,
        content: post.dataValues.content,
        createdAt: post.dataValues.createdAt,
      };
    });
  },
  updatePost: async ({ id, postInput }, req) => {
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    const post = await Post.findByPk(id);
    console.log(post);
    if (!post) {
      const error = new Error('No post found!');
      error.code = 404;
      throw error;
    }
    // if (post.creator.id.toString() !== req.userId.toString()) {
    //   const error = new Error('Not authorized!');
    //   error.code = 403;
    //   throw error;
    // }
    const errors = [];
    if (
      validator.isEmpty(postInput.title) ||
      !validator.isLength(postInput.title, { min: 5 })
    ) {
      errors.push({ message: 'Title is invalid' });
    }
    if (
      validator.isEmpty(postInput.content) ||
      !validator.isLength(postInput.content, { min: 5 })
    ) {
      errors.push({ message: 'Content is invalid' });
    }
    if (errors.length > 0) {
      console.log(errors);
      const error = new Error('Invalid input.');
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const result = await Post.update(
      {
        title: postInput.title,
        content: postInput.content,
      },
      {
        where: { id: id },
        returning: true,
      }
    );
    console.log(result[1][0]);
    const postUpdated = result[1][0].dataValues;
    console.log(postUpdated);
    return {
      ...postUpdated,
    };
  },
  deletePost: async ({ id }, req) => {
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    const post = await Post.findByPk(id);
    console.log(post);
    if (!post) {
      const error = new Error('No post found!');
      error.code = 404;
      throw error;
    }
    const result = await Post.destroy({
      where: { id: id },
      returning: true,
    });
    console.log(result[1][0]);
    const postDeleted = result[1][0].dataValues;
    console.log(postDeleted);
    return {
      ...postDeleted,
    };
  },
};

/*
curl -X POST http://localhost:8080/graphql -H "Content-Type: application/json" -d '{"query": "{ getUsers { name password }}"}'  
*/
