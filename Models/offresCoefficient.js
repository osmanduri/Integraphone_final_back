const mongoose = require('mongoose');

const offreCoefficientSchema = new mongoose.Schema({
    fibreFTTO:{
        type:Number,
        default:1
    },
    fibreFTTE:{
        type:Number,
        default:1
    },
    fibreFTTH:{
        type:Number,
        default:1
    }

},
    {
        timestamps: true
    }
)

module.exports = mongoose.model('coefficient', offreCoefficientSchema);