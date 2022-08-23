const API = "/api/playlist";

module.exports = {
  [`${API}/create-playlist`]: {
    post: {
      operationId: "Create playlist.",
      security: [{}],
      description: "Create new playlist.",
      requestBody: {
        description: "All fields are required.",
        required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/Playlist" } } },
      },
      tags: ["Playlist"],
      responses: {
        200: {
          description: "Success",
          content: { "application/json": { schema: { type: "object" } } },
        },
        default: {
          description: "Error",
          content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
        },
      },
    },
  },
  [`${API}/delete-playlist`]: {
    delete: {
      operationId: "Delete playlist.",
      security: [{}],
      description: "Delete a playlist.",
      requestBody: {
        description: "Id and code",
        required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/PlaylistId" } } },
      },
      tags: ["Playlist"],
      responses: {
        200: {
          description: "Success",
          content: { "application/json": { schema: { type: "object" } } },
        },
        default: {
          description: "Error",
          content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
        },
      },
    },
  },
  [`${API}/modify-playlist`]: {
    put: {
      operationId: "Modify playlist.",
      security: [{}],
      description: "Modify a playlist.",
      requestBody: {
        description: "All fields are required.",
        required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/PlaylistWithId" } } },
      },
      tags: ["Playlist"],
      responses: {
        200: {
          description: "Success",
          content: { "application/json": { schema: { type: "object" } } },
        },
        default: {
          description: "Error",
          content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
        },
      },
    },
  },
  [`${API}/get-playlist`]: {
    post: {
      operationId: "Get playlist.",
      security: [{}],
      description: "Get all playlist.",
      requestBody: {
        description: "All fields are required.",
        required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/PlaylistId" } } },
      },
      tags: ["Playlist"],
      responses: {
        200: {
          description: "Success",
          content: {
            "application/json": {
              schema: {
                type: "arrayOf",
                $ref: "#/components/schemas/TrackWithId",
              },
            },
          },
        },
        default: {
          description: "Error",
          content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
        },
      },
    },
  },
  [`${API}/get-playlists`]: {
    post: {
      operationId: "Get playlists.",
      security: [{}],
      description: "Get all playlists.",
      tags: ["Playlist"],
      requestBody: {
        description: "All fields are required.",
        required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/Token" } } },
      },
      responses: {
        200: {
          description: "Success",
          content: {
            "application/json": {
              schema: {
                type: "arrayOf",
                $ref: "#/components/schemas/PlaylistWithId",
              },
            },
          },
        },
        default: {
          description: "Error",
          content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
        },
      },
    },
  },
};
