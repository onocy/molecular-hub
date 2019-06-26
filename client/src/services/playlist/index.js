const getPlaylists = async () => {
  const playlists = await fetch('/playlists');
  const result = await playlists.json();
  return ({
    playlists: result,
    playlistsTotal: result.length
  });
};

const newPlaylist = async () => {
  const playlists = await fetch('/playlist', {method: 'POST'});
  console.log(playlists);
};

module.exports = {
  newPlaylist, 
  getPlaylists
}