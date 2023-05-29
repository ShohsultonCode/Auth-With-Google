const { Schema, model } = require("mongoose");

const authModel = new Schema({
    google_id: {
        type: String,
        required: true,
    },
    display_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },

},
    {
        timestamps: true
    }
);

module.exports = model("Auth", authModel);