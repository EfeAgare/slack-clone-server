import { gql } from 'apollo-server-express';

export default gql`

  type Channel {
    id: Int!
    name: String!
    public: Boolean!
    workSpace: [WorkSpace!]!
    createdAt: DateTime
    updatedAt: DateTime
  }

  type ChannelResponse {
    ok: Boolean!
    channel: Channel
    errors: [Error!]
  }

  extend type Mutation {
    createChannel(
      workSpaceId: Int!
      name: String!
      public: Boolean = false
    ): ChannelResponse!
  }
`;
