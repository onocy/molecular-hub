export const newPlaylist = async () => {
    const playlists = await fetch('/playlist', {method: 'POST'});
    console.log(playlists);
  };