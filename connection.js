const { MongoTopologyClosedError } = require("mongodb")
const mongoose = require("mongoose")


async function main(){
    mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});

    const mgdb = mongoose.connection;

    mgdb.on('connected', console.log.bind(console, "Mongo connected"));
}

module.exports=main