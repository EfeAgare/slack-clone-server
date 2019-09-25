import { gql } from 'apollo-server-express';

export default gql`
  type DirectMessage {
    id: Int!
    text: String!
    sender: User!
    receiverId: Int!
    createdAt: String!
  }
  extends type Query {
    directMessages(workSpaceId: Int!, otherUserId: Int!): [DirectMessage!]!
  }
  extends type Mutation {
    createDirectMessage(receiverId: Int!, text: String!, workSpaceId: Int!): Boolean!
  }
`;
