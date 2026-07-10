import { Prisma } from "@prisma/client";

import { BaseRepository } from "./base.repository";

export class UserCameraRepository extends BaseRepository {

    async create(data: Prisma.UserCameraCreateInput) {

        return this.prisma.userCamera.create({
            data,
        });

    }

    async findById(id: string) {

        return this.prisma.userCamera.findUnique({

            where: {
                id,
            },

        });

    }

    async findByUserId(userId: string) {

        return this.prisma.userCamera.findMany({

            where: {
                userId,
            },

            include: {
                camera: true,
            },

            orderBy: {
                createdAt: "desc",
            },

        });

    }

    async findByCameraId(cameraId: string) {

        return this.prisma.userCamera.findMany({

            where: {
                cameraId,
                enabled: true,
            },

        });

    }

    async findByUserAndCamera(
        userId: string,
        cameraId: string,
    ) {

        return this.prisma.userCamera.findUnique({

            where: {

                userId_cameraId: {

                    userId,
                    cameraId,

                },

            },

            include: {
                camera: true,
            },

        });

    }

    async update(
        id: string,
        data: Prisma.UserCameraUpdateInput,
    ) {

        return this.prisma.userCamera.update({

            where: {
                id,
            },

            data,

        });

    }

    async delete(id: string) {

        return this.prisma.userCamera.delete({

            where: {
                id,
            },

        });

    }

}