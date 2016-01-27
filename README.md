## How it works

1.git clone https://github.com/RichardHan/website-monitoring.git

2.cd website-monitoring 

3.(Mandatory) Manually create `mail_config.json` ,to decide Gmail account setting.
   **Note:** You need to choose SMTP provider. Please checkout [Node Mailer](https://github.com/andris9/Nodemailer) for more details.

```javascript
{
  "provider": "gmail",
  "gmail": {
	"user": "UseYourGmailAccount@gmail.com",
	"pass": "UseYourGmailPassword"
  },
  "from": "UseYourGmailAccount@gmail.com",
  "to": "to1@gmail.com; to2@gmail.com; to3@gmail.com"
}
```

4.(Mandatory) Manually create `websites.json` 
   List all websites that you want to monitor.
   The `interval` property is the polling interval in minutes.  
   The `bodyContain` property is the response match string in response body.

```javascript
[
  {
	"url": "https://www.google.com.tw/",
	"interval": "1",
	"bodyContain": "</html>"
  },
  {
	"url": "https://tw.yahoo.com/",
	"interval": "1",
	"bodyContain": "</html>"
  }
]
```
5.(Optional) Modify app_config.json to decide app setting.

6.npm install

7.Run `node app` command to start monitoring your websites.

## Dependencies
 - [nodemailer](https://github.com/andris9/Nodemailer) - for sending emails 
 - [winston](https://github.com/winstonjs/winston) - for logging
 - [fs-extra](https://github.com/jprichardson/node-fs-extra) - fs extention
 - [moment](https://github.com/moment/moment/) - for dealing with time
