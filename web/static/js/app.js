// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "deps/phoenix_html/web/static/js/phoenix_html"

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

import socket from "./socket"

var elmDiv = document.getElementById('elm-main'),
    elmApp = Elm.embed(Elm.SeatSaver, elmDiv, {seats: [], reserveSeat: 0});

let channel = socket.channel("seats:planner", {})
channel.join()
  .receive("ok", seats => { elmApp.ports.seats.send(seats); })
  .receive("error", resp => { console.log("Unable to join", resp) })

elmApp.ports.updateSeat.subscribe(function (seat) {
  var seatNo = seat.seatNo
  console.log('Requesting seat ' + seatNo)
  channel.push("request_seat", {seatNo: seatNo})
         .receive("error", payload => {
            console.log(payload.message);
         })
});

channel.on("occupied", payload => {
  console.log('occupied seat', payload);
  elmApp.ports.reserveSeat.send(payload.seatNo);
});
