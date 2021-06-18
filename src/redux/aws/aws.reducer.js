import AwsSetting from './aws.type';
const initialState = {
    awsCurrentSetting: { 
        sampleRate: '16000',
        language: 'en-US',
        speciality: 'PRIMARYCARE'},
};

const awsReducer = (state = initialState, action) => {
    switch(action.type){
        case AwsSetting.SET_SETTINGS:
            return{
                ...state,
                awsCurrentSetting: action.payload
            }
        default:
            return state;

    }
};

export default awsReducer;