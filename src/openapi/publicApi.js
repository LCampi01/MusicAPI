const API = "/public-api";

module.exports = {
  [`${API}/create-track`]: {
    post: {
      operationId: "Create track.",
      security: [{}],
      description: "Create new track.",
      requestBody: {
        description: "All fields are required.",
        required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/Track" } } },
      },
      tags: ["API pública"],
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
  [`${API}/delete-track`]: {
    delete: {
      operationId: "Delete track.",
      security: [{}],
      description: "Delete a track.",
      requestBody: {
        description: "Id and code",
        required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/TrackId" } } },
      },
      tags: ["API pública"],
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
  [`${API}/modify-track`]: {
    put: {
      operationId: "Modify track.",
      security: [{}],
      description: "Modify a track.",
      requestBody: {
        description: "All fields are required.",
        required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/TrackWithId" } } },
      },
      tags: ["API pública"],
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
  [`${API}/get-tracks`]: {
    get: {
      operationId: "Get tracks.",
      security: [{}],
      description: "Get all tracks.",
      requestBody: {
        description: "Id and code",
        required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/TrackId" } } },
      },
      tags: ["API pública"],
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
  [`${API}/get-track`]: {
    get: {
      operationId: "Get track.",
      security: [{}],
      description: "Get all track.",
      tags: ["API pública"],
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
      tags: ["API pública"],
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
      tags: ["API pública"],
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
      tags: ["API pública"],
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
    get: {
      operationId: "Get playlist.",
      security: [{}],
      description: "Get all playlist.",
      requestBody: {
        description: "Id and code",
        required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/PlaylistId" } } },
      },
      tags: ["API pública"],
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
    get: {
      operationId: "Get playlists.",
      security: [{}],
      description: "Get all playlists.",
      tags: ["API pública"],
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
