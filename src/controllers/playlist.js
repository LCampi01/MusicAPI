const CrudController = require("./crud");
const { PlaylistServices: service } = include("services");

const logger = require("../helpers/logger");

class PlaylistController extends CrudController {
  constructor() {
    super(service);
    this.createPlaylist = this.createPlaylist.bind(this);
    this.deletePlaylist = this.deletePlaylist.bind(this);
    this.modifyPlaylist = this.modifyPlaylist.bind(this);
    this.getPlaylists = this.getPlaylists.bind(this);
    this.getPlaylist = this.getPlaylist.bind(this);
  }

  async createPlaylist(req, res) {
    try {
      const result = await this._service.createPlaylist(req.body);
      res.send(result);
    } catch (err) {
      logger.error(err);
    }
  }

  async deletePlaylist(req, res) {
    try {
      const result = await this._service.deletePlaylist(req.body);
      res.send(result);
    } catch (err) {
      logger.error(err);
    }
  }

  async modifyPlaylist(req, res) {
    try {
      const result = await this._service.modifyPlaylist(req.body);
      res.send(result);
    } catch (err) {
      logger.error(err);
    }
  }

  async getPlaylists(req, res) {
    try {
      const result = await this._service.getPlaylists();
      res.send(result);
    } catch (err) {
      logger.error(err);
    }
  }

  async getPlaylist(req, res) {
    try {
      const result = await this._service.modifyPlaylist(req.body);
      res.send(result);
    } catch (err) {
      logger.error(err);
    }
  }
}

module.exports = new PlaylistController();
