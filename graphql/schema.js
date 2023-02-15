const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type User {
    id: ID! 
    name: String!
    email: String!
    password: String!
  }
  type AuthData {
    token: String!
    userId: String!
  }
  input UserInputData {
    name: String!
    email: String!
    password: String!
  }
  type RootQuery {
    login(email: String!, password: String): AuthData!
  }
  type RootMutation {
    createUser(userInput : UserInputData): User!
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
