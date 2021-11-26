import {combineReducers} from 'redux';
import {persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from './user/user.reducer';
import templatesReducer from './template/template.reducer';
import awsReducer from './aws/aws.reducer';
import navigationReducer from './naviagtor/navigator.reducer';
import dictionaryReducer from './customDictionary/dictionary.reducer';
import licenseReducer from './licensing/licensing.reducer';
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user', 'templates', 'awsSetting', 'navigation', 'dictionary', 'license']
}

const appReducer = combineReducers({
    user: userReducer,
    templates: templatesReducer,
    awsSetting: awsReducer,
    navigation: navigationReducer,
    dictionary: dictionaryReducer,
    license: licenseReducer
});

const rootReducer = (state, action) => {
    if (action.type === 'USER_LOGOUT') {
        console.log("removing");
        storage.removeItem('persist:root')
      return appReducer(undefined, action)
    }
  
    return appReducer(state, action)
  }
export default persistReducer(persistConfig, rootReducer);