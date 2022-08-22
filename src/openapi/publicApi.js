const API = "/public-api";

module.exports = {
  [`${API}/generate-token`]: {
    post: {
      operationId: "Generate token.",
      security: [{}],
      description: "Generate token.",
      requestBody: {
        description: "Code is required.",
        required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/Token" } } },
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
};
