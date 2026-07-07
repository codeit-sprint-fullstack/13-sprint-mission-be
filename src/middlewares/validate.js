export default function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.issues.map((i) => i.message).join(",");
      const error = new Error(message);
      error.code = 400;
      return next(error);
    }
    req.body = result.data;
    next();
  };
}
