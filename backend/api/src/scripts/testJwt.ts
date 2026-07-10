import { JwtProvider } from "../providers/JwtProvider";

const jwtProvider = new JwtProvider();

const accessToken = jwtProvider.generateAccessToken({
    userId: "123",
    email: "test@test.com",
});

console.log(accessToken);

console.log(
    jwtProvider.verifyAccessToken(accessToken),
);