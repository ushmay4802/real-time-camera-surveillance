import bcrypt from "bcrypt";

export class PasswordProvider {

    private static readonly SALT_ROUNDS = 12;

    async hash(password: string): Promise<string> {
        return bcrypt.hash(
            password,
            PasswordProvider.SALT_ROUNDS,
        );
    }

    async compare(
        password: string,
        hash: string,
    ): Promise<boolean> {
        return bcrypt.compare(
            password,
            hash,
        );
    }

}