const router = require('express').Router();
const jwt = require('jsonwebtoken')
const userModel = require('../Models/userModel')
const nodemailer = require('nodemailer')

router.post('/forgot-password', async(req, res) => {
    const email = req.body.email
    try {
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.send('Utilisateur inconnu')
        }

        const secret = process.env.JWT_SEC + user.password // Rajoute le mot de passe du user dans la clé pour créer un token
        
        const payload = {
            email: user.email,
            id: user.id
        }

        const token = jwt.sign(payload, secret, { expiresIn: "15m" })
        const link = `${process.env.CLIENT_URL}/reset_password/${user.id}/${token}`

        let transporter = nodemailer.createTransport({
            host: 'mail.integraphone.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.USER_MAIL,
                pass: process.env.PASSWORD
            }
        });

        let mailOptions = {
            from: process.env.USER_MAIL,
            to: user.email,
            subject: `Lien reinitialisation du mot de passe pour: ${user.prenom}`,
            text: `Bonjour, ${user.prenom}, pour reinitialiser votre mot de passe vous pouvez cliquer sur ce lien:  ${link}`,

        };

        transporter.sendMail(mailOptions, (err, data) => {
            if (!err) {
                console.log('Lien envoyé !!!')
                console.log(data)
                return res.send('Lien pour reinitialiser votre mot de passe a été envoyé !')
            } else {
                return res.status(400).send(err)
            }
        })

    } catch (err) {
        console.log(err)
    }

})

module.exports = router;