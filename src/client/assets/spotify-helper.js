
export default function () {

  function getCookie(name) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
  }

  function getTailOfURI(uri) {
    const pieces = uri.split(':');
    return pieces[pieces.length - 1];
  }

  /*

    generatePlaylistArray(uri, cb)
    ==============================

    @uri  {string}   - should be a spotify playlist uri copied directly form spotify
                       (example: spotify:user:landendanyluk:playlist:3hCn8UBhxjyVmmC1X9t1kC).
    @cb   {function} - a function to call after the data has been fetched.

  */

  function generatePlaylistArray(uri, roomName, cb) {
    fetch(`https://api.spotify.com/v1/playlists/${getTailOfURI(uri)}/tracks?fields=items(track.uri%2Ctrack.duration_ms)`,
      {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + getCookie('access_token'),
          "Content-Type": "application/json"
        }
      }).then(res => res.json())
      .then((playlist) => {
        console.log(playlist);
        cb(roomName, playlist.items.map(trackObj => trackObj.track))
      })
      .catch((err) => {console.log('Error Mapping:', err)});
  }

/*

  playSong(song)
  ==============================

  @song     {object}   - same song object that is passed into `staged` and `playing` in state.
  @deviceId {string}   - deviceID to play song on (set equal to the ID of the connnect.to Spotify Connect player).
  @cb       {function} - (optional) callback function with no arguments (for logging purposes).

*/



   function play_Song(song) {
     const deviceId = "6H6S0juPYrUnOuCygmD0k6";
      const parsedSong = JSON.parse(song);
      if (parsedSong) playSong(parsedSong, deviceId);
   }

   function playSong(song, deviceId, cb = () => null) {
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
      {
        method: "PUT",
        body: JSON.stringify({"uris": [song.uri], "position_ms": Date.now() - song.startTime}),
        headers: {"Authorization": "Bearer " + getCookie('access_token'),
                "Content-Type": "application/json"}
    }).then( cb())
  }

  return {
    generatePlaylistArray,
    play_Song,
    getCookie
  }
}

