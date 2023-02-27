const jwt = require('jsonwebtoken')
const userModel = require('../../Models/userModel')
const ObjectID = require('mongoose').Types.ObjectId

module.exports.verifyToken = async(req, res, next) => {

    const tokenHeader = req.headers.token; // On répupere le token envoyé en Header du client

    if (tokenHeader) {
        const token = tokenHeader;

        jwt.verify(token, process.env.JWT_SEC, (err, user) => { // 
            if (err) {
                return res.send('Token is not valid !')
            }

            req.user = user;
            next();
        })
    } else {
        return res.send('Vous devez vous connecter')
    }
}

module.exports.verifyTokenResetPassword = async(req, res, next) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('Utilisateur inconnu ' + req.params.id)
    }

    const tokenHeader = req.headers.token
    if (tokenHeader) {
        const token = tokenHeader

        const user = await userModel.findOne({ _id: req.params.id })

        if (user) {
            jwt.verify(token, process.env.JWT_SEC + user.password, (err, user) => {
                if (err) {
                    return res.send('Token is not valid !')
                }

                req.user = user;
                
                next();
            })
        } else {
            return res.send('Utilisateur non enregistre dans la base de donnee')
        }
    } else {
        return res.send('Vous devez vous connecter')
    }

}

module.exports.verifyUserResetPassword = (req, res, next) => {
    this.verifyTokenResetPassword(req, res, () => {

        if (req.user.id === req.params.id || req.user.isAdmin || req.user.isSuperAdmin) {
            next();
        } else {
            return res.status(403).send("Vous n'etes pas autorisé à effectuer cette action")
        }
    })
}

module.exports.verifyUser = (req, res, next) => {
    this.verifyToken(req, res, () => {

        if (req.user.id === req.params.id || req.user.isAdmin || req.user.isSuperAdmin || req.user.id === req.headers.user_id) {
            next();
        } else {
            return res.status(403).send("Vous n'etes pas autorisé à effectuer cette action")
        }
    })
}

module.exports.verifyAdmin = (req, res, next) => {
    this.verifyToken(req, res, () => {
        if (req.user.isAdmin || req.user.isSuperAdmin) {
            next();
        } else {
            return res.status(403).send("Vous n'etes pas autorisé à effectuer cette action")
        }
    })
}

module.exports.verifySuperAdmin = (req, res, next) => {
    this.verifyToken(req, res, () => {
        if(req.user.isSuperAdmin){
            next();
        }else{
            return res.status(403).send("Vous n'etes pas autorisé à effectuer cette action")
        }
    })
}