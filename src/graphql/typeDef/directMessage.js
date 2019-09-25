import { gql } from 'apollo-server-express';

export default gql`

  type DirectMessage {
    id: Int!
    text: String!
    sender: User!
    receiverId: Int!
    createdAt: DateTime
  }
  extend type Query {
    directMessages(workSpaceId: Int!, otherUserId: Int!): [DirectMessage!]!
  }
  extend type Mutation {
    createDirectMessage(receiverId: Int!, text: String!, workSpaceId: Int!): Boolean!
  }
`;
