const mongoose = require("mongoose")

const Client = require("../models/Client")

const getInsights = async (req, res) => {
    try {
        const advisorId = new mongoose.Types.ObjectId(req.advisorId);

        const result = await Client.aggregate([
            {
                $match : {
                    advisorId
                }
            },
            {
                $facet : {
                    summary : [
                        {
                            $group : {
                                _id : null,
                                totalClients : {
                                    $sum : 1
                                },
                                aggregateNetWorth : {
                                    $sum : "$netWorth"
                                }
                            }
                        },
                        {
                            $project : {
                                _id : 0,
                                totalClients : 1,
                                aggregateNetWorth : 1
                            }
                        
                        }
                    ],

                    categoryDistribution : [
                        {
                            $group : {
                                _id : "$category",
                                count : {
                                    $sum : 1
                                }
                            }
                        }
                    ]
                }
            }
        ]);

        const summary = result[0].summary[0] || {
            totalClients : 0,
            aggregateNetWorth : 0
        };

        const categoryDistribution = {
            HNI : 0,
            UHNI : 0
        };

        for(const category of result[0].categoryDistribution) {
            categoryDistribution[category._id] = category.count
        }

        return res.status(200).json({
            totalClients : summary.totalClients,
            categoryDistribution,
            aggregateNetWorth : summary.aggregateNetWorth
        });


    } catch (error) {
        console.error("Get insights error:", error);

        return res.status(500).json({
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "Something went wrong"
            }
        });
    }
}

module.exports = {
    getInsights
};