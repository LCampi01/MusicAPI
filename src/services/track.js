const {
  Types: { ObjectId },
} = require("mongoose");
const { Track } = include("models");
const jsonWebToken = include("helpers/jsonWebToken");

class TrackServices {
  constructor() {}

  generateToken = async () => {
    const token = await jsonWebToken.generateToken("MusicAPI", process.env.JWT_SECRET);
    return {
      token,
    };
  };

  createTrack = async ({ token, name, album, artist, duration, artwork, audio }) => {
    try {
      const result = await jsonWebToken.validateToken(token, process.env.JWT_SECRET);
      if (result) {
        const code = (name.slice(2) + "-" + album.slice(2) + artist.slice(2)).toUpperCase();
        const alreadyExist = await Track.findOne({
          code,
        });
        if (!alreadyExist) {
          return await Track.create({
            _id: ObjectId(),
            name,
            album,
            artist,
            duration,
            artwork,
            audio,
            code,
          });
        }
        return { error: "Track already exist." };
      }
      return { error: "UNAUTHORIZED" };
    } catch (err) {
      return { error: err.message };
    }
  };

  deleteTrack = async ({ token, id, code }) => {
    try {
      const result = await jsonWebToken.validateToken(token, process.env.JWT_SECRET);
      if (result) {
        const trackToDelete = await Track.findOne({ _id: ObjectId(id), code });
        if (trackToDelete) return Track.updateOne({ _id: ObjectId(id), code }, { deleted: true });
        return { error: "Track does not exist." };
      }
      return { error: "UNAUTHORIZED" };
    } catch (err) {
      return { error: err.message };
    }
  };

  modifyTrack = async ({ token, id, code, name, album, artist, duration, artwork, audio }) => {
    try {
      const result = await jsonWebToken.validateToken(token, process.env.JWT_SECRET);
      if (result) {
        const trackToModify = await Track.findOne({ _id: ObjectId(id), code });
        if (trackToModify)
          return Track.updateOne({ _id: ObjectId(id), code }, { name, album, artist, duration, artwork, audio });
        return { error: "Track does not exist." };
      }
      return { error: "UNAUTHORIZED" };
    } catch (err) {
      return { error: err.message };
    }
  };

  getTracks = async ({ token }) => {
    try {
      const result = await jsonWebToken.validateToken(token, process.env.JWT_SECRET);
      if (result) {
        return await Track.find({ deleted: false });
      }
      return { error: "UNAUTHORIZED" };
    } catch (err) {
      return { error: err.message };
    }
  };

  getTrack = async ({ token, id, code }) => {
    try {
      const result = await jsonWebToken.validateToken(token, process.env.JWT_SECRET);
      if (result) {
        const findedTrack = await Track.findOne({ _id: ObjectId(id), code });
        if (findedTrack) return findedTrack;
        return { error: "Track does not exist." };
      }
      return { error: "UNAUTHORIZED" };
    } catch (err) {
      return { error: err.message };
    }
  };
}
module.exports = new TrackServices();
