import dns from 'dns';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const verifyEmailSMTP = async (email) => {
  const domain = email.split('@')[1];

  // Check MX records
  try {
    const addresses = await new Promise((resolve, reject) => {
      dns.resolveMx(domain, (err, addresses) => {
        if (err || addresses.length === 0) {
          return reject(new Error('No MX records found'));
        }
        resolve(addresses);
      });
    });

    // Select the highest priority MX record
    const mailServer = addresses[0].exchange;

    // Create SMTP connection
    const transporter = nodemailer.createTransport({
      host: mailServer,
      port: 587,  // Port 587 is commonly used for SMTP submission
      secure: false, // Use STARTTLS for security
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false, // Allow self-signed certificates if needed
      }
    });

    // Set a timeout for the connection attempt
    transporter.verify((error, success) => {
      if (error) {
        console.error('Error connecting to mail server:', error);
        return false;
      }
      console.log('Successfully connected to the mail server');
      return true;
    });
    
    return true;
  } catch (error) {
    console.error(`Error verifying email: ${error.message}`);
    return false; // Return false if there was an error
  }
};
