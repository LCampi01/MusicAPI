const track = {
  type: "object",
  required: ["name", "album", "artist", "duration", "artwork", "audio"],
  properties: {
    token: {
      type: "string",
    },
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
    token: {
      type: "string",
    },
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

const token = {
  type: "object",
  required: ["token"],
  properties: {
    token: {
      type: "string",
    },
  },
};

module.exports = {
  ArrayString: {
    type: "array",
    uniqueItems: true,
    items: { type: "string" },
  },
  ArrayNumber: {
    type: "array",
    uniqueItems: true,
    items: { type: "integer" },
  },
  ids: {
    type: "array",
    uniqueItems: true,
    items: { type: "string" },
  },
  ID: { type: "string" },
  Date: {
    type: "string",
    format: "date",
  },
  DateTime: {
    type: "string",
    format: "date-time",
  },
  Nullable: {
    nullable: true,
    not: {
      anyOf: [
        { type: "string" },
        { type: "number" },
        { type: "boolean" },
        { type: "object" },
        {
          type: "array",
          items: {},
        },
      ],
    },
  },
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
  Track: {
    ...token,
    ...track,
    properties: {
      ...token.properties,
      ...track.properties,
    },
  },
  TrackId: {
    ...token,
    properties: { ...token.properties, id: { type: "string" }, code: { type: "string" } },
  },
  TrackWithId: {
    ...token,
    ...track,
    properties: {
      ...token.properties,
      ...track.properties,
      id: { type: "string" },
      code: { type: "string" },
    },
  },
  Playlist: {
    ...token,
    ...playlist,
    properties: {
      ...token.properties,
      ...playlist.properties,
    },
  },
  PlaylistId: {
    ...token,
    properties: { ...token.properties, id: { type: "string" }, code: { type: "string" } },
  },
  PlaylistWithId: {
    ...token,
    ...playlist,
    properties: {
      ...token.properties,
      ...playlist.properties,
      id: { type: "string" },
      code: { type: "string" },
    },
  },
  Token: token,
};
