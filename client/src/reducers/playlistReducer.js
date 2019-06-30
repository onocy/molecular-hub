export const playlistReducer = (state = [], action) => {
    switch(action.type) {
        case 'ADD_PLAYLIST':
            return [...state, { displayInterval: 2000, name: 'newPlaylist', createdAt: new Date(), status: 'queued' }]
        default:
            return state
    }
}
