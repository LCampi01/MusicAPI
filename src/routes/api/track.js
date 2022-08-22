const { TrackController } = include("controllers");

module.exports = (router) => {
  router.post("/create-track", (req, res) => TrackController.createTrack(req, res));
  router.delete("/delete-track", (req, res) => TrackController.deleteTrack(req, res));
  router.put("/modify-track", (req, res) => TrackController.modifyTrack(req, res));
  router.get("/get-tracks", (req, res) => TrackController.getTracks(req, res));
  router.get("/get-track", (req, res) => TrackController.getTrack(req, res));
  return router;
};
