var mongoose = require('mongoose');

var db = mongoose.connection;
var ref = {};

/**
 * Mongo DB module
 * @type {{init: Function, getPlaylist: Function, updatePlaylist: Function, createPlaylist: Function}}
 */
module.exports = {

    /**
     * Connection to mongo DB
     */
    init: function () {
        var Schema = mongoose.Schema;
        db.on('error', console.error);
        db.once('open', function () {

            var playlistSchema = new Schema({
                id: String,
                name: String,
                password: String,
                timestamp: Number,
                artwork: String,
                content: Array
            });

            ref.Playlist = mongoose.model('Playlist', playlistSchema);
        });

        mongoose.connect('mongodb://localhost/LaBanane');
    },

    /**
     * Get playlist by id
     * @param idPlaylist
     * @param callback
     */
    getPlaylist: function (idPlaylist, callback) {
        ref.Playlist.findOne({
            id: idPlaylist
        }, callback);
    },

    /**
     * Get all playlists and sort them by
     * @param idPlaylist
     * @param callback
     */
    getAllPlaylists: function (callback) {
        ref.Playlist.find({}, {}, {
            sort: {
                timestamp : 'desc'
            }
        }, callback);
    },

    /**
     * Update playlist
     * @param playlist
     * @param callback
     */
    updatePlaylist: function (playlist, callback) {
        playlist.timestamp = Date.now();

        ref.Playlist.update({
            id: playlist.id,
            password: playlist.password
        }, playlist, {
            upsert: false
        }, callback);
    },

    /**
     * Create playlist
     * @param playlist
     * @param callback
     */
    createPlaylist: function (playlist, callback) {
        playlist.timestamp = Date.now();

        ref.Playlist.create(playlist, callback);
    }

};