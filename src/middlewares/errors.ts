// ============================================================
// Custom Error Class
// ============================================================

export class AppError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}
