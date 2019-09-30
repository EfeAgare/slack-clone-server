import { gql } from 'apollo-server-express';

export default gql`

  type DirectMessage {
    id: Int!
    text: String!
    sender: User!
    UserId: Int!
    receiverId: Int!
    createdAt: DateTime
  }
  extend type Query {
    directMessages(workSpaceId: Int!, otherUserId: Int!): [DirectMessage!]!
  }
  extend type Mutation {
    createDirectMessage(receiverId: Int!, text: String!, workSpaceId: Int!): Boolean!
  }

  extend type Subscription {
    displayDirectMessage(workSpaceId: Int!, receiverId: Int!): DirectMessage!
  }
`;
