const {
  Types: { ObjectId },
} = require("mongoose");
const { Track } = include("models");

class TrackServices {
  constructor() {}

  generateToken = async ({ code }) => {
    //const trackCode = await this.fetchOne({ code });
    console.log(code);
    if (true) {
      const secret = process.env.JWT_SECRET;
      const token = await jsonWebToken.generateToken(code, secret);
      return {
        token,
      };
    }
    return { error: "Invalid code." };
  };

  createTrack = async ({ name, album, artist, duration, artwork, audio }) => {
    const code = toUpper(name.slice(2) + "-" + album.slice(2) + artist.slice(2));
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
      });
    }
    return { error: "Track already exist." };
  };

  deleteTrack = async ({ id, code }) => {
    const trackToDelete = await Track.findOne({ _id: ObjectId(id), code });
    if (trackToDelete) return Track.updateOne({ _id: ObjectId(id), code }, { deleted: true });
    return { error: "Track does not exist." };
  };

  modifyTrack = async ({ id, code, name, album, artist, duration, artwork, audio }) => {
    const trackToModify = await Track.findOne({ _id: ObjectId(id), code });
    if (trackToModify)
      return Track.updateOne({ _id: ObjectId(id), code }, { name, album, artist, duration, artwork, audio });
    return { error: "Track does not exist." };
  };

  getTracks = async () => {
    return await Track.find({ deleted: false });
  };

  getTrack = async ({ id, code }) => {
    const findedTrack = await Track.findOne({ _id: ObjectId(id), code });
    if (findedTrack) return findedTrack;
    return { error: "Track does not exist." };
  };
}
module.exports = new TrackServices();
