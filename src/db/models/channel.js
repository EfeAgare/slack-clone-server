export default (sequelize, DataTypes) => {
  const Channel = sequelize.define(
    'Channel',
    {
      name: {
        type:  DataTypes.STRING,
        allowNull: false
      },
      workSpaceId: {
        allowNull: false,
        type:  DataTypes.INTEGER
      },
      public: {
        defaultValue: false,
        type:  DataTypes.BOOLEAN
      }
    },
    {}
  );
  Channel.associate = models => {
    // associations can be defined here

    // Channel.belongsTo(models.Team, {
    //   foreignKey: 'workSpaceId',
    //   as: "workSpace"
    // });

    Channel.belongsToMany(models.User, {
      through: 'ChannelMembers',
      foreignkey: 'channelId'
    });
  };
  return Channel;
};
