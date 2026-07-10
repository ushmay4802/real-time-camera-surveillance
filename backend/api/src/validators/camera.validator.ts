import { z } from "zod";

export const createCameraSchema = z.object({

    name: z
        .string()
        .trim()
        .min(3)
        .max(100),

    location: z
        .string()
        .trim()
        .min(3)
        .max(255),

    rtspUrl: z
        .string()
        .url(),

});

export const updateCameraSchema = z.object({

    name: z
        .string()
        .trim()
        .min(3)
        .max(100),

    location: z
        .string()
        .trim()
        .min(3)
        .max(255),

    enabled: z.boolean(),

});