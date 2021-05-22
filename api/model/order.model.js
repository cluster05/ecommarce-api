const orderModel = {
    price: {
        type: Number,
        require: true
    },
    state: {
        type: String,
        required: true,
        default: 'ON_GOING'
        // "DELIVERED"
    },
    created_at: {
        type: Number,
    },
    placed_at: {
        type: Number
    },
    delivered_at: {
        type: Number
    },
    items: {
        _id: false,
        type: [{
            itemId: String,
            name: String,
            descrption: String,
            price: Number
        }]
    }
};

module.exports = orderModel;

