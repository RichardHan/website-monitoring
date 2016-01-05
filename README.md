## How it works

1. git clone https://github.com/RichardHan/website-monitoring.git

2. cd website-monitoring 

3. Modify config.json to decide email receiver.

4. List all websites that you want to monitor in `websites.json`.
   The `interval` property is the polling interval in minutes.  
   The `bodyContain` property is the response match string in response body.

5. npm install

6. Run `node app` command to start monitoring your websites.

**Note:** You need to change `mailer.js` to use a SMTP provider. Please checkout [Node Mailer](https://github.com/andris9/Nodemailer) for more details.

   auth: 
   {
          user: "UseYourEmailAccount@gmail.com",
          pass: "UseYourEmailPassword"
   } 

## Dependencies
 - [nodemailer](https://github.com/andris9/Nodemailer) - for sending emails 
 - [winston](https://github.com/winstonjs/winston) - for logging
