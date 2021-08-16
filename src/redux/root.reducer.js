import {combineReducers} from 'redux';
import {persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from './user/user.reducer';
import templatesReducer from './template/template.reducer';
import awsReducer from './aws/aws.reducer';
import navigationReducer from './naviagtor/navigator.reducer';
import dictionaryReducer from './customDictionary/dictionary.reducer';
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user', 'templates', 'awsSetting', 'navigation', 'dictionary']
}

const rootReducer = combineReducers({
    user: userReducer,
    templates: templatesReducer,
    awsSetting: awsReducer,
    navigation: navigationReducer,
    dictionary: dictionaryReducer
});
export default persistReducer(persistConfig, rootReducer);