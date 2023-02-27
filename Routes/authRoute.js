const router = require('express').Router();
const userControllers = require('../Controllers/userController');
const verify = require('./utils/verifyToken');
router.get('/healthy', (req, res) => {
    res.status(200).json({message:"i'm healthy !"})
})

const invoiceController = require('../Controllers/invoiceController')

//auth

router.get('/', verify.verifyAdmin, userControllers.getAllUsers); // Permet d'obtenir la liste de tout les utilisateurs
router.post('/filtered', userControllers.getAllUsersFiltered);  // Permet de filtrer par nom
router.get('/:id', verify.verifyUser, userControllers.getUserById); // Permet d'obtenir un utilisateur par son ID
router.post('/add', verify.verifyAdmin, userControllers.addUser);   // Permet d'ajouter un nouvel utilisateur
router.put('/update/:id', verify.verifyUser, userControllers.updateUser);  // Permet de mettre à jour un utilisateur
router.put('/update/password/:id', verify.verifyUserResetPassword, userControllers.updatePassword); // Permet de mettre un mot de passe d'un utilisateur
router.delete('/delete/:id',verify.verifySuperAdmin, invoiceController.deleteAllInvoiceUser, userControllers.deleteUser);   // Supprime un utilisateur avec ses factures et contrats


router.get('/verify/userResetPassword/:id', verify.verifyTokenResetPassword, (req, res) => { // Permet de verifier si le token est bon pour modifier le mdp d'un utilisateur (car le token est lié à l'ancien mot de passe du user)
    res.send('Password Reset Route')
})

router.post('/checkPassword/:id', userControllers.checkUserPassword) // Decrypte et compare 2 mots de passe entre eux
router.post('/checkValidationCode/:id', userControllers.checkValidationCode)  // Verifie si le code de validation pour telecharger un fichier est correct
router.post('/doubleAuthentification/:id', userControllers.doubleAuthentification)  // Permet d'envoyer le code à 4 chiffres pour telecharger un fichier sur le site

router.post('/login', userControllers.signIn); // Permet de se connecter


module.exports = router
