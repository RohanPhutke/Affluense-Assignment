const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const Advisor = require("../models/Advisor")

const { validateSignUp, validateLogin } = require("../validators/authValidator")

const signup = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        const validationError = validateSignUp(req.body);

        if(validationError){
            return res.status(400).json({
                error : {
                    code : "VALIDATION_ERROR",
                    message : validationError
                }
            })
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingAdvisor = await Advisor.findOne({
            email : normalizedEmail
        });

        if(existingAdvisor){
            return res.status(409).json({
                error: {
                    code : "EMAIL_ALREADY_EXISTS",
                    message : "An acccount with this email already exists"
                }
            })
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const advisor = await Advisor.create({
            name : name.trim(),
            email : normalizedEmail,
            passwordHash
        });

        const token = jwt.sign(
            {
               advisorId : advisor._id.toString() 
            },
            process.env.JWT_SECRET,
            {
                expiresIn : "7d"
            }
        );

        res.cookie("token", token, {
            httpOnly : true,
            sameSite : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            advisor : {
                id : advisor._id,
                name : advisor.name,
                email : advisor.email
            }
        });

    } catch (error) {
        console.error("Signup error : ", error);

        return res.status(500).json({
            error : {
                code : "INTERNAL_SERVER_ERROR",
                message: "Something went wrong"
            }
        })
    }
};

const login = async (req, res) => {
    try {
        const {email , password} = req.body;

        const validationError = validateLogin(req.body);

        if(validationError){
            return res.status(400).json({
                error : {
                    code : "VALIDATION_ERROR",
                    message : validationError
                }
            })
        }

        const normalizedEmail = email.trim().toLowerCase();

        const advisor = await Advisor.findOne({
            email : normalizedEmail
        });

        if(!advisor){
            return res.status(401).json({
                error : {
                    code : "INVALID_CREDENTIALS",
                    message : "Invalid email or password"
                }
            })
        }

        const passwordMatches = await bcrypt.compare(password, advisor.passwordHash);

        if(!passwordMatches){
            return res.status(401).json({
                error : {
                    code : "INVALID_CREDENTIALS",
                    message : "Invalid email or password"
                }
            })
        }

        const token = jwt.sign(
            {
               advisorId : advisor._id.toString() 
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.cookie("token", token, {
            httpOnly: true,
            sameSite : "lax",
            maxAge : 7 * 24* 60 * 60 * 1000
        });

        return res.status(200).json({
            advisor : {
                id : advisor._id,
                name : advisor.name,
                email : advisor.email
            }
        });

    } catch (error) {
        console.error("Login Error: ", error)

        return res.status(500).json({
            error: {
                code : "INTERNAL_SERVER_ERROR",
                message : "Something went wrong."
            }
        });
    }
}

const logout = async (req, res) => {
    res.clearCookie("token", {
        httpOnly : true,
        sameSite : "lax"
    });

    return res.status(204).send()
}

module.exports = {
    signup,
    login,
    logout
};