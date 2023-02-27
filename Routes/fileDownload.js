const router = require('express').Router()
const path = require('path')


router.get('/facture', (req, res) => {
    const chemin = path.join(__dirname, "../Factures", req.headers.nom_client, req.headers.nom_fichier)
   res.download(chemin)
})

router.get('/contrat', (req, res) => {
    const chemin = path.join(__dirname, "../Contrats", req.headers.nom_client, req.headers.nom_fichier)
    res.download(chemin)
})

module.exports = router