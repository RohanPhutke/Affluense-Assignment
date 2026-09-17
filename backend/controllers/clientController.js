const mongoose = require("mongoose");
const Client = require("../models/Client")

const { validateClient, validateClientQuery, validateClientUpdate } = require("../validators/clientValidator")

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

const getClients = async (req, res) => {
    try {
        const validationError = validateClientQuery(req.query);

        if (validationError) {
            return res.status(400).json({
                error: {
                    code: "VALIDATION_ERROR",
                    message: validationError
                }
            });
        }

        const search = req.query.search?.trim();
        const category = req.query.category;
        const sort = req.query.sort || "netWorth_desc";

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 25;

        const filter = {
            advisorId : req.advisorId
        };

        if (search){
            filter.name = {
                $regex : search,
                $options : "i"
            }
        }

        if(category){
            filter.category = category;
        }

        let sortOption = {
            netWorth : -1,
            _id : -1
        };

        if(sort == "netWorth_asc") {
            sortOption = {
                netWorth : 1,
                _id : 1
            };
        }

        const skip = (page - 1) * limit;

        const [clients, total] = await Promise.all([
            Client.find(filter)
                .sort(sortOption)
                .skip(skip)
                .limit(limit)
                .lean(),
            Client.countDocuments(filter)
        ]);
        
        return res.status(200).json({
            clients,
            pagination : {
                page,
                limit,
                total,
                totalPages : Math.ceil(total/limit)
            }
        });

    } catch (error) {
        console.error("Get clients error:", error);

        return res.status(500).json({
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "Something went wrong"
            }
        });
    }
}

const getClientById = async (req, res) => {
    try {
        const { clientId } = req.params;

        if(!mongoose.Types.ObjectId.isValid(clientId)){
            return res.status(400).json({
                error : {
                    code : "INVALID_CLIENT_ID",
                    message: "Invalid client id"
                }
            });
        }

        const client = await Client.findOne({
            _id : clientId,
            advisorId : req.advisorId
        }).lean();

        if(!client){
            return res.status(404).json({
                error : {
                    code : "CLIENT_NOT_FOUND",
                    message : "Client not found"
                }
            });
        }

        return res.status(200).json({
            client
        });

    } catch (error) {
        console.error("Get client error:", error);

        return res.status(500).json({
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "Something went wrong"
            }
        });
    }
}

const updateClient = async (req, res) => {
    try {
        const { clientId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(clientId)) {
            return res.status(400).json({
                error: {
                    code: "INVALID_CLIENT_ID",
                    message: "Invalid client ID"
                }
            });
        }

        const validationError = validateClientUpdate(req.body);

        if (validationError) {
            return res.status(400).json({
                error: {
                    code: "VALIDATION_ERROR",
                    message: validationError
                }
            });
        }

        const updateData = {};

        if (req.body.name !== undefined) {
            updateData.name = req.body.name.trim();
        }

        if (req.body.email !== undefined) {
            updateData.email = req.body.email.trim().toLowerCase();
        }

        if (req.body.phone !== undefined) {
            updateData.phone = req.body.phone.trim();
        }

        if (req.body.netWorth !== undefined) {
            updateData.netWorth = req.body.netWorth;
        }

        if (req.body.category !== undefined) {
            updateData.category = req.body.category;
        }

        if (req.body.primaryAssetClass !== undefined) {
            updateData.primaryAssetClass =
                req.body.primaryAssetClass.trim();
        }

        if (req.body.interests !== undefined) {
            updateData.interests =
                req.body.interests.map((interest) => interest.trim());
        }

        if (req.body.onboardingDate !== undefined) {
            updateData.onboardingDate =
                new Date(req.body.onboardingDate);
        }

        const client = await Client.findOneAndUpdate(
            {
                _id: clientId,
                advisorId: req.advisorId
            },
            updateData,
            {
                returnDocument: "after",
                runValidators: true
            }
        ).lean();

        if (!client) {
            return res.status(404).json({
                error: {
                    code: "CLIENT_NOT_FOUND",
                    message: "Client not found"
                }
            });
        }

        return res.status(200).json({
            client
        });
    } catch (error) {
        console.error("Update client error:", error);

        return res.status(500).json({
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "Something went wrong"
            }
        });
    }
};

const deleteClient = async (req, res) => {
    try {
        const { clientId } = req.params;
    
        if (!mongoose.Types.ObjectId.isValid(clientId)) {
            return res.status(400).json({
                error: {
                    code: "INVALID_CLIENT_ID",
                    message: "Invalid client ID"
                }
            });
        }

        const client = await Client.findOneAndDelete({
            _id : clientId,
            advisorId : req.advisorId
        });

        if(!client){
            return res.status(404).json({
                error : {
                    code : "CLIENT_NOT_FOUND",
                    message : "Client not found"
                }
            });
        }

        return res.status(204).send();

    } catch (error) {
        console.error("Delete client error : ", error);

        return res.status(500).json({
            error : {
                code : "INTERNAL_SERVER_ERROR",
                message : "Something went wrong."
            }
        });
    }
}

module.exports = {
    createClient,
    getClients,
    getClientById,
    updateClient,
    deleteClient
};