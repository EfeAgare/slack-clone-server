import { gql } from 'apollo-server-express';

export default gql`
  type WorkSpace {
    id: Int!
    name: String!
    userId: String!
    member: [Member!]!
    channels: [Channel!]!
    createdAt: String!
    updatedAt: String!
  }

  type CreateWorkSpaceResponse {
    ok: Boolean!
    errors: [Error!]
  }

  extend type Query {
    allWorkSpace: [WorkSpace!]!
  }
  extend type Mutation {
    createWorkSpace(name: String!): CreateWorkSpaceResponse!
  }
`;
