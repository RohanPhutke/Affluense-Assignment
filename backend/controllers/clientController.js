const Client = require("../models/Client")

const { validateClient } = require("../validators/clientValidator")

const createClient = async (req, res) => {
    try {
        const validationError = validateClient(req.body);
        if(validationError){
            return res.status(400).json({
                error : {
                    code : "VALIDATION_ERROR",
                    message : validationError
                }
            });
        }

        const {
            name,
            email,
            phone,
            netWorth,
            category,
            primaryAssetClass,
            interests,
            onboardingDate
        } = req.body;

        const client = await Client.create({
            advisorId: req.advisorId,
            name: name.trim(),
            email: email ? email.trim().toLowerCase() : undefined,
            phone: phone ? phone.trim() : undefined,
            netWorth,
            category,
            primaryAssetClass: primaryAssetClass.trim(),
            interests: interests.map((interest) => interest.trim()),
            onboardingDate: new Date(onboardingDate)
        });

        return res.status(201).json({
            client
        });

    } catch (error) {
        console.error("Create client error:", error);

        return res.status(500).json({
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "Something went wrong"
            }
        }); 
    }
}

module.exports = {
    createClient
};