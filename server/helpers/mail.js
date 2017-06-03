//import { config } from 'dotenv';
import nodemailer from 'nodemailer';
import pug from 'pug';
import juice from 'juice';
import htmlToText from 'html-to-text';
import promisify from 'es6-promisify';

// load env vars
//config();

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

transport.sendMail({
  from: 'sasnyde2@gmail.com',
  to: 'randy@example.com',
  subject: 'Just testing things whoo',
  html: 'Hey I <strong>love</strong> you!',
  text: 'Hey I **love** you'
}).then(res => console.log(res))
.catch(err => console.log(err));
