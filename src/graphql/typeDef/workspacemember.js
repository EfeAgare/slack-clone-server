import { gql } from 'apollo-server-express';

export default gql`
  type WorkSpaceMember {
    id: Int!
    workSpaceId: [WorkSpace!]!
    userId: [User!]!
    email: [User!]!
    url: String!
    createdAt: String!
    updatedAt: String!
  }

  type VoidResponse{
    ok: Boolean!
    errors: [Error!]

  }

  extend type Mutation {
    createWorkSpaceMembers(email: String!, workSpaceId: Int!, url: String!): VoidResponse!
  }
`;
