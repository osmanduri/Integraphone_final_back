const factureModel = require('../Models/factureModel')
const contratModel = require('../Models/contratModel')
const ObjectID = require('mongoose').Types.ObjectId
const fs = require('fs')
const path = require('path')
const moment = require('moment')

module.exports.getAllInvoices = async(req, res) => {

    try {
        const invoice = await factureModel.find()
        res.send(invoice)
    } catch (err) {
        res.send(err)
    }

}

module.exports.getInvoiceByUser = async(req, res) => {
    moment.locale('en');
    try {

        let month_subtract_13 = moment().subtract(13, 'month').calendar() // Soustrais le mois actuel par 13, car on ne veux pas afficher les factures de plus de 13 mois

        const finalDate = new Date(month_subtract_13)
        const invoice = await factureModel.find({ "createdAt": { "$gte": finalDate }, nom_client: req.headers.nom_client }) // Puis affiche uniquement les factures des 13 mois derniers et n'affiche pas au dela de 13 mois

        res.send(invoice)
    } catch (err) {
        res.send(err)
    }



}

module.exports.getInvoiceByDate = async(req, res) => {
    try {
        const invoice = await factureModel.find()
        const date = []

        if (req.params.date === "tout") { // si le client envoi "tout" return toutes les factures du user
            invoice.forEach(e => {
                if (e.user_id === req.headers.user_id) {
                    date.push(e)
                }
            })
        } else {
            invoice.forEach(e => {
                if (e.date_creation.split(' ')[1] === req.params.date && e.user_id === req.headers.user_id) { // Sinon on renvoi uniquement les factures avec le mois en question
                    date.push(e)
                }
            })
        }



        res.send(date)
    } catch (err) {
        res.send(err)
    }
}

module.exports.deleteAllInvoiceUser = async(req, res, next) => {


    try {
        const facture = await factureModel.deleteMany({ user_id: req.params.id })
        const contrat = await contratModel.deleteMany({ user_id: req.params.id })


        if (facture || contrat) {
            const chemin_dossier_facture = path.join(__dirname, "../Factures", req.headers.nom_client)
            const chemin_dossier_contrat = path.join(__dirname, "../Contrats", req.headers.nom_client)

            if (fs.existsSync(chemin_dossier_facture)) {
                fs.rmdir(chemin_dossier_facture, { recursive: true }, (err) => {
                    if (err) {
                        return res.send(err)
                    }
                })
            }

            if (fs.existsSync(chemin_dossier_contrat)) {
                fs.rmdir(chemin_dossier_contrat, { recursive: true }, (err) => {
                    if (err) {
                        return res.send(err)
                    }
                })
            }

            next()
        } else {
            next()
        }

    } catch (err) {
        return res.send(err)
    }
}

module.exports.getFilterPerMonth = async(req, res) => {
    moment.locale('en');

    if (req.params.month_id === "tous") {
        let my_m = moment().subtract(13, 'month').calendar() // soustrait le mois actuel par 13, car on veut afficher uniquement les factures de plus de 13 mois

        const finalDate = new Date(my_m) // on crée un nouvel objet de type Date qui est égal à mois actuel - 13 mois

        const facture = await factureModel.find({ "createdAt": { "$gte": finalDate }, "user_id": req.headers.user_id }) // récupère les factures des 13 mois derniers mois par rapport au client en question

        return res.send(facture) // renvoie ensuite la liste des factures au client
    } else {

        let my_m = moment().subtract(req.params.month_id, 'month').calendar() // soustrait le mois actuel par req.params.id 

        const finalDate = new Date(my_m) // on crée un nouvel objet de type Date qui est égal à mois actuel - req.params.id mois

        const facture = await factureModel.find({ "createdAt": { "$gte": finalDate }, "user_id": req.headers.user_id }) // récupère les factures des req.params.id mois derniers mois par rapport au client en question

        return res.send(facture)
    }




}