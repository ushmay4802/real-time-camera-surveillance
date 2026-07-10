import nodemailer from "nodemailer";

import { env } from "../config/env";

export class MailProvider {

    private readonly transporter = nodemailer.createTransport({

        host: env.SMTP_HOST,

        port: env.SMTP_PORT,

        secure: false,

        auth: {

            user: env.SMTP_USER,

            pass: env.SMTP_PASS,

        },

    });

    async sendMail(

        to: string,

        subject: string,

        html: string,

    ) {

        await this.transporter.sendMail({

            from: env.SMTP_FROM,

            to,

            subject,

            html,

        });

    }

}