const moment = require('moment');
moment.locale('fr');
const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')
const path = require('path');
const fs = require('fs')
const csvtojson = require('csvtojson')

module.exports.devisNew_user = async(req, res) => {
    console.log(path.resolve(__dirname, "../Views"))

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
        subject: `Demande de devis pour la fibre effectué par ${req.body.prenom} ${req.body.nom}`,
        text: '',
        template: 'fibre',
        context: {
            prix: req.body.prix,
            fibre: req.body.fibre,
            debit: req.body.debit,
            nom: req.body.nom,
            prenom: req.body.prenom,
            entreprise: req.body.entreprise,
            email: req.body.email,
            telephone: req.body.telephone,
            commentaire: req.body.commentaire,
            adresse: req.body.adresse
        }
    };

    transporter.sendMail(mailOptions, (err, data) => {
        if (!err) {
            res.status(200).send('Devis envoyé avec succès !')
        } else {
            res.status(400).send(err)
        }
    })

    //console.log('Succesfully registered in database')
    //res.send("ticket created")

    //res.send('find')

}

module.exports.devisNew_admin = async(req, res) => {
    console.log(path.resolve(__dirname, "../Views"))

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
        /*to: ["contacts@integraphone.com", "o.duri@integraphone.fr"],*/
        to: ["duri.osman@gmail.com", "osman.duri@hotmail.fr"],
        subject: `Demande de devis pour la fibre effectué par ${req.body.prenom} ${req.body.nom}`,
        text: '',
        template: 'fibre_admin',
        context: {
            code: req.body.code,
            libelle: req.body.libelle,
            operateur: req.body.operateur,
            prix: req.body.prix,
            fibre: req.body.fibre,
            debit: req.body.debit,
            nom: req.body.nom,
            prenom: req.body.prenom,
            entreprise: req.body.entreprise,
            email: req.body.email,
            telephone: req.body.telephone,
            commentaire: req.body.commentaire,
            adresse: req.body.adresse
        }
    };

    transporter.sendMail(mailOptions, (err, data) => {
        if (!err) {
            res.status(200).send('Devis envoyé avec succès !')
        } else {
            res.status(400).send(err)
        }
    })

    //console.log('Succesfully registered in database')
    //res.send("ticket created")

    //res.send('find')
}

module.exports.getPriceFtth = async(req, res) => {
    let jsonFileOutput = []
    csvtojson()
        .fromFile('./tarifs_ftth.csv')
        .then((jsonObj) => {
            try {
                fs.writeFileSync("output_ftth_36_mois.json", JSON.stringify(jsonObj), 'utf-8',
                    function(err) { console.log(err); });
            } catch (err) {
                return res.send(err)
            }

            jsonObj.forEach(e => {
                if (e.Engagement === "Engagement 36 mois") {
                    jsonFileOutput.push(e)
                }
            })

            res.send(jsonFileOutput)

        })
}

module.exports.getPriceFtto = async(req, res) => {
    let jsonFileOutput = []
    csvtojson()
        .fromFile('./tarifs_ftto.csv')
        .then((jsonObj) => {
            try {
                fs.writeFileSync("output_ftto_36_mois.json", JSON.stringify(jsonObj), 'utf-8',
                    function(err) { console.log(err); });
            } catch (err) {
                return res.send(err)
            }

            jsonObj.forEach(e => {
                if (e.Engagement === "Engagement 36 mois") {
                    jsonFileOutput.push(e)
                }
            })

            res.send(jsonFileOutput)

        })
}

module.exports.getPriceFtte = async(req, res) => {
    let jsonFileOutput = []
    csvtojson()
        .fromFile('./tarifs_ftte.csv')
        .then((jsonObj) => {
            try {
                fs.writeFileSync("output_ftte_36_mois.json", JSON.stringify(jsonObj), 'utf-8',
                    function(err) { console.log(err); });
            } catch (err) {
                return res.send(err)
            }

            jsonObj.forEach(e => {
                if (e.Engagement === "Engagement 36 mois") {
                    jsonFileOutput.push(e)
                }
            })

            res.send(jsonFileOutput)

        })
}