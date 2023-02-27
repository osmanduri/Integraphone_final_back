const mongoose = require('mongoose')
const moment = require('moment');
moment.locale('fr');

const factureModel = new mongoose.Schema({
    fileName: {
        type: String
    },
    chemin: {
        type: String
    },
    nom_client: {
        type: String
    },
    date_creation: {
        type: String
    },
    user_id: {
        type: String
    }
}, {
    timestamps: true
})

const my_invoice = mongoose.model('facture', factureModel)

module.exports = my_invoice;