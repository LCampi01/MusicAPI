const mongoose = require("mongoose");

const {
  Schema,
  Types: { ObjectId },
} = mongoose;

const PlaylistSchema = new Schema(
  {
    _id: ObjectId,
    name: {
      type: String,
      required: [true, "Name is obligatory."],
    },
    creator: {
      type: String,
      required: [true, "Creator is obligatory."],
    },
    playtime: {
      type: String,
      required: [true, "Playtime is obligatory."],
    },
    trackList: {
      type: [Object],
      required: [true, "TrackList is obligatory."],
    },
    code: {
      type: String,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "playlist",
    timestamps: true,
  }
);

module.exports = mongoose.model("Playlist", PlaylistSchema);
