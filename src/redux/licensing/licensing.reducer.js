import ACTIONTYPE from './licensing.type';
const initialState = {
    allPackages: [],
    userAllPackages: null,
    licenseData: null,
};

const licenseReducer = (state = initialState, action) => {
    switch(action.type){
        case ACTIONTYPE.SET_PACKAGES:
            return{
                ...state,
                allPackages: action.payload
            }
            case ACTIONTYPE.SET_USER_PACKAGES:
                return{
                    ...state,
                    userAllPackages: action.payload
                }
                case ACTIONTYPE.SET_USER_LICENSE_DATA:
                    return{
                        ...state,
                        licenseData: action.payload
                    }    
        default:
            return state;

    }
};

export default licenseReducer;