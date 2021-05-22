const router = require('express').Router();

const Item = require('./../model/item.schema');

router.get('/', (req, res) => {
    Item
        .find()
        .then(response => {
            res.status(200).json({
                count: response.length,
                items: response
            });
        })
        .catch(error => {
            res.status(500).json({
                method: req.method,
                error: 500,
                massage: 'internal Server Error.'
            })
        })
});

router.post('/', (req, res) => {

    const { name, imageUrl, description, price } = req.body;

    if (name && imageUrl && description && price) {

        new Item({ name, imageUrl, description, price })
            .save()
            .then(response => {
                res.status(200).json({
                    item: response
                });
            })
            .catch(error => {
                res.status(500).json({
                    method: req.method,
                    error: 500,
                    massage: 'internal Server Error.'
                })
            })

    } else {

        res.status(500).json({
            method: req.method,
            error: 500,
            massage: 'please provide all necessary fields.'
        })

    }


});

router.patch('/:itemId', (req, res) => {

    const itemId = req.params.itemId;
    const { name, imageUrl, description, price } = req.body

    Item.findByIdAndUpdate(itemId, { name, imageUrl, description, price }, { new: true })
        .then(response => {
            res.status(200).json({
                item: response
            });
        })
        .catch(error => {
            res.status(500).json({
                method: req.method,
                error: 500,
                massage: 'internal Server Error.'
            })
        })
});

router.delete('/:itemId', (req, res) => {

    const itemId = req.params.itemId;

    Item.findByIdAndDelete(itemId)
        .then(response => {
            res.status(200).json({
                method: req.method,
                code: 200,
                massage: 'item deleted successfully.'
            });
        })
        .catch(error => {
            res.status(500).json({
                method: req.method,
                error: 500,
                massage: 'internal Server Error.'
            })
        })
});


module.exports = router;