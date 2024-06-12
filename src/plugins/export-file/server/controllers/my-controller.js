'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('export-file')
      .service('myService')
      .getWelcomeMessage();
  },
});
