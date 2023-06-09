const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movieSchema = new Schema({
    title: String,
    posterUrl: String,
    directorName: String,
    actors: [String]
}, { timestamps: true });

module.exports = mongoose.model("Movie", movieSchema);
