import { UserRepository } from "../repositories/user.repository";

const userRepository = new UserRepository();

const user = await userRepository.create({

    name: "Test User",

    email: "test3@test.com",

    passwordHash: "123456",

});

console.log(user);