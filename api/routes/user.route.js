const express = require('express');
const router = express.Router();
const Item = require('../model/item.schema');
const User = require('./../model/user.schema');

const createNewUser = (userId, res) => {
    new User({ userId })
        .save()
        .then(response => {
            res.status(200).json({
                user: response
            })
        })
        .catch(error => {
            res.status(500).json({
                method: req.method,
                error: 500,
                massage: 'internal Server Error.'
            })
        })
}

manageInternalServerError = (req) => {
    res.status(500).json({
        method: req.method,
        error: 500,
        massage: 'internal Server Error.'
    })
}

router.get('/:userId', (req, res) => {
    const userId = req.params.userId;

    User
        .findOne({ userId })
        .then(response => {
            if (response) {
                console.log('user found')
                res.status(200).json({
                    user: response
                })
            } else {
                console.log('new user created')
                createNewUser(userId, res);
            }
        })
        .catch(error => manageInternalServerError(req))
});


// cart
router.patch('/:userId/cart/:itemId', (req, res) => {

    const { userId, itemId } = req.params;

    User
        .findOne({ userId })
        .then(response => {
            let cartItems = [];
            cartItems = response.cart;
            cartItems = [...cartItems, itemId];
            User
                .findOneAndUpdate({ userId }, { cart: cartItems })
                .then(response => {
                    Item
                        .findById(itemId)
                        .then(response => {
                            res.status(200).json({
                                item: response
                            });
                        })
                        .catch(error => manageInternalServerError(req))
                })
                .catch(error => manageInternalServerError(req))
        })
        .catch(error => manageInternalServerError(req))

});

// cart delete item 
router.delete('/:userId/cart/:itemId', (req, res) => {
    const { userId, itemId } = req.params;

    User
        .findOne({ userId })
        .then(response => {
            let cartItems = [];
            cartItems = response.cart;
            cartItems = cartItems.filter(item_id => item_id !== itemId);
            User
                .findOneAndUpdate({ userId }, { cart: cartItems })
                .then(response => {
                    res.status(200).json({
                        method: req.method,
                        code: 200,
                        massage: 'item deleted successfully.'
                    });
                })
                .catch(error => manageInternalServerError(req))
        })
        .catch(error => manageInternalServerError(req))
});


// order manager

router.patch('/:userId/order/place', (req, res) => {

    const { userId } = req.params;

    User.findOne({ userId })
        .then(response => {

            let cartItems = [];
            cartItems = response.cart;

            if (cartItems.length > 0) {
                getCartItemAndPlaceOrder(req, userId, cartItems)
            }
        })
        .catch(error => manageInternalServerError(req))

});

const getCartItemAndPlaceOrder = (req, userId, cartItems) => {
    Item.find({
        _id: { $in: cartItems }
    })
        .then(response => {
            let price = 0;
            response.forEach(item => {
                price += item.price
            });
            const items = [];
            response.forEach(item => {
                const buildItem = {
                    itemId: item._id,
                    name: item.name,
                    descrption: item.descrption,
                    price: item.price
                }
                items.push(buildItem);
            })
            const buildOrder = {
                price,
                created_at: Date.now(),
                items: buildItem
            }

            User
                .findOneAndUpdate({ userId }, { orders: buildOrder }, { new: true })
                .then(res => {
                    req.status(200).json({
                        order: res,
                        message: 'order placed'
                    })
                })
                .catch(error => manageInternalServerError(req))
        })
        .catch(error => manageInternalServerError(req))
}

module.exports = router;