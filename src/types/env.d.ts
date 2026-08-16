declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      JWT_SECRET: string;
      JWT_EXPIRES_IN?: string;
      CORS_ORIGIN?: string;
      PORT?: string;
    }
  }
}

export {};
