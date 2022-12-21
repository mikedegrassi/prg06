const mongoose = require('mongoose');

const uri = 'mongodb+srv://prg06:Degrassi020@mycluster.tk6xger.mongodb.net/prg06?retryWrites=true&w=majority'

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(uri,  { useNewUrlParser: true, useUnifiedTopology: true });

        console.log(`Mongo DB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(error)

        process.exit(1)
    }
}

module.exports = connectDB