const Auth = require('../model/auth.schema');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_ROUND = 10;
const tokenBuilderCred = {
    tokenSecret: 'TOKEN_SECRET_FOR_JWT',
    expiresIn: '12h'
}

module.exports.signup = (req, res) => {

    // validate username , email and password is not null 
    const body = req.body;

    const { username, email, password } = body;

    if (username && email && password) {

        // check email already exists or not
        Auth.findOne({ email })
            .then(emailFound => {
                // email already present in system 
                if (emailFound) {
                    res.status(400).json({
                        method: req.method,
                        error: 400,
                        massage: 'eamil already present in system.'
                    })
                } // create account if email not present
                else {
                    // before save encrypt the password
                    bcrypt.hash(password, SALT_ROUND, (err, hashPassword) => {

                        if (err) {
                            res.status(409).json({
                                method: req.method,
                                error: 400,
                                massage: 'error in creating account. please try again'
                            })
                        } else {
                            new Auth({
                                username,
                                email,
                                password: hashPassword
                            }).save()
                                .then(userCredentials => {
                                    const access_token = tokenBuilder(userCredentials);
                                    res.status(201).json(access_token);
                                })
                                .catch(errorInSavingUser => {
                                    res.status(406).json({
                                        method: req.method,
                                        error: 406,
                                        massage: 'auth failed. try Again.'
                                    })
                                })
                        }
                    })

                }
            })
            .catch(error => {
                res.status(500).json({
                    method: req.method,
                    error: 500,
                    massage: 'internal Server Error.'
                })
            })
    } else {
        res.status(400).json({
            method: req.method,
            error: 400,
            massage: 'username , email , passoword must not null.'
        })
    }

}

module.exports.login = (req, res) => {

    // validate username , email and password is not null 
    const body = req.body;

    const { email, password } = body;

    if (email && password) {

        // check email already exists or not
        Auth.findOne({ email })
            .then(userCredentials => {
                if (userCredentials) {
                    // match password
                    bcrypt.compare(password, userCredentials.password, (err, same) => {
                        if (same) {

                            const access_token = tokenBuilder(userCredentials)
                            res.status(200).json({
                                access_token
                            })
                        } else {
                            res.status(409).json({
                                method: req.method,
                                error: 409,
                                massage: 'auth Failed',
                            })
                        }
                    })
                } else {
                    res.status(409).json({
                        method: req.method,
                        error: 409,
                        massage: 'auth Failed',
                    })
                }

            })
            .catch(error => {
                res.status(500).json({
                    method: req.method,
                    error: 500,
                    massage: 'internal Server Error.'
                })
            })
    } else {
        res.status(400).json({
            method: req.method,
            error: 400,
            massage: 'username , email , passoword must not null.'
        })
    }
}

const errorBuilder = (method, error, message) => {
    return {
        method,
        error,
        massage
    }
}



const tokenBuilder = (userCredentials) => {

    const tokenData = {
        username: userCredentials.username,
        email: userCredentials.email,
        id: userCredentials._id,
        role: userCredentials.role
    }

    return jwt.sign(
        tokenData,
        tokenBuilderCred.tokenSecret,
        {
            expiresIn: tokenBuilderCred.expiresIn
        })
}


