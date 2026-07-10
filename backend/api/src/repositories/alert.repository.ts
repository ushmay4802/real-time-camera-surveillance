import { Prisma } from "@prisma/client";

import { BaseRepository } from "./base.repository";

export interface AlertQuery {

    cameraId?: string;

    from?: Date;

    to?: Date;

    cursor?: string;

    limit: number;

}

export class AlertRepository extends BaseRepository {

    async createMany(
        data: Prisma.AlertCreateManyInput[],
    ) {

        return this.prisma.alert.createMany({
            data,
        });

    }

    async findAll(
        userId: string,
        filters: AlertQuery,
    ) {

        const where: Prisma.AlertWhereInput = {
            userId,
        };

        if (filters.cameraId) {

            where.cameraId =
                filters.cameraId;

        }

        if (filters.from || filters.to) {

            where.createdAt = {

                ...(filters.from && {
                    gte: filters.from,
                }),

                ...(filters.to && {
                    lte: filters.to,
                }),

            };

        }

        const alerts =
            await this.prisma.alert.findMany({

                where,

                take: filters.limit + 1,

                skip: filters.cursor ? 1 : 0,

                cursor: filters.cursor
                    ? {
                        id: filters.cursor,
                    }
                    : undefined,

                orderBy: [

                    {
                        createdAt: "desc",
                    },

                    {
                        id: "desc",
                    },

                ],

            });

        const cameraIds = [
            ...new Set(
                alerts.map((alert) => alert.cameraId),
            ),
        ];

        const userCameras =
            await this.prisma.userCamera.findMany({

                where: {

                    userId,

                    cameraId: {

                        in: cameraIds,

                    },

                },

                select: {

                    cameraId: true,

                    name: true,

                    location: true,

                },

            });

        const cameraMap =
            new Map(

                userCameras.map((camera) => [

                    camera.cameraId,

                    {

                        name: camera.name,

                        location: camera.location,

                    },

                ]),

            );

        let nextCursor: string | null = null;

        if (alerts.length > filters.limit) {

            const last = alerts.pop()!;

            nextCursor = last.id;

        }

        return {

            items: alerts.map((alert) => ({

                ...alert,

                cameraName:
                    cameraMap.get(alert.cameraId)?.name ?? "",

                location:
                    cameraMap.get(alert.cameraId)?.location ?? "",

            })),

            nextCursor,

        };

    }

}