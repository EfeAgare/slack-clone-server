import { gql } from 'apollo-server-express';

export default gql`
  type Channel {
    id: Int!
    name: String!
    public: Boolean!
    team: [Team!]!
    createdAt: String!
    updatedAt: String!
  }
`;
