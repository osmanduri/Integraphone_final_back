const nodemailer = require('nodemailer')
const path  = require('path');
const hbs = require('nodemailer-express-handlebars')

module.exports.new = async (req, res) =>{
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

        console.log(handlebarOptions.viewEngine)

        transporter.use('compile', hbs(handlebarOptions));
        let mailOptions = {
            from: process.env.USER_MAIL,
            to: req.body.email,
            cc: process.env.USER_MAIL,
            subject: `Demande de devis ${req.body.categorie} effectué par  ${req.body.prenom} ${req.body.nom}`,
            text: '',
            template: 'devis',
            context: {
                nom: req.body.nom,
                prenom:req.body.prenom,
                telephone:req.body.telephone,
                entreprise:req.body.entreprise,
                type_devis:req.body.type_devis,
                adresse:req.body.adresse,
                ville:req.body.ville,
                codePostal:req.body.codePostal,
                email:req.body.email,
                categorie:req.body.categorie
            }
        };

        transporter.sendMail(mailOptions, (err, data) => {
            if(!err){
                console.log('devis sent !')
                res.send('Email Devis envoyé')
            }else{
                res.send(err)
            }
        })
    }catch(err){
        res.send(err)
    }  
        
} 