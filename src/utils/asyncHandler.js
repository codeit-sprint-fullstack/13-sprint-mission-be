import React from "react";
import { Prisma } from "@prisma/client";
import { HttpError } from "./errors.js";
import { z } from "zod";

const asyncHandler = (fn) => {
  return async (req, res) => {
    try {
      await fn(req, res);
    } catch (err) {
      if (err instanceof HttpError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
    }
  };
};

export default asyncHandler;
