const { request } = require("..");

describe("/api/track/create-track", () => {
  const fakeToken = "fake-token";
  const TestToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiTXVzaWNBUEkiLCJpYXQiOjE2NjEyNjM4NDQsImV4cCI6MTY5Mjc5OTg0NH0.romjQO7OYjSqcmXgacWnw2OtZU4DQiaWNaqcZM3ibSY";

  const failBody = {
    token: fakeToken,
    name: "John",
    album: "TestedAlbum",
    artist: "Johnny Test",
    duration: "134h",
    artwork: "string",
    audio: "string",
  };

  const failFetch = {
    token: TestToken,
    id: "invalid_id",
    code: "invalid_code",
  };

  it("should fail saving track using invalid token", async () => {
    request
      .post("/api/track/create-track")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send(failBody)
      .expect(200)
      .end((_err, res) => {
        res.body.should.be.deepEqual({ error: "jwt malformed" });
        return failBody;
      });
  });

  it("should fail fetching tracks using valid token and invalid _id or code", async () => {
    request
      .post("/api/track/get-track")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send(failFetch)
      .expect(200)
      .end((_err, res) => {
        res.body.should.be.deepEqual({ error: "jwt malformed" });
        return failFetch;
      });
  });
});
