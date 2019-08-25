import { gql } from 'apollo-server-express';

export default gql`
  type Team {
    id: Int!
    name: String!
    owner: String!
    member: [Member!]!
    channels: [Channel!]!
    createdAt: String!
    updatedAt: String!
  }

  type CreateTeamResponse {
    ok: Boolean!
    errors: [Error!]
  }

  extend type Query {
    allTeams: [Team!]!
  }
  extend type Mutation {
    createTeam(name: String!): CreateTeamResponse!
  }
`;
