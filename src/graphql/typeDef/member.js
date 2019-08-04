import { gql } from 'apollo-server-express';

export default gql`
  type Member {
    id: Int!
    team: [Team!]!
    user: [User!]!
    createdAt: String!
    updatedAt: String!
  }
`;
