import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export interface JwtPayload {
    userId: string;
    email: string;
}

export class JwtProvider {

    generateAccessToken(payload: JwtPayload): string {

        return jwt.sign(
            payload,
            env.JWT_ACCESS_SECRET,
            {
                expiresIn: env.JWT_ACCESS_EXPIRY as SignOptions["expiresIn"],
            },
        );

    }

    generateRefreshToken(payload: JwtPayload): string {

        return jwt.sign(
            payload,
            env.JWT_REFRESH_SECRET,
            {
                expiresIn: env.JWT_REFRESH_EXPIRY as SignOptions["expiresIn"],
            },
        );

    }

    verifyAccessToken(token: string): JwtPayload {

        return jwt.verify(
            token,
            env.JWT_ACCESS_SECRET,
        ) as JwtPayload;

    }

    verifyRefreshToken(token: string): JwtPayload {

        return jwt.verify(
            token,
            env.JWT_REFRESH_SECRET,
        ) as JwtPayload;

    }

}