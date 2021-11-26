const initialState = {
    currentUser: null,
    userCredential: null
}

const userReducer = (state = initialState, action) => {
    switch(action.type){
        case 'setCurrentUser':
            return{
                ...state,
                currentUser: action.payload
            }
            case 'setUserCredential':
            return{
                ...state,
                userCredential: action.payload
            }
        default:
            return state;

    }
};

export default userReducer;