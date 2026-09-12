const { string } = require("joi");
const monogoose = require("mongoose");
const Schema = monogoose.Schema;

const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt: {
        type:Date,
    default: Date.now(),
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

module.exports = monogoose.model("Review",reviewSchema);