import { Prisma } from "@prisma/client";

import { BaseRepository } from "./base.repository";

export class UserRepository extends BaseRepository {

    async create(data: Prisma.UserCreateInput) {
        return this.prisma.user.create({
            data,
        });
    }

    async findById(id: string) {
        return this.prisma.user.findUnique({
            where: {
                id,
            },
        });
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: {
                email,
            },
        });
    }

    async updatePassword(
        id: string,
        passwordHash: string,
    ) {
        return this.prisma.user.update({
            where: {
                id,
            },
            data: {
                passwordHash,
            },
        });
    }

    async updateProfile(
        id: string,
        name: string,
    ) {
        return this.prisma.user.update({
            where: {
                id,
            },
            data: {
                name,
            },
        });
    }

    async delete(id: string) {
        return this.prisma.user.delete({
            where: {
                id,
            },
        });
    }

}