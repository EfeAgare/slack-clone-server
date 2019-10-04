import { createTransport } from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// create reusable transporter object using the default SMTP transport
let transporter = createTransport({
  pool: true,
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS
  }
});

const addUserToWorkspaceMail = (name, email, url, token) => {
  email.map(email => {
    const mailOptions = {
      from: `${name}.slack.com`,
      to: email,
      subject: `${name} on Slack: New Account Details`,
      html: `   <h1 style="font-size:30px;padding-right:30px;padding-left:30px">Welcome to Slack!</h1>
        <p style="font-size:17px;padding-right:30px;padding-left:30px"> You’ve joined the new Slack workspace <strong>  ${name} </strong>. Here are your account details: </p>
        <div style="padding-right:30px;padding-left:30px"><table style="table-layout:fixed;border:1px solid #a0a0a2;border-radius:8px;padding:40px 0;margin-top:20px;width:100%;border-collapse:separate;text-align:center"><tbody><tr><td style="vertical-align:middle"><img src=" style="height:38px;width:38px;min-width:38px;border-radius:4px;color:#ffffff;font-size:18px;line-height:38px" alt="" class="CToWUd"><h3 class="m_5125398967866517907plaintext_ignore" style="font-weight:900;padding-top:10px;margin-bottom:7px;font-size:21px;font-size:21px;margin-top:0;margin-top:0">${name}</h3><h4 class="m_5125398967866517907plaintext_only" style="display:none">Workspace name: ${name}</h4><h4 style="margin-bottom:2px;font-size:17px;font-weight:400">URL: <a href="#" style="white-space:nowrap;color:#0576b9" target="_blank"">${name}.slack.com</a></h4><h4 style="margin-bottom:0;font-size:17px;font-weight:400">Email: <a href="mailto:${email}" style="white-space:nowrap;color:#0576b9" target="_blank">${email}</a></h4>
        <table style="text-align:right;display:inline-table;width:auto;vertical-align:top;width:102px;text-align:right;width:102px"><tbody><tr><td style="padding:0px;padding-top:20px;width:100px"><div><a href="http://${url}/register?q=${token}" style="text-align:center;text-decoration:none;display:inline-block;width:100px;border:1px solid #c7cacd;border-radius:4px;background-color:#fbfbfa;color:#555459;font-size:14px;line-height:40px;font-weight:900" target="_blank">Sign In</a></div></td></tr></tbody></table></td></tr></tbody></table></div>`
    };
    transporter.sendMail(mailOptions, error => {
      if (error) {
        return { message: 'Email failed to send', error };
      }
      return { message: 'Email sent successfully' };
    });
  });
};

export default addUserToWorkspaceMail;
