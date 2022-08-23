const API = "/api/track";

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
      tags: ["Track"],
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
      tags: ["Track"],
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
      tags: ["Track"],
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
    post: {
      operationId: "Get tracks.",
      security: [{}],
      description: "Get all tracks.",
      tags: ["Track"],
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
    post: {
      operationId: "Get track.",
      security: [{}],
      description: "Get all track.",
      tags: ["Track"],
      requestBody: {
        description: "All fields are required.",
        required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/TrackId" } } },
      },
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
};
