

export default {
  routes: [
    {
      method: 'GET',
      path: '/user-course-order',
      handler: 'api::course-order.user-course-order.find',
      config: {
        middlewares: ['global::user-middleware'],
      },
    },
    {
      method: 'POST',
      path: '/user-course-order',
      handler: 'api::course-order.user-course-order.create',
      config: {
        middlewares: ['global::user-middleware'],
      },
    },
  ],
};