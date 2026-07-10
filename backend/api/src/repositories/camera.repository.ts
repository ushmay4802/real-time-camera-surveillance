import { Prisma } from "@prisma/client";

import { BaseRepository } from "./base.repository";

export class CameraRepository extends BaseRepository {

    async create(data: Prisma.CameraCreateInput) {

        return this.prisma.camera.create({
            data,
        });

    }

    async findById(id: string) {

        return this.prisma.camera.findUnique({

            where: {
                id,
            },

        });

    }

    async findByRtspUrl(rtspUrl: string) {

        return this.prisma.camera.findUnique({

            where: {
                rtspUrl,
            },

        });

    }

    async findAll() {

        return this.prisma.camera.findMany({

            orderBy: {
                createdAt: "desc",
            },

        });

    }

    async delete(id: string) {

        return this.prisma.camera.delete({

            where: {
                id,
            },

        });

    }

}
