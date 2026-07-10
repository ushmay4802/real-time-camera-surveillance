import { Hono } from "hono";

import { checkDatabase } from "../db/database";

const health = new Hono();

health.get("/", async (c) => {

    const database = await checkDatabase();

    return c.json({

        status: "UP",

        database,

    });

});

export default health;