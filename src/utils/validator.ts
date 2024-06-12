import { validate } from "class-validator"

export const validatorHelper = async <T extends object>(body: T, ctx) => {
  const errors = await validate(body)
  if (errors.length > 0) {
    const constraints = errors.map(i =>
      i.constraints?.isNotEmpty ||
      i.constraints?.isArray ||
      i.constraints?.isBoolean ||
      i.constraints?.isEmail ||
      i.constraints?.isNumber ||
      i.constraints?.matches ||
      i.constraints?.arrayMinSize ||
      i.constraints?.isIn
    ).join(', ')
    ctx.throw(400, constraints);
  }
}