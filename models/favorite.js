const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const favoriteShema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  campsites:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campsite"
  }]
});

const Favorite = mongoose.model("Favorite", favoriteShema);

module.exports = Favorite;
