import TEMPLATETYPE from './template.type';
import {getTemplateTextById} from './template.utils';
const initialState = {
    allTemplates: null,
    selectedTemplate: null
};

const templateReducer = (state = initialState, action) => {
    switch(action.type){
        case TEMPLATETYPE.SET_TEMPLATES:
            return{
                ...state,
                allTemplates: action.payload
            }
        case TEMPLATETYPE.SET_SELECTED_TEMPLATE:
            return{
                ...state,
                selectedTemplate: getTemplateTextById(state.allTemplates, action.payload)
            }

        default:
            return state;

    }
};

export default templateReducer;