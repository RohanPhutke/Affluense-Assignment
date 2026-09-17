const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
    {
        advisorId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Advisor",
            required : true,
            index : true
        },

        name : {
            type : String,
            required: true,
            trim : true
        },

        email: {
            type: String,
            trim: true,
            lowercase: true
        },

        phone: {
            type: String,
            trim: true
        },

        netWorth: {
            type: Number,
            required: true,
            min: 0
        },

        category: {
            type: String,
            required: true,
            enum: ["HNI", "UHNI"]
        },

        primaryAssetClass: {
            type: String,
            required: true,
            trim: true
        },

        interests: {
            type: [String],
            default: []
        },

        onboardingDate: {
            type: Date,
            required: true
        }
    },
    {
        timestamps : true
    }
);

clientSchema.pre("validate", function() {
    if(!this.email && !this.phone){
        return new Error("At least one of email or phone is required");
    }
});

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;