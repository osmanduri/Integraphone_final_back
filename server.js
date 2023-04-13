const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const my_users = require('./Routes/authRoute');
const my_fibre = require('./Routes/fibreRoute');
const my_partenaire = require('./Routes/partenaireRoute');
const my_devis = require('./Routes/devisRoute');
const uploadFacture = require('./Routes/sendInvoice');
const uploadContrat = require('./Routes/sendContract');
const my_invoice = require('./Routes/invoiceRoute');
const my_contrat = require('./Routes/contratRoute');
const file_download = require('./Routes/fileDownload');
const reset = require('./Routes/resetPassword');
const offresCoefficient = require('./Routes/offresCoefficientRoute');
require('dotenv').config()
require('./Models/dbConnection');
const cors = require('cors')
const cookieParser = require('cookie-parser')
var PORT = process.env.PORT || 5002

const corsOptions = {
    origin: "https://integraphone.fr",
    credentials: true
}

app.use(cors(corsOptions));

// Pour pourvoir acceder aux fichier en mode static si besoin
app.use(express.static('public'));
app.use('/Images', express.static('Images'));
app.use('/Factures', express.static('Factures'));



// Permer d'utiliser bodyParser + cookieParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());


// Routes
app.use('/api/users', my_users);
app.use('/api/fibre', my_fibre)
app.use('/api/partenaire', my_partenaire);
app.use('/api/devis', my_devis);
app.use('/api/upload/facture', uploadFacture);
app.use('/api/upload/contrat', uploadContrat);
app.use('/api/facture', my_invoice);
app.use('/api/contrat', my_contrat);
app.use('/api/download', file_download);
app.use('/api/reset', reset);
app.use('/api/coefficient', offresCoefficient);


//Port d'écoute
app.listen(PORT, () => {
    console.log('listening Port on: ' + PORT)
})
