export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      username: {
        allowNull: false,
        type:  DataTypes.STRING
      },
      email: {
        allowNull: false,
        type:  DataTypes.STRING
      },
      password: {
        allowNull: false,
        type:  DataTypes.STRING
      }
    },
    {}
  );
  User.associate = models => {
    User.belongsToMany(models.Team, {
      through: 'member',
      foreignkey: 'userId'
    });

    User.hasMany(models.Message);

    User.belongsToMany(models.Channel, {
      through: 'ChannelMembers',
      foreignkey: 'userId'
    });
    // associations can be defined here
  };
  return User;
};
