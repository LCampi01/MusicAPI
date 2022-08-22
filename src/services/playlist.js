const {
  Types: { ObjectId },
} = require("mongoose");
const { Playlist, Track } = include("models");

class PlaylistServices {
  constructor() {}

  createPlaylist = async ({ name, creator, playtime, trackList }) => {
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
        });
      } else {
        return { error: "Invalid track was introduced." };
      }
    }
    return { error: "Playlist already exist." };
  };

  deletePlaylist = async ({ id, code }) => {
    const PlaylistToDelete = await Playlist.findOne({ _id: ObjectId(id), code });
    if (PlaylistToDelete) return Playlist.updateOne({ _id: ObjectId(id), code }, { deleted: true });
    return { error: "Playlist does not exist." };
  };

  modifyPlaylist = async ({ id, code, name, creator, playtime, trackList }) => {
    const PlaylistToModify = await Playlist.findOne({ _id: ObjectId(id), code });
    if (PlaylistToModify)
      if (trackList) {
        const tracksExists = trackList.every((track) => Track.findOne({ _id: ObjectId(track._id) }));
        if (!tracksExists) return { error: "Invalid track was introduced." };
      }
    return Playlist.updateOne({ _id: ObjectId(id), code }, { name, creator, playtime, trackList });
  };

  getPlaylists = async () => {
    return await Playlist.find({ deleted: false });
  };

  getPlaylist = async ({ id, code }) => {
    const findedPlaylist = await Playlist.findOne({ _id: ObjectId(id), code });
    if (findedPlaylist) return findedPlaylist;
    return { error: "Playlist does not exist." };
  };

  addTracks = async ({ id, code, newTracks }) => {
    const findedPlaylist = await Playlist.findOne({ _id: ObjectId(id), code });
    const { trackList } = findedPlaylist;
    if (findedPlaylist) {
      const tracksExists = trackList.every((track) => Track.findOne({ _id: ObjectId(track._id) }));
      if (!tracksExists) return { error: "Invalid track was introduced." };
      const tracksToUpdate = [...trackList, ...newTracks];
      return Playlist.updateOne({ _id: ObjectId(id), code }, { trackList: tracksToUpdate });
    }
    return { error: "Playlist does not exist." };
  };
}
module.exports = new PlaylistServices();
