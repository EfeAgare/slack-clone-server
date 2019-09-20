import { gql } from 'apollo-server-express';

export default gql`
  type Message {
    id: Int!
    text: String!
    userId: Int!
    channelId: Int!
    createdAt: String!
    updatedAt: String!
  }

  type Response {
    ok: Boolean
  }
  
  extend type Query {
    channelMessages(channelId: Int!): [Message!]!
  }
  extend type Mutation {
    createMessage(channelId: Int!, text: String!): Response!
  }
`;
