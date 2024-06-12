import { factories } from '@strapi/strapi';
import { sendResponseDetail } from '../../../utils';
import { identity, omit, pickBy } from 'lodash';
import { UserRegisterDTO } from '../dto';


export default factories.createCoreController('api::object-user.object-user', ({ strapi }) => ({
  async register(ctx) {
    try {
      const requestBody = ctx.request.body;
      const objectUser = await strapi.entityService.findOne('api::object-user.object-user', requestBody.objectUserId)
      const knowledge = await strapi.entityService.findOne('api::knowledge.knowledge', requestBody.knowledge_id)
      if (!objectUser) {
        ctx.throw(400, "Object user not found");
      }
      if (!knowledge) {
        ctx.throw(400, "Knowledge user not found")
      }
      let media
      if (requestBody.media_id) {
        media = await strapi.entityService.findOne('plugin::upload.file', requestBody.media_id)
        if (!media) {
          ctx.throw(400, "Media not found")
        }
      }
      const user = new UserRegisterDTO()
      user.email = requestBody.email
      user.fullName = requestBody.fullName
      user.password = requestBody.password
      user.username = requestBody.username
      user.dateOfBirth = requestBody.dateOfBirth
      const newCustomer = await strapi.entityService.create('plugin::users-permissions.user', {
        data: {
          ...user,
          provider: 'local',
          confirmed: true,
          object_user: objectUser.id,
          knowledge: knowledge.id,
          avatar: media
        },
      });
      ctx.body = newCustomer;
    } catch (error) {
      ctx.throw(400, error.message);
    }
  },
  async profile(ctx) {
    try {
      const user_id = ctx.user_id;
      const user = await strapi.entityService.findOne(
        'plugin::users-permissions.user',
        user_id,
        { 'populate': '*', 'fields': '*' }
      );
      return sendResponseDetail(omit(user, ['password']))
    } catch (error) {
      ctx.throw(400, error.message);
    }
  },
  async updateProfile(ctx) {
    try {
      const user_id = ctx.user_id
      const body = ctx.request.body
      let media
      if (body.media_id) {
        media = await strapi.entityService.findOne('plugin::upload.file', body.media_id)
        if (!media) {
          ctx.throw(400, "Media not found")
        }
      }
      let objectUser
      if (body.objectUserId) {
        objectUser = await strapi.entityService.findOne('api::object-user.object-user', body.objectUserId)
        if (!objectUser) ctx.throw(400, "Object user not found");
      }
      let knowledge
      if (body.knowledge_id) {
        knowledge = await strapi.entityService.findOne('api::knowledge.knowledge', body.knowledge)
        if (!knowledge) ctx.throw(400, "Knowledge user not found");
      }
      const data = {
        fullName: body.fullName,
        username: body.username,
        email: body.email,
        dateOfBirth: body.dateOfBirth,
        object_user: objectUser,
        knowledge: knowledge,
        avatar: media
      }
      const user = await strapi.entityService.update('plugin::users-permissions.user', user_id, {
        data: pickBy(data, identity())
      })
      return sendResponseDetail(user)
    } catch (error) {
      ctx.throw(400, error.message);
    }
  }
}));