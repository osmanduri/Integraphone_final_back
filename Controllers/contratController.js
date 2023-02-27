const contratModel = require('../Models/contratModel')
const ObjectID = require('mongoose').Types.ObjectId

module.exports.getAllContrat = async(req, res) => {

    try {
        const contrat = await contratModel.find()
        res.send(contrat)
    } catch (err) {
        console.log(err)
        res.send(err)
    }
}


module.exports.getContratByUser = async(req, res) => {
    try {
        const contrat = await contratModel.find({ nom_client: req.headers.nom_client })

        res.send(contrat)
    } catch (err) {
        res.send(err)
    }
}

module.exports.getContratByType = async(req, res) => {
    try {
        const contrat = await contratModel.find()
        const type = []

        if (req.params.type === "tous") {
            contrat.forEach(e => {
                if (e.user_id === req.headers.user_id) {
                    type.push(e)
                }
            })
        } else {
            contrat.forEach(e => {
                if (e.typeContrat === req.params.type && e.user_id === req.headers.user_id) {
                    type.push(e)
                }
            })
        }

        res.send(type)
    } catch (err) {
        res.send(err)
    }
}