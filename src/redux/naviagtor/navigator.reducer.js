import NAVIGATION_TYPR from './navigator.type';

const initialState = {
    navigationPath: null,
};

const NavigationReducer = (state = initialState, action) => {
    switch(action.type){
        case NAVIGATION_TYPR.SET_PATH:
            return{
                ...state,
                navigationPath: action.payload
            }
        default:
            return state;

    }
};

export default NavigationReducer;