declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string;
    NODE_ENV: 'development' | 'production';
    MONGO_URI: string;
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
  }
}
