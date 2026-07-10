import { PasswordProvider } from "../providers/PasswordProvider";

const passwordProvider = new PasswordProvider();

const hash = await passwordProvider.hash("123456");

console.log(hash);

const valid = await passwordProvider.compare(
    "123456",
    hash,
);

console.log(valid);