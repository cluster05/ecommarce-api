const express = require('express');
const cors = require('cors');
const mongoose = require('./mongoose');

const authRoutes = require("./api/routes/auth.route");
const userRoutes = require("./api/routes/user.route");
const itemRoutes = require("./api/routes/item.route");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/items', itemRoutes);

app.use('/**', (req, res) => {
    res.send({
        method: "Unknown path",
        massage: "No routes defined for given URL.Please check your URL."
    })
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`listing on PORT : ${PORT}`));