const router = require('express').Router()
const path = require('path')
const multer = require('multer')
const fs = require('fs')
const factureModel = require('../Models/factureModel')
const verify = require('./utils/verifyToken')
const moment = require('moment');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        
        if(!fs.existsSync(path.join(__dirname, "../Factures",  req.headers.nom_client)))
            fs.mkdirSync(path.join(__dirname, "../Factures", req.headers.nom_client));

        setTimeout(() => {
            cb(null, `Factures/${req.headers.nom_client}`) // on indique le dossier dans lequel le fichier va être sauvegardé
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

const upload = multer({storage: storage })

router.post('/', verify.verifyAdmin, upload.single("facture"), async (req, res) => {
    const chemin_fichier = path.join(__dirname, "../Factures") // Chemin ou va etre enregistré la facture
    let fichier_existe = false;

    const listeFacture = await factureModel.find({nom_client:req.headers.nom_client}) //liste des factures selon le nom du client dans la requete

    listeFacture.forEach(e => {
        if(e.fileName === req.fileName){ // On verifie si le nom du fichier est déjà présent dans le dossier du client
            fichier_existe = true
        }
    })

    if(!fichier_existe){ // si le fichier n'existe pas dans le dossier du client alors on crée une nouvelle facture dans le dossier client
        const facture = new factureModel({
            fileName:req.fileName,
            chemin: chemin_fichier,
            nom_client:req.headers.nom_client,
            user_id:req.headers.user_id,
            date_creation:new Date().toLocaleDateString()
        })
    
        try{
            const saveFacture = await facture.save() // On sauvegarde la facture dans mongoDB
            return res.send(saveFacture)
        }catch(err){
            return res.send(err)
        }  
    }else{
        res.send('Ce fichier existe déjà !') // Si le fichier est déjà présent on renvoi un message au Client "Ce fichier existe déjà"
    } 

})

router.delete('/delete', verify.verifySuperAdmin , async (req, res) => {
    const chemin_fichier_a_supprimer = path.join(__dirname, "../Factures",  req.headers.nom_client, req.headers.nom_fichier) // le chemin du fichier à supprimer

    const facture = await factureModel.find({fileName:req.headers.nom_fichier, nom_client:req.headers.nom_client}) // on vérifie si la facture existe dans le dossier du client

    if(facture){ // si la facture existe alors on appele la methode findByIdAndRemove pour supprimer la facture
        //console.log(facture[0]._id)
        try{
            await factureModel.findByIdAndRemove(
                facture[0]._id,
                (err, data) => {
                    if(!err){ // s'il n'y a pas d'erreur dans le callback alors on affiche dans la console que le fichier à bien ete supprimé
                        console.log("fichier supprimé de la base !!!") 
                    }else{
                        console.log("erreur lors de la suppression") // sinon on indique qu'il y a eu une erreur
                    } 
                } 
            )
        }catch(err){
            console.log(err)
        } 
    }else{
        console.log("facture introuvable")
    } 
    
        
            try{
                fs.unlinkSync(chemin_fichier_a_supprimer) // on essaye de supprimer le fichier avec la commande fs.unlinkSync en lui donnant en parametre d'entre le chemin du fichier
                return res.send('Facture supprimé') // si tout s'est bien passé on renvoi au client le message "Facture supprimé !"
            } catch(err){          
                console.log(err)
                return res.send(err) // sinon on renvoi l'erreur
            } 
        

})

module.exports = router;