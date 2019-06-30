export const playlistReducer = (state = [], action) => {
    switch(action.type) {
        case 'ADD_PLAYLIST':
            // Post request using axios, then change state
            const playlists = fetch('/gen-playlist', {method: 'POST'});
            console.log(playlists);
            return [...state, playlists]
        case 'GET_PLAYLISTS':
            // Get request using axios
            break;
        default:
            return state
    }
}
