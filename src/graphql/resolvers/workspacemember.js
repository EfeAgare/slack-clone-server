import { formatErrors } from '../../utils/formatError';
import { requiresAuth } from '../../utils/permissions';
import addUserToWorkspaceMail from "../../mailer/addUserToWorkspace"
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export default {
  Query: {
  },

  Mutation: {
    createWorkSpaceMembers: 
      async (root, {email, workSpaceId, url }, { models, user }, info) => {
        try {
          // const response = await models.sequelize.transaction(async () => {

          const workSpace =  await models.WorkSpace.findOne({where: {id: workSpaceId} }, {raw: true});
          if (workSpace.UserId !== user.id) {
            return {
              ok: false,
              errors: [{ path: 'email', message: 'You cannot add members to the team' }],
            };
          }

          
          const createToken = jwt.sign({ workSpaceId: workSpaceId }, process.env.SECRET, {
            expiresIn: '7d'
          });
          const error = addUserToWorkspaceMail(workSpace.name, email, url, createToken)
          if (error) {
            return {
              ok: false,
              errors: [{ path: 'unknown', message: 'Email failed to send' }],
            };
          }

          return {
            ok: true
          }
        
        // return { ok: true, response };
        } catch (error) {
          return {
            ok: false,
            errors: formatErrors(error, models)
          };
        }
      }
    
  }
};
