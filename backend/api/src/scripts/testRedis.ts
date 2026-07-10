import { RedisProvider } from "../providers/RedisProvider";

const redis = new RedisProvider();

await redis.set(
    "hello",
    "world",
    60,
);

console.log(
    await redis.get("hello"),
);

await redis.delete("hello");

console.log(
    await redis.exists("hello"),
);