import dns from 'dns';
import net from 'net';
import dotenv from 'dotenv';

dotenv.config();

export const verifyEmailSMTP = async (email) => {
  // Extract and check if there is a domain in email address
  const domain = email.split("@")[1];

  if (!domain) {
    throw new Error("Invalid email address format");
  }

  //return new promise for async
  return new Promise((resolve, reject) => {
    // Resolve DNS MX (Mail Exchange) records for domain
    dns.resolveMx(domain, (err, addresses) => {
      //If error or no MX records, return false
      if (err || addresses.length === 0) {
        console.error(`No MX records found for ${domain}`);
        return resolve(false);
      }

      // Use the highest priority MX record
      addresses.sort((a, b) => a.priority - b.priority);
      // Takes highest priority MX record exchange value
      const mailServer = addresses[0].exchange;

      // Create network connetion to mail server port 25 (SMTP port)
      const socket = net.createConnection(25, mailServer);
      // Response from mail server
      let response = '';
      let step = 0;

      // Listens data from mail server
      socket.on('data', (data) => {
        // Convert data to String and append into response
        response += data.toString();

        // Handle server responses based on the current step
        if (step === 0 && response.includes('220')) {
          socket.write(`EHLO ${process.env.SMTP_HOST}\r\n`); // Introduce ourselves
          step++;
        } else if (step === 1 && response.includes('250')) {
          socket.write(`MAIL FROM:<${process.env.SMTP_USER}>\r\n`); // Specify sender email
          step++;
        } else if (step === 2 && response.includes('250')) {
          socket.write(`RCPT TO:<${email}>\r\n`); // Verify recipient email
          step++;
        } else if (step === 3) {
          if (response.includes('250')) {
            resolve(true); // Email is valid
          } else if (response.includes('550')) {
            resolve(false); // Email does not exist
          } else {
            resolve(false); // Other error
          }
          socket.end(); // Terminate connection
        }
      });

      // Handle errors during connection with the mail server
      socket.on('error', (err) => {
        console.error(`SMTP error: ${err.message}`);
        resolve(false);
      });

      // Handle connection close
      socket.on('end', () => {
        console.log('SMTP connection ended');
      });
    });
  });
};
