import { gql } from 'apollo-server-express';

export default gql`
  type WorkSpace {
    id: Int!
    name: String!
    UserId: String!
    directMessageMembers: [User!]!
    channels: [Channel!]!
    createdAt: DateTime
    updatedAt: DateTime
  }

  type CreateWorkSpaceResponse {
    ok: Boolean!
    workSpace: WorkSpace
    errors: [Error!]
  }

  extend type Query {
    allWorkSpace: [WorkSpace!]!
    # allInvitedWorkSpace: [WorkSpace!]!
  }
  extend type Mutation {
    createWorkSpace(name: String!): CreateWorkSpaceResponse!
  }
`;
