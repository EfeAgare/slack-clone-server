import { gql } from 'apollo-server-express';

export default gql`
  type ChannelMember {
    id: Int!
    channel: [Channel!]!
    users: [User!]!
  }
`;
