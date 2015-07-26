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
    if(! playlistName || ! PLAYLIST_ID_PATTERN.test(playlistName.toLowerCase()) || playlistName.length > 100) {
        res.status(400).send({error: "Invalid playlist id" });
    }
};

// Services

/**
 *
 * @param req
 * @param res
 */
exports.createPlaylist = function (req, res) {
    var playlist = req.body;

    if(playlist && playlist.password){
        var name = playlist.name;
        checkPlaylistId(res, name);

        playlist.id = name.toLowerCase();
        playlist.password = playlist.password.substring(0, 100);

        isPlaylistIdAvailable(playlist.id, function (err, available) {

            if (err) {
                res.status(500).send({ error: "Unexpected error :(" });
            }
            else if(!available){
                res.json({
                    available: false
                });
            }
            else {
                db.createPlaylist(playlist, function (err, result) {
                    if (err) {
                        res.status(500).send({ error: "Unexpected error :(" });
                    }
                    else {
                        res.json({
                            available: true
                        });
                    }

                });
            }
        });
    }
    else {
        res.status(400).send({error:'Check your param !'});
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
            res.status(500).send({ error: "Unexpected error :(" });
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

    checkPlaylistId(res, name);

    getPlaylistContent(name.toLowerCase(), function (err, playlist) {
        if (err) {
            res.status(500).send({ error: "Unexpected error :(" });
        }
        else if(! playlist){
            res.json({
                error : true,
                message : "Playlist doesn't exist"
            });
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
            res.status(500).send({ error: "Unexpected error :(" });
        }
        else {
            res.json(_.pluck(playlists, 'id'));
        }
    });
};
