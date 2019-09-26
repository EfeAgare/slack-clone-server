export default (sequelize, DataTypes) => {
  const Channel = sequelize.define(
    'Channel',
    {
      name: {
        type:  DataTypes.STRING,
        allowNull: false
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

    Channel.belongsTo(models.WorkSpace);

    Channel.hasMany(models.Message);


    Channel.belongsToMany(models.User, {
      through: 'ChannelMember',
      foreignkey: 'channelId'
    });
  };
  return Channel;
};
