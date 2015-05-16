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
                password: String,
                timestamp: Number,
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
     * Update playlist
     * @param playlist
     * @param callback
     */
    updatePlaylist: function (playlist, callback) {
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
        ref.Playlist.create(playlist, callback);
    }

};