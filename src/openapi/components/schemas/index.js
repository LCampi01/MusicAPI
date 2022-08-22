const track = {
  type: "object",
  required: ["name", "album", "artist", "duration", "artwork", "audio"],
  properties: {
    name: {
      type: "string",
    },
    album: {
      type: "string",
    },
    artist: {
      type: "string",
    },
    duration: {
      type: "string",
    },
    artwork: {
      type: "string",
    },
    audio: {
      type: "string",
    },
  },
};

const playlist = {
  type: "object",
  required: ["name", "creator", "playlist", "trackList"],
  properties: {
    name: {
      type: "string",
    },
    creator: {
      type: "string",
    },
    playlist: {
      type: "string",
    },
    trackList: {
      type: "string",
    },
  },
};

module.exports = {
  Error: {
    type: "object",
    properties: {
      code: {
        type: "integer",
        format: "int32",
      },
      message: { type: "string" },
    },
  },
  Track: track,
  TrackId: {
    type: "object",
    properties: { id: { type: "string" } },
  },
  TrackWithId: {
    ...track,
    properties: {
      ...track.properties,
      id: { type: "string" },
      code: { type: "string" },
    },
  },
  Playlist: playlist,
  PlaylistId: {
    type: "object",
    properties: { id: { type: "string" } },
  },
  PlaylistWithId: {
    ...playlist,
    properties: {
      ...playlist.properties,
      id: { type: "string" },
      code: { type: "string" },
    },
  },
  Token: {
    type: "object",
    properties: { code: { type: "string" } },
  },
};
