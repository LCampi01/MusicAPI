const mongoose = require("mongoose");

const {
  Schema,
  Types: { ObjectId },
} = mongoose;

const TrackSchema = new Schema(
  {
    _id: ObjectId,
    name: {
      type: String,
      required: [true, "Name is obligatory."],
    },
    album: {
      type: String,
      required: [true, "Album is obligatory."],
    },
    artist: {
      type: String,
      required: [true, "Artist is obligatory."],
    },
    duration: {
      type: String,
      required: [true, "Duration is obligatory."],
    },
    artwork: {
      type: String,
      required: [true, "Artwork is obligatory."],
    },
    audio: {
      type: String,
      required: [true, "Audio is obligatory."],
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
    collection: "track",
    timestamps: true,
  }
);

module.exports = mongoose.model("Track", TrackSchema);
