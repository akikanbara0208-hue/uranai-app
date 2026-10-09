import nodemailer from "nodemailer";

// メールは akika.rainbow の Gmail から送る（お客さんの返信もここに届く）
export async function sendMail(to: string, subject: string, html: string) {
  const user = process.env.GMAIL_USER!;
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass: process.env.GMAIL_APP_PASSWORD! },
  });
  await transport.sendMail({ from: `"世界の占い堂" <${user}>`, to, subject, html });
}
