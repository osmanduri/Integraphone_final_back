const coefficientModel = require('../Models/offresCoefficient')
const ObjectID = require('mongoose').Types.ObjectId

module.exports.getAllCoefficient = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
    return res.send('Utilisateur inconnu ' + req.params.id)

    try{
        const coefficient = await coefficientModel.findById(req.params.id)

        res.status(200).send(coefficient)

    }catch(err){
        res.status(400).send(err)
    }
}

module.exports.postCoefficient = async (req, res) => {
    
    try{
        const coefficient = new coefficientModel({
            fibreFTTO:req.body.fibreFTTO,
            fibreFTTE:req.body.fibreFTTE,
            fibreFTTH:req.body.fibreFTTH
        })

        const savedCoefficient = await coefficient.save()
        return res.status(200).send(savedCoefficient)
    }catch(err){
        console.log(err)
        res.send(err)
    }
}

module.exports.updateCoefficientFTTO = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
    return res.send('Utilisateur inconnu ' + req.params.id)

    try{
        const updateCoefficient = await coefficientModel.findOneAndUpdate(
            req.params.id, {
                fibreFTTO: req.body.fibreFTTO
            }, { new: true }
        )

        return res.status(200).send(updateCoefficient)
    }catch(err){

    }
}

module.exports.updateCoefficientFTTE = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
    return res.send('Utilisateur inconnu ' + req.params.id)

    try{
        const updateCoefficient = await coefficientModel.findOneAndUpdate(
            req.params.id, {
                fibreFTTE: req.body.fibreFTTE
            }, { new: true }
        )

        return res.status(200).send(updateCoefficient)
    }catch(err){

    }
}

module.exports.updateCoefficientFTTH = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
    return res.send('Utilisateur inconnu ' + req.params.id)

    try{
        const updateCoefficient = await coefficientModel.findOneAndUpdate(
            req.params.id, {
                fibreFTTH: req.body.fibreFTTH
            }, { new: true }
        )

        return res.status(200).send(updateCoefficient)
    }catch(err){

    }
}