/*
   Module for sending emails
*/
var nodemailer = require('nodemailer');

/*
    Mailer function

    @param - (Object) opts - mailing options
    @param - (Function) fn - callback function
*/
var mailer = function (opts, fn) {
    
    // Send maail
    try {
        /* Empty init
        var transporter = nodemailer.createTransport();
         */

        /* v1.10.0 
        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'qwweee7467@gmail.com',
                pass: 'amyhwanghabun'
            }
        });
   
        transporter.sendMail({
            from: opts.from,
            to: opts.to,
            subject: opts.subject,
            html: opts.body
        });
                         
        */
        /* under v0.7 */
        //You may need to "Allow Less Secure Apps"(https://www.google.com/settings/security/lesssecureapps) in your gmail account(it's all the way at the bottom). 
        //You also may need to "Allow access to your Google account"(https://accounts.google.com/DisplayUnlockCaptcha)
        var transporter = nodemailer.createTransport("SMTP", {
            service: "Gmail",
            auth: {
                user: "medium.magento@gmail.com",
                pass: "magento01"
            }
        });
        
        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: opts.from,
            to: opts.to,
            subject: opts.subject,
            html: opts.body
        }
        
        // send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
            } else {
                console.log("Message sent: " + response.message);
            }
        // if you don't want to use this transport object anymore, uncomment following line
        //smtpTransport.close(); // shut down the connection pool, no more messages
        });
     
    }
    catch (err) {
        fn('Nodemailer could not send Mail', '');
    }
};

module.exports = mailer;
