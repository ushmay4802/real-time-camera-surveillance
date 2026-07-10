import "dotenv/config";


export const env = {

    PORT: Number(process.env.PORT) || 3000,

    DATABASE_URL: process.env.DATABASE_URL!,

    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,

    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,

    JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY!,

    JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY!,

    RABBITMQ_URL: process.env.RABBITMQ_URL!,

    MEDIAMTX_API: process.env.MEDIAMTX_API!,

    REDIS_URL: process.env.REDIS_URL!,

    MEDIAMTX_WEBRTC: process.env.MEDIAMTX_WEBRTC!,

    SMTP_HOST: process.env.SMTP_HOST!,
    SMTP_PORT: Number(process.env.SMTP_PORT),

    SMTP_USER: process.env.SMTP_USER!,
    SMTP_PASS: process.env.SMTP_PASS!,
    SMTP_FROM: process.env.SMTP_FROM!,

};