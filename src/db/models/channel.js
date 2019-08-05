export default (sequelize, DataTypes) => {
  const Channel = sequelize.define(
    'Channel',
    {
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      teamId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      public: {
        defaultValue: false,
        type: Sequelize.BOOLEAN
      }
    },
    {}
  );
  Channel.associate = models => {
    // associations can be defined here

    Channel.belongsTo(models.Team, {
      foreignkey: 'teamId'
    });

    Channel.belongsToMany(models.User, {
      through: 'ChannelMembers',
      foreignkey: 'channelId'
    });
  };
  return Channel;
};
