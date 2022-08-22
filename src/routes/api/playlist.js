const { PlaylistController } = include("controllers");

module.exports = (router) => {
  router.post("/create-playlist", (req, res) => PlaylistController.createPlaylist(req, res));
  router.delete("/delete-playlist", (req, res) => PlaylistController.deletePlaylist(req, res));
  router.put("/modify-playlist", (req, res) => PlaylistController.modifyPlaylist(req, res));
  router.get("/get-playlists", (req, res) => PlaylistController.getPlaylists(req, res));
  router.get("/get-playlist", (req, res) => PlaylistController.getPlaylist(req, res));
  return router;
};
