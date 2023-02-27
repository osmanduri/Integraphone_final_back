const router = require('express').Router()
const path = require('path')
const multer = require('multer')
const fs = require('fs')
const contratModel = require('../Models/contratModel')
const verify = require('./utils/verifyToken')
const moment = require('moment');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(path.join(__dirname, "../Contrats", req.headers.nom_client)))
            fs.mkdirSync(path.join(__dirname, "../Contrats", req.headers.nom_client));

        setTimeout(() => {
            cb(null, `Contrats/${req.headers.nom_client}`)
        }, 1000);



    },
    filename: (req, file, cb) => {
        //console.log(path.extname(file.originalname))
        //console.log(req.file)

        req.fileName = file.originalname
        cb(null, file.originalname)

        //cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })

router.post('/', verify.verifyAdmin, upload.single("contrat"), async(req, res) => {
    //moment.locale('fr');
    const chemin_fichier = path.join(__dirname, "../Contrats") // Chemin ou va etre enregistré la facture
    let fichier_existe = false;

    const listeContrat = await contratModel.find({ nom_client: req.headers.nom_client }) //liste des factures selon le nom du client dans la requete

    listeContrat.forEach(e => {
        if (e.fileName === req.fileName) { // On verifie si le nom du fichier est déjà présent dans la base selon le nom du client
            console.log('Ce fichier existe deja !')
            fichier_existe = true
        }
    })


    if (!fichier_existe) { // si le fichier n'existe pas dans la base de donnée on peux alors créer la facture dans la bdd
        const contrat = new contratModel({
            fileName: req.fileName,
            chemin: chemin_fichier,
            nom_client: req.headers.nom_client,
            user_id: req.headers.user_id,
            typeContrat: req.headers.type,
            date_creation:new Date().toLocaleDateString()
        })

        try {
            const saveContrat = await contrat.save() 
            return res.send(saveContrat)
        } catch (err) {
            return res.send(err)
        }
    } else {
        res.send('Ce fichier existe déjà !')
    }

})

router.delete('/delete', async(req, res) => {
    const chemin_fichier_a_supprimer = path.join(__dirname, "../Contrats", req.headers.nom_client, req.headers.nom_fichier)

    const contrat = await contratModel.find({ fileName: req.headers.nom_fichier, nom_client: req.headers.nom_client })

    if (contrat) {
        console.log(contrat[0]._id)
        try {
            await contratModel.findByIdAndRemove(
                contrat[0]._id,
                (err, data) => {
                    if (!err) {
                        console.log("fichier supprimé de la base !!!")
                    } else {
                        console.log("erreur lors de la suppression")
                    }
                }
            )
        } catch (err) {
            console.log(err)
        }
    } else {
        console.log("contrat introuvable")
    }


    try {
        fs.unlinkSync(chemin_fichier_a_supprimer)
        return res.send('File deleted')
    } catch (err) {
        console.log(err)
        return res.send(err)
    }


})


module.exports = router;