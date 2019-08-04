export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      username: { type: DataTypes.STRING, unique: true },
      email: { type: DataTypes.STRING, unique: true },
      password: DataTypes.STRING
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
