/*
 * Sockets
 */

var db = require('../db');

module.exports = function (socket) {

  socket.on('subscribe', function (data) {
    socket.join(data.room);
  });

  socket.on('unsubscribe', function (data) {
    socket.leave(data.room);
  });

  socket.on('message', function (data) {
    // socket.broadcast.to(data.room).emit(data.action, data.param);

    if (data.action === 'update') {
      if (data.param.playlist) {

        var playlist = {
          id: data.room.toLowerCase(),
          content: data.param.playlist,
          password: data.param.password
        };

        db.updatePlaylist(playlist, function (err, result) {
          if(err){
            console.log(err);
          }
        });
      }
    }
  });

};
