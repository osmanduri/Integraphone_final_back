const mongoose = require('mongoose')
const moment = require('moment');
moment.locale('fr');

const contratModel = new mongoose.Schema({
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
    },
    typeContrat: {
        type: String
    }
}, {
    timestamps: true
})

const my_contrat = mongoose.model('contrat', contratModel)

module.exports = my_contrat;