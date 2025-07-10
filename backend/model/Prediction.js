// models/Prediction.js
const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    videoPath:
    {
        type: String,
        required: true
    },
    result:
    {
        type: String,
        required: true
    },
    confidence:
    {
        type: Number,
        required: true
    },
    uploadedAt:
    {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model("Prediction", predictionSchema);
