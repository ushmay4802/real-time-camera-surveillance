import { MailProvider } from "../providers/MailProvider";

const mailProvider = new MailProvider();

await mailProvider.sendMail(

    "patelushmay@gmail.com",

    "Test Mail",

    "<h1>Hello from Camera-surveillance-system</h1>",

);

console.log("Mail Sent");