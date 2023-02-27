const userModel = require('../Models/userModel')
const ObjectID = require('mongoose').Types.ObjectId
const jwt = require('jsonwebtoken')
require('dotenv').config
const my_error = require('../Erreur/addUserError')
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')

module.exports.getAllUsers = async(req, res) => {

    try {
        const users = await userModel.find().sort({ "nom": 1 }).select("-password").select("-doubleAuth");

        res.status(200).send(users)
    } catch (err) {
        res.status(401).send(err)
    }


}

module.exports.getAllUsersFiltered = async(req, res) => {
    try {
        const mon_nom = req.body.nom;
        const nomCapitalized = mon_nom.charAt(0).toUpperCase() + mon_nom.slice(1);
        const users = await userModel.find().sort({ "nom": 1 }).select("-password").select("-doubleAuth");
        const userFiltered = []

        users.forEach(e => {
            if (e.nom.includes(nomCapitalized)) {
                userFiltered.push(e)
            }
        })

        res.status(200).send(userFiltered)
    } catch (err) {
        res.status(401).send('err')
    }
}

module.exports.getUserById = async(req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('Utilisateur inconnu ' + req.params.id)

    await userModel.findById(req.params.id, (err, data) => {
        if (!err) {
            return res.status(200).send(data)
        } else {
            return res.status(400).send(err)
        }
    }).select("-password").select("-doubleAuth")
}

module.exports.updateUser = async(req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('Utilisateur inconnu ' + req.params.id)

    try {
        const updateUser = await userModel.findByIdAndUpdate(
            req.params.id, {
                $set: req.body
            }, { new: true },
        ).select('-password').select("-doubleAuth");
        return res.status(200).send(updateUser)
    } catch (err) {
        return res.status(400).send(err)
    }
}

module.exports.updatePassword = async(req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.send('Utilisateur inconnu ' + req.params.id)

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt)

    try {
        await userModel.findByIdAndUpdate(
            req.params.id, {
                $set: {
                    password: hashedPass
                }
            }, { new: true },
        ).select('-password').select("-doubleAuth");

        return res.status(200).send('Mot de passe modifié avec succès !')
    } catch (err) {
        return res.status(400).send('Une erreur est survenu')
    }
}

module.exports.addUser = async(req, res) => {

    const mon_nom = req.body.nom
    const mon_prenom = req.body.prenom

    const nomCapitalized = mon_nom.charAt(0).toUpperCase() + mon_nom.slice(1);
    const prenomCapitalized = mon_prenom.charAt(0).toUpperCase() + mon_prenom.slice(1);



    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt)

        const my_user = new userModel({
            nom: nomCapitalized,
            prenom: prenomCapitalized,
            entreprise: req.body.entreprise,
            telephoneMobile: req.body.telephoneMobile,
            email: req.body.email,
            password: hashedPass,
            isAdmin: req.body.isAdmin,
            isSuperAdmin: req.body.isSuperAdmin,
            date_creation_user:new Date().toLocaleDateString()
        })
        const savedUser = await my_user.save();
        return res.status(200).send(savedUser);
    } catch (err) {
        const log_error = my_error(err)
        console.log(log_error)
        return res.send(log_error)
    }
}



module.exports.deleteUser = async(req, res) => {
    console.log(req.params.id)
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('Utilisateur inconnu ' + req.params.id)
    }


    try {
        await userModel.findByIdAndRemove(
            req.params.id,
            (err, data) => {
                if (!err) {
                    res.send(data)
                    console.log(data)
                } else {
                    console.log(err)
                    res.send(err)
                }
            }
        ).select('-password').select("-doubleAuth")


    } catch (err) {
        return res.status(400).send(err)
    }
}

module.exports.signIn = async(req, res) => {

    try {
        const user = await userModel.findOne({ email: req.body.email }) // On va rechercher l'utilisateur dans la base de donnée

        if (!user) {
            return res.json({ message: "Utilisateur inconnue !" }) // fait un return si l'utilisateur n'existe pas dans la bdd
        }

        const decryptPassword = await bcrypt.compare(req.body.password, user.password) // s'il existe on compare le mot de passe rentré par le mot de passe qui est crypté dans la bdd
        if (!decryptPassword) {
            return res.json({ message: "Mot de passe incorrect !" }) // fait un return si le mot de passe est incorrect
        }

        const token = jwt.sign({ // si tout est bon l'utilisateur peux se connecter et on lui genere un Token (avec son ID, Status, Cle secrete) qu'il utilisera pour faire des requetes sur le site
                id: user._id,
                isAdmin: user.isAdmin,
                isSuperAdmin: user.isSuperAdmin
            },
            process.env.JWT_SEC, { expiresIn: "3d" } // on ajoute la clé secrete au token et on lui attribue une expiration de 3 jours

        )

        const { password, doubleAuth, ...others } = user._doc //je sépare le mot de passe et le code de double auth pour pas les renvoyés en réponse

        res.status(200).send({...others, token }) // une fois séparé j'envoie en réponse les coordonnées de l'utilisateur ainsi que son token
    } catch (err) {
        return res.status(400).send(err)
    }
}

module.exports.checkUserPassword = async(req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('Utilisateur inconnu ' + req.params.id)
    }

    try {
        const user = await userModel.findOne({ _id: req.params.id })

        const decryptPassword = await bcrypt.compare(req.body.password, user.password)

        if (!decryptPassword) {
            return res.send('Mot de passe incorrect !')
        } else {
            res.send('valid')
        }
    } catch (err) {
        return res.send(err)
    }

}

module.exports.checkValidationCode = async(req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('Utilisateur inconnu ' + req.params.id)
    }

    try {
        const user = await userModel.findOne({ _id: req.params.id })

        if (user.doubleAuth !== req.body.doubleAuth) {
            return res.send('Code de validation incorrect! ')
        } else {
            res.send('valid')
        }
    } catch (err) {
        return res.send(err)
    }

}

module.exports.doubleAuthentification = async(req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('Utilisateur inconnu ' + req.params.id)
    }

    let array = []

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    function getnumberToString(array) {
        let string = "";
        array.forEach(e => {
            string = string + e.toString()
        })

        return string;
    }

    for (let i = 0; i < 4; i++) {
        array.push(getRandomInt(10))
    }

    const number = getnumberToString(array)

    try {
        await userModel.findByIdAndUpdate(
            req.params.id, {
                $set: {
                    doubleAuth: number
                }
            }, { new: true }
        )
    } catch (err) {
        return res.send(err)
    }

    try {
        const user = await userModel.findOne({ _id: req.params.id })

        let transporter = nodemailer.createTransport({
            host: 'mail.integraphone.com',
            port: 587,
            secure: false,

            auth: {
                user: process.env.USER_MAIL,
                pass: process.env.PASSWORD
            },
            debug: true, // include SMTP traffic in the logs
        });
        let mailOptions = {
            from: process.env.USER_MAIL,
            to: user.email,
            subject: `Code de verification à 4 chiffres`,
            text: `Bonjour, ${user.prenom}, Voici votre code de validation pour télécharger votre fichier:  ${user.doubleAuth}`,

        };

        transporter.sendMail(mailOptions, (err, data) => {
            if (!err) {
                console.log('Code envoyé par email !!!')
                return res.send('Code de validation envoyé !')
            } else {
                console.log(err)
                return res.status(400).send('err')
            }
        })
    } catch (err) {
        console.log(err)
        return res.send('erreur est survenu')
    }





}