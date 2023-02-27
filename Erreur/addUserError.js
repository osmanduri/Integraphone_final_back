const erreur_add_user = (err) => {
    if(err.code === 11000)
    {
        if(err.keyValue.nom){
            return 'Ce nom est déjà utilisé !'
        }
        if(err.keyValue.prenom){
            return 'Ce prenom est déjà utilisé !'
        }
        if(err.keyValue.email){
            return 'Cet email est déjà utilisé !'
        }
    } 
    
} 

module.exports = erreur_add_user;