import { factories } from '@strapi/strapi';
import { CreateCourseOrderDTO } from '../dto';
import { sendResponseDetail, sendResponsePagination, validatorHelper } from '../../../utils';

export default factories.createCoreController('api::course-order.course-order', ({ strapi }) => ({
  async find(ctx) {
    try {
      const user_id = ctx.user_id;
      const { page = 1, pageSize = 10 } = ctx.request.query;
      const filters = { user: user_id }
      const [data, total] = await Promise.all([
        strapi.entityService.findMany('api::course-order.course-order', {
          filters,
          populate: {
            courses: {
              populate: {
                image: true,
                teacher: {
                  populate: {
                    avatar: true
                  }
                }
              }
            }
          },
          sort: { createdAt: 'desc' },
          start: parseInt(page) - 1,
          limit: parseInt(pageSize),
        }),
        strapi.entityService.count('api::course-order.course-order', {
          filters: filters
        })
      ])
      return sendResponsePagination(data, Number(page), Number(pageSize), total)
    } catch (error) {
      ctx.throw(400, error.message);
    }
  },
  async create(ctx) {
    try {
      const user_id = ctx.user_id;
      const body = new CreateCourseOrderDTO();
      body.course_ids = ctx.request.body.course_ids;
      body.note = ctx.request.body.note;
      await validatorHelper<CreateCourseOrderDTO>(body, ctx)
      const response = await strapi.entityService.create('api::course-order.course-order', {
        data: {
          user: user_id,
          note: body.note,
          courses: body.course_ids,
        }
      })
      return sendResponseDetail(response)
    } catch (error) {
      ctx.throw(400, error.message);
    }
  }
}))