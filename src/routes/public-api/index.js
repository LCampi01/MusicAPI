const { TrackController } = include("controllers");

module.exports = (router) => {
  router.get("/generate-token", (req, res) => TrackController.generateToken(req, res));
  return router;
};
