import { gql } from 'apollo-server-express';

export default gql`
  type WorkSpaceMember {
    id: Int!
    workSpaceId: [WorkSpace!]!
    email: [User!]!
    createdAt: String!
    updatedAt: String!
  }

  type VoidResponse{
    ok: Boolean!
    errors: [Error!]

  }

  extend type Mutation {
    createWorkSpaceMembers(email: String! , workSpaceId: Int!): VoidResponse!
  }
`;
