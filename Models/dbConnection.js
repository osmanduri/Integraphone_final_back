const mongoose = require('mongoose')
require('dotenv').config({ path: './Config/.env' })

mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useNewUrlParser: true, useFindAndModify: false },
    (err) => {
        if(!err){
            console.log("Mongodb connected")
        }
        else{
            console.log("Connection error:" + err)
        }
    }
)