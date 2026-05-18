const validate = (schema) => {
  return (req, res, next) => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }

      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }

      if (schema.query) {
        req.query = schema.query.parse(req.query);
      }

      next();
    } catch (error) {
      return res.status(400).json({
        message: "Validation Error",

        errors: error.erros?.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }
  };
};

export default validate;
