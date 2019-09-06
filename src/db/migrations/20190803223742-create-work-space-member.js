export default {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('WorkSpaceMembers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
          // User hasMany WorkSpaces n:n
          model: 'Users',
          key: 'id'
        }
      },
      workSpaceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
          // WorkSpaces hasMany User n:n
          model: 'WorkSpaces',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: queryInterface => queryInterface.dropTable('WorkSpaceMembers')
};
