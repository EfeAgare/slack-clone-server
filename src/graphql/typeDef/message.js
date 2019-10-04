import { gql } from 'apollo-server-express';


export default gql`
  scalar DateTime

  type Message {
    id: Int!
    text: String
    user: User!
    ChannelId: Int!
    path: String
    filename: String
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Response {
    ok: Boolean
  }

  extend type Subscription {
    newChannelMessage(channelId: Int!): Message!
  }
  extend type Query {
    channelMessages(channelId: Int!): [Message!]!
  }
  extend type Mutation {
    createMessage(channelId: Int!, text: String, file: Upload): Response!
  }
`;
