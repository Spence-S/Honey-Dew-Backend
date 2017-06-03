//import { config } from 'dotenv';
import nodemailer from 'nodemailer';
import pug from 'pug';
import juice from 'juice';
import htmlToText from 'html-to-text';
import promisify from 'es6-promisify';

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});
