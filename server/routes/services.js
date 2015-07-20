/*
 * JSON API
 */

var db = require('../db');
var _ = require('lodash');

var PLAYLIST_ID_PATTERN = /([a-z]|[0-9]|-)+/;

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

var checkPlaylistId = function(res, playlistName){
    if(! playlistName || ! PLAYLIST_ID_PATTERN.test(playlistName.toLowerCase())) {
        res.status(500).send({ error: "Invalid playlist id" });
    }
};

// Services

exports.createPlaylist = function (req, res) {
    var playlist = req.body;

    if(playlist && playlist.password){
        var name = playlist.name;
        checkPlaylistId(res, name);

        playlist.id = name.toLowerCase();

        isPlaylistIdAvailable(playlist.id, function (err, available) {

            if (err || !available) {
                res.status(500).send({ error: ":(" });
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
    }
    else {
        res.status(500).send({error:'Check your param'});
    }
};

/**
 * Check if playlist id is available
 * @param req
 * @param res
 * @return JSON object with status
 */
exports.isPlaylistIdAvailable = function (req, res) {
    var name = req.params.name;

    checkPlaylistId(res, name);

    isPlaylistIdAvailable(name.toLowerCase(), function (err, available) {
        if (err) {
            res.status(500).send({ error: ":(" });
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
    var name = req.params.name;
    var password = req.params.password;

    console.log("req.params");
    console.log(req.params);

    checkPlaylistId(res, name);

    getPlaylistContent(name.toLowerCase(), function (err, playlist) {
        if (err || !playlist) {
            res.status(404).send({ error: "Playlist doesn't exist !" });
        }
        else {
            res.json({
                playlist : playlist.content,
                auth : (playlist.password === password)
            });
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
