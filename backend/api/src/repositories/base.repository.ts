import prisma from "../db/prisma";

export abstract class BaseRepository {

    protected readonly prisma = prisma;

}