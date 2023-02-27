const nodemailer = require('nodemailer')
const path  = require('path');
const hbs = require('nodemailer-express-handlebars')

module.exports.new = async (req, res) => {    
            try{
                let transporter = nodemailer.createTransport({
                    host: 'mail.integraphone.com',
                    port: 587,
                    secure: false,
                    auth: {
                        user: process.env.USER_MAIL,
                        pass: process.env.PASSWORD
                    }
                });
        
                const handlebarOptions = {
                    viewEngine: {
                        extName: ".handlebars",
                        partialsDir: path.resolve(__dirname, "../Views/templates"),
                        defaultLayout: false,
                    },
                    viewPath: path.resolve(__dirname, "../Views/templates"),
                    extName: ".handlebars",
                };
        
                transporter.use('compile', hbs(handlebarOptions));
                let mailOptions = {
                    from: process.env.USER_MAIL,
                    to: req.body.email,
                    cc: process.env.USER_MAIL,
                    subject: `Demande de partenariat effectué par  ${req.body.prenom} ${req.body.nom}` ,
                    text: '',
                    template: 'partenaire',
                    context: {
                        nom: req.body.nom,
                        prenom:req.body.prenom,
                        entreprise:req.body.entreprise,
                        email:req.body.email,
                        telephone:req.body.telephone
                    }
                };
        
                transporter.sendMail(mailOptions, (err, data) => {
                    if(!err){
                        res.status(200).send('Email envoyé')
                    }else{
                        res.status(400).send(err)
                    }
                })
            }catch(err){
                res.send(err)
            }   
} 