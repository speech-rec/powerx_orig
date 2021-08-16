import ACTIONTYPE from './dictionary.type';
const initialState = {
    allKeyWords: []
};

const dictionaryReducer = (state = initialState, action) => {
    switch(action.type){
        case ACTIONTYPE.SET_DICTIONARY:
            return{
                ...state,
                allKeyWords: action.payload
            }
        default:
            return state;

    }
};

export default dictionaryReducer;