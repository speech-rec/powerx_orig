import ACTIONTYPE from './dictionary.type';
const initialState = {
    allKeyWords: [],
    punctuationKeywords: []
};

const dictionaryReducer = (state = initialState, action) => {
    switch(action.type){
        case ACTIONTYPE.SET_DICTIONARY:
            return{
                ...state,
                allKeyWords: action.payload
            }
            case ACTIONTYPE.SET_PUNCTUATION_KEYWORDS:
                return{
                    ...state,
                    punctuationKeywords: action.payload
                }
        default:
            return state;

    }
};

export default dictionaryReducer;