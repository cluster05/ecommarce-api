const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose
    .connect(
        "mongodb://localhost:27017/ecommarce", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then(console.log("Database Connected"))
    .catch((error) => console.log("Error in connnecting database"));

module.exports = mongoose;


