const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

// Connecting to mongodb
// mongoose.connect(db);

// Always wrap async await inside a try catch block
const connectDb = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('MongoDB connected')
    } catch (err) {
        console.log(err.message);
        // Exit process with failure
        process.exit(1);
    }
}


module.exports = connectDb;