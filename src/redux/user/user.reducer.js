import USERACTIONTYPE from './user.type';
const initialState = {
    currentUser: null,
    userCredential: null,
    receiverEmail: null
}

const userReducer = (state = initialState, action) => {
    switch(action.type){
        case USERACTIONTYPE.SET_CURRENT_USER:
            return{
                ...state,
                currentUser: action.payload
            }
            case USERACTIONTYPE.SET_USER_CREDENTIAL:
            return{
                ...state,
                userCredential: action.payload
            }
            case USERACTIONTYPE.SET_RECEIVER_EMAIL:
            return{
                ...state,
                receiverEmail: action.payload
            }
        default:
            return state;

    }
};

export default userReducer;