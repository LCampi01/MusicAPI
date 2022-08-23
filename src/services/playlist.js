const {
  Types: { ObjectId },
} = require("mongoose");
const { Playlist, Track } = include("models");
const jsonWebToken = include("helpers/jsonWebToken");

class PlaylistServices {
  constructor() {}

  createPlaylist = async ({ token, name, creator, playtime, trackList }) => {
    try {
      const result = await jsonWebToken.validateToken(token, process.env.JWT_SECRET);
      if (result) {
        const code = toUpper(name.slice(2) + "-" + creator.slice(2));
        const alreadyExist = await Playlist.findOne({
          code,
        });
        if (!alreadyExist) {
          const tracksExists = trackList.every((track) => Track.findOne({ _id: ObjectId(track._id) }));
          if (tracksExists) {
            return await Playlist.create({
              _id: ObjectId(),
              name,
              creator,
              playtime,
              trackList,
              code,
            });
          } else {
            return { error: "Invalid track was introduced." };
          }
        }
        return { error: "Playlist already exist." };
      }
      return { error: "UNAUTHORIZED." };
    } catch (err) {
      return { error: err.message };
    }
  };

  deletePlaylist = async ({ token, id, code }) => {
    try {
      const result = await jsonWebToken.validateToken(token, process.env.JWT_SECRET);
      if (result) {
        const PlaylistToDelete = await Playlist.findOne({ _id: ObjectId(id), code });
        if (PlaylistToDelete) return Playlist.updateOne({ _id: ObjectId(id), code }, { deleted: true });
        return { error: "Playlist does not exist." };
      }
      return { error: "UNAUTHORIZED." };
    } catch (err) {
      return { error: err.message };
    }
  };

  modifyPlaylist = async ({ token, id, code, name, creator, playtime, trackList }) => {
    try {
      const result = await jsonWebToken.validateToken(token, process.env.JWT_SECRET);
      if (result) {
        const PlaylistToModify = await Playlist.findOne({ _id: ObjectId(id), code });
        if (PlaylistToModify)
          if (trackList) {
            const tracksExists = trackList.every((track) => Track.findOne({ _id: ObjectId(track._id) }));
            if (!tracksExists) return { error: "Invalid track was introduced." };
          }
        return Playlist.updateOne({ _id: ObjectId(id), code }, { name, creator, playtime, trackList });
      }
      return { error: "UNAUTHORIZED." };
    } catch (err) {
      return { error: err.message };
    }
  };

  getPlaylists = async ({ token }) => {
    try {
      const result = await jsonWebToken.validateToken(token, process.env.JWT_SECRET);
      if (result) {
        return await Playlist.find({ deleted: false });
      }
      return { error: "UNAUTHORIZED." };
    } catch (err) {
      return { error: err.message };
    }
  };

  getPlaylist = async ({ token, id, code }) => {
    try {
      const result = await jsonWebToken.validateToken(token, process.env.JWT_SECRET);
      if (result) {
        const findedPlaylist = await Playlist.findOne({ _id: ObjectId(id), code });
        if (findedPlaylist) return findedPlaylist;
        return { error: "Playlist does not exist." };
      }
      return { error: "UNAUTHORIZED." };
    } catch (err) {
      return { error: err.message };
    }
  };

  addTracks = async ({ token, id, code, newTracks }) => {
    try {
      const result = await jsonWebToken.validateToken(token, process.env.JWT_SECRET);
      if (result) {
        const findedPlaylist = await Playlist.findOne({ _id: ObjectId(id), code });
        const { trackList } = findedPlaylist;
        if (findedPlaylist) {
          const tracksExists = trackList.every((track) => Track.findOne({ _id: ObjectId(track._id) }));
          if (!tracksExists) return { error: "Invalid track was introduced." };
          const tracksToUpdate = [...trackList, ...newTracks];
          return Playlist.updateOne({ _id: ObjectId(id), code }, { trackList: tracksToUpdate });
        }
        return { error: "Playlist does not exist." };
      }
      return { error: "UNAUTHORIZED." };
    } catch (err) {
      return { error: err.message };
    }
  };
}
module.exports = new PlaylistServices();
