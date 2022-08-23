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
    this.addTracks = this.addTracks.bind(this);
  }

  async createPlaylist(req, res) {
    try {
      const result = await this._service.createPlaylist(req.body);
      res.send(result);
    } catch (err) {
      logger.error(err);
      console.log(err);
    }
  }

  async deletePlaylist(req, res) {
    try {
      const result = await this._service.deletePlaylist(req.body);
      res.send(result);
    } catch (err) {
      logger.error(err);
      console.log(err);
    }
  }

  async modifyPlaylist(req, res) {
    try {
      const result = await this._service.modifyPlaylist(req.body);
      res.send(result);
    } catch (err) {
      logger.error(err);
      console.log(err);
    }
  }

  async getPlaylists(req, res) {
    try {
      const result = await this._service.getPlaylists(req.body);
      res.send(result);
    } catch (err) {
      logger.error(err);
      console.log(err);
    }
  }

  async getPlaylist(req, res) {
    try {
      const result = await this._service.modifyPlaylist(req.body);
      res.send(result);
    } catch (err) {
      logger.error(err);
      console.log(err);
    }
  }

  async addTracks(req, res) {
    try {
      const result = await this._service.addTracks(req.body);
      res.send(result);
    } catch (err) {
      logger.error(err);
      console.log(err);
    }
  }
}

module.exports = new PlaylistController();
