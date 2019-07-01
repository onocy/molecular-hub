import { combineReducers } from 'redux'


// function playlistReducer(state = {
//     isLoginSuccess: false,
//     isLoginPending: false,
//     loginError: null
// }, action) {
//     pass
//     switch (action.type) {
//         case SET_LOGIN_PENDING:
//             return Object.assign({}, state, {
//                 isLoginPending: action.isLoginPending
//             });

//         case SET_LOGIN_SUCCESS:
//             return Object.assign({}, state, {
//                 isLoginSuccess: action.isLoginSuccess
//             });

//         case SET_LOGIN_ERROR:
//             return Object.assign({}, state, {
//                 loginError: action.loginError
//             });

//         default:
//             return state;
//     }
// }

function authReducer(state = {
    isLoginSuccess: false,
    isLoginPending: false,
    loginError: null
}, action) {
    switch (action.type) {
        case 'test':
            console.log('reducer');
            break;
        default:
            return state;
    }
}

export default combineReducers({
    authReducer
})

