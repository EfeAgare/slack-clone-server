import bcrypt from 'bcryptjs';

export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      username: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          isAlphanumeric: {
            args: true,
            msg: 'The username can only contains letters and numbers'
          },
          len: {
            args: [3, 25],
            msg: 'The username needs to be between 3 and 25 characters'
          }
        }
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isEmail: {
            args: true,
            msg: 'Invalid Email'
          }
        }
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [5, 100],
            msg: 'The password needs to be between 5 and 100 characters long'
          }
        }
      }
    },
    {
      hooks: {
        afterValidate: async (user, options) => {
          console.log(options)
          const hashPassword = await bcrypt.hashSync(user.password, 10);
          user.password = hashPassword;
        }
      }
    }
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
