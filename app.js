const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

//view engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static folder 
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



app.get('/', (req, res)=>{
     res.render('contact', {
         layout: false,
         name: req.body.name,
         
     });
});

app.post('/send', (req, res)=>{

    const output = `
        <p>You have a new contact request.</p>
        <h3>Contact Details</h3>

        <ul>
        <li>Name: ${req.body.name}<li>
        <li>Company: ${req.body.company}<li>
        <li>Email: ${req.body.email}<li>
        <li>Phone: ${req.body.phone}<li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
    `;
    
    async function main() {
    let transporter = nodemailer.createTransport({
        host: "mail.thinktanktraining.org",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'obedjonathan@thinktanktraining.org', // generated ethereal user
          pass: '4thinktanktraining', // generated ethereal password
        },
        tls:{
            rejectUnauthorized: false
        }
      });
    
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"Jonathan Obed" <obedjonathan@thinktanktraining.org>', // sender address
        to: "obedjonathan26@gmail.com", // list of receivers
        subject: "Node Contact Request", // Subject line
        text: "Hello world?", // plain text body
        html: output // html body
      });
    
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    
    res.render('contact',{layout: false, name: req.body.name}
    ); 
  
    }
    main().catch(console.error);
});


const port = process.env.PORT || 3000;

app.listen(port, ()=> console.log(`listening on port ${port}`));

