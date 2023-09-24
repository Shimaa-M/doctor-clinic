import nodemailer from 'nodemailer';
import config from '../config/config';
import { Message } from '../DTO/message.dto';

export const transport = nodemailer.createTransport({
  service: 'gmail',
        host: 'smtp.gmail.com',
  auth: {
    user: config.email.smtp.auth.user,
    pass: config.email.smtp.auth.pass,
  },
});
  transport
    .verify()
    .then(() => console.log('Connected to email server'))
    .catch(() => console.log('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));

export const sendEmail = async (to: string, subject: string, text: string, html: string): Promise<void> => {
  const msg: Message = {
    from: config.email.from,
    to,
    subject,
    text,
    html,
  };
  await transport.sendMail(msg);
};


export const sendPatientNotificationsEmail = async (to: string, updates?: string): Promise<void> => {
  const subject = 'There is a new update';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `http://${config.clientUrl}/patient-notification`;
  const text = `Hi,
  There is a new update for you ${updates}`;
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Dear sir,</strong></h4>
  <p>Hi,
  There is a new update for you ${updates}</p>
  <p>Thanks,</p>
  <p><strong>Team</strong></p></div>`;
  await sendEmail(to, subject, text, html);
};


