import AwsSetting from './aws.type';
export const setSetting = setting => ({
    type: AwsSetting.SET_SETTINGS,
    payload: setting
});