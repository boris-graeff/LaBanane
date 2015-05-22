/*
 * JSON API
 */

var db = require('../db');
var _ = require('lodash');


// Private functions

/**
 * Ask DB if playlist id is available
 * @param idPlaylist
 * @param callback
 */
var isPlaylistIdAvailable = function (idPlaylist, callback) {
  db.getPlaylist(idPlaylist, function (err, results) {
    callback(err, results === null);
  });
};

/**
 * Get playlist content by playlist from DB
 * @param idPlaylist
 * @param callback
 */
var getPlaylistContent = function (idPlaylist, callback) {

  db.getPlaylist(idPlaylist, function (err, result) {
    if (result) {
      var playlist = {
        content: result.content,
        password: result.password
      };
      callback(err, playlist);
    }
    else {
      callback(err);
    }
  });
};

// Services

exports.createPlaylist = function (req, res) {
  var playlist = req.body;

  isPlaylistIdAvailable(playlist.id, function (err, available) {

    if (err || !available) {
      res.json({
        error: true,
        available: false
      });
    }
    else {
      db.createPlaylist(playlist, function (err, result) {
        if (err) {
          res.json({
            error: true,
            available: false
          });
        }
        else {
          res.json({
            error: false
          });
        }

      });
    }
  });
};

/**
 * Check if playlist id is available
 * @param req
 * @param res
 * @return JSON object with status
 */
exports.isPlaylistIdAvailable = function (req, res) {
  var idPlaylist = req.params.name;

  isPlaylistIdAvailable(idPlaylist, function (err, available) {
    if (err) {
      res.json({
        error: true
      });
    }
    else {
      res.json({
        available: available
      });
    }
  });
};

/**
 * Get playlist content
 * @param req
 * @param res
 */
exports.getPlaylistContent = function (req, res) {
  var idPlaylist = req.params.id;
  var password = req.params.password;

  var data = {};

  getPlaylistContent(idPlaylist, function (err, playlist) {
    if (err || !playlist) {
      data.error = true;
      res.json(data);
    }
    else {
      data.playlist = playlist.content;
      data.auth = (playlist.password === password);
      res.json(data);
    }
  });
};

/**
 * Get all playlists
 * @param req
 * @param res
 */
exports.getAllPlaylists = function (req, res) {

  db.getAllPlaylists(function (err, playlists) {
    if (err) {
      res.json([]);
    }
    else {
      res.json(_.pluck(playlists, 'id'));
    }

  });
};