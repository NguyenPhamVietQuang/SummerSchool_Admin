/**
 * `user-middleware` middleware
 */

import { Strapi } from '@strapi/strapi';
import jwt from "jsonwebtoken"

export default (config, { strapi }: { strapi: Strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    const authHeader = ctx.request.header.authorization;
    if (!authHeader) {
      return ctx.unauthorized("This action is unauthorized.");
    };
    jwt.verify(authHeader, '1wnKwS/sTbmfRk6h3gIkjQ==', async (err, jwtDecode: any) => {
      if (err) return ctx.unauthorized("This action is unauthorized.");
      ctx.user_id = jwtDecode.id
    })
    await next();
  };
};
