import { gql } from 'apollo-server-express';

export default gql`
  type WorkSpaceMember {
    id: Int!
    WorkSpaceId: [WorkSpace!]!
    user: [User!]!
    url: String!
    createdAt: String!
    updatedAt: String!
  }

  type VoidResponse{
    ok: Boolean!
    errors: [Error!]

  }
  extend type Query{
    getAllWorkSpaceMember(workSpaceId: Int!): [User!]!
  }

  extend type Mutation {
    createWorkSpaceMembers(email: String!, workSpaceId: Int!, url: String!): VoidResponse!
  }
`;
