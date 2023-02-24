const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Post {
  id: ID!
  title: String!
  imageUrl: String!
  content: String
  createdAt: String!
  updatedAt: String!
}
  type User {
    id: ID! 
    name: String!
    email: String!
    password: String!
    status: String
    posts: [Post!]
  }
  type AuthData {
    token: String!
    userId: String!
  }
  type postData {
    id: ID!
    title: String!
    content: String!
  }
  input UserInputData {
    name: String!
    email: String!
    password: String!
  }
  input PostInputData {
    title: String!
    imageUrl: String!
    content: String!
  }
  type RootQuery {
    login(email: String!, password: String): AuthData!
    posts: [postData!]
  }
  type RootMutation {
    createUser(userInput : UserInputData): User!
    createPost(postInput: PostInputData): Post!
  }
  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);

// module.exports = buildSchema(`
//   type User {
//     name: String!
//   }

//   type RootMutation {
//     getUsers: User!
//   }

//   schema {
//     query: RootMutation
//   }
// `);
