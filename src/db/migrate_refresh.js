import models from './models';

models.sequelize.sync({}).then(() => {
  console.log(`database drop and refresh`)
});