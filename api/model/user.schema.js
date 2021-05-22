const mongoose = require('mongoose');
const orderModel = require('./order.model');

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    contactNo: {
        type: Number
    },
    orders: {
        type: String
    },
    cart: {
        type: [String]
    },
    orders: {
        type: [orderModel],
    }
});

module.exports = mongoose.model('user', userSchema);
