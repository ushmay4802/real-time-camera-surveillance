import Redis from "ioredis";

import { env } from "../config/env";

export class RedisProvider {

    private readonly redis: Redis;

    constructor() {

        this.redis = new Redis(env.REDIS_URL);

    }

    async set(

        key: string,

        value: unknown,

        ttlSeconds?: number,

    ): Promise<void> {

        const serialized = JSON.stringify(value);

        if (ttlSeconds) {

            await this.redis.set(
                key,
                serialized,
                "EX",
                ttlSeconds,
            );

            return;

        }

        await this.redis.set(
            key,
            serialized,
        );

    }

    async get<T>(key: string): Promise<T | null> {

        const value = await this.redis.get(key);

        if (!value) {

            return null;

        }

        return JSON.parse(value) as T;

    }

    async delete(key: string): Promise<void> {

        await this.redis.del(key);

    }

    async exists(key: string): Promise<boolean> {

        return (await this.redis.exists(key)) === 1;

    }

    async expire(
        key: string,
        ttlSeconds: number,
    ): Promise<void> {

        await this.redis.expire(
            key,
            ttlSeconds,
        );

    }

    async ttl(key: string): Promise<number> {

        return this.redis.ttl(key);

    }

    async disconnect(): Promise<void> {

        await this.redis.quit();

    }

}