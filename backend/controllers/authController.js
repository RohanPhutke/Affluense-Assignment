const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const Advisor = require("../models/Advisor")

const validateSignUp = require("../validators/authValidator")

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

module.exports = signup;