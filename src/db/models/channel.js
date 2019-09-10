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

    // Channel.belongsTo(models.WorkSpace, {
    //   foreignKey: 'workSpaceId',
    // });

    // Channel.hasMany(models.Message, {
    //   foreignKey: 'channelId',
    // });


    // Channel.belongsToMany(models.User, {
    //   through: 'ChannelMember',
    //   foreignkey: 'channelId'
    // });
  };
  return Channel;
};
