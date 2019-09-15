import { gql } from 'apollo-server-express';

export default gql`
  type WorkSpace {
    id: Int!
    name: String!
    userId: String!
    workspacemembers: [WorkSpaceMember!]!
    channels: [Channel!]!
    createdAt: String!
    updatedAt: String!
  }

  type CreateWorkSpaceResponse {
    ok: Boolean!
    workSpace: WorkSpace!
    errors: [Error!]
  }

  extend type Query {
    allWorkSpace: [WorkSpace!]!
  }
  extend type Mutation {
    createWorkSpace(name: String!): CreateWorkSpaceResponse!
  }
`;
