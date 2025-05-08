import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import fs from 'fs';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import cloudinary from 'cloudinary';
import * as model from '../api/model/user.js';

dotenv.config();

const getDate = (hours = 0) => {
  const now = new Date();
  const futureDate = new Date(now.setHours(now.getHours() + hours));
  return futureDate.toISOString();
};

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_LOGIN,
    pass: process.env.EMAIL_PASSWORD,
  },
  // logger: true, // Aktiviert detaillierte Logs
  // debug: true, // Zeigt Debug-Informationen an
});

transporter.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');
  }
});

cloudinary.config({
  cloud_name: 'dnx1z3x3h',
  api_key: '382563131649838',
  api_secret: '8r2weTOOAhr-S9rVb2ycW2Xixy8',
});

const sendVerificationEmail = async (user) => {
  const verificationToken = uuidv4() + user.user_id;
  const hashedToken = bcrypt.hashSync(verificationToken, 10); // Token wird gehasht
  const currentUrl = process.env.CURRENT_URL;

  const imageUrl = 'https://res.cloudinary.com/dnx1z3x3h/image/upload/v1743263831/logop.png';
  const emailTemplate = fs.readFileSync('src/templates/verification_email.html', 'utf8');
  const html = emailTemplate
    .replace(
      '{verify_link}',
      `${currentUrl}/user-api/auth/user/verify/${user.user_id}/${verificationToken}`,
    )
    .replace('image_url', imageUrl);

  const mailOptions = {
    from: `Takenotes ${process.env.EMAIL_ADDRESS}`,
    to: user.email,
    subject: 'Schließen Sie Ihre Registrierung ab',
    html,
  };

  const result = await transporter.sendMail(mailOptions);
  if (result) {
    try {
      const saveResult = await model.saveUserVerification(
        user.user_id,
        hashedToken,
        new Date().toISOString(),
        new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      );
      console.log('Verification saved:', saveResult);
    } catch (error) {
      console.error('Error saving verification:', error);
    }
  }
  return result;
};

export { sendVerificationEmail, getDate };
