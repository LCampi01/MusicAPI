const API = "/public-api";

module.exports = {
  [`${API}/generate-token`]: {
    get: {
      operationId: "Generate token.",
      security: [{}],
      description: "Generate token.",
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
};
