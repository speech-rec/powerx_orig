import ACTIONTYPE from './dictionary.type';
export const setDictionary = keyWords => ({
    type: ACTIONTYPE.SET_DICTIONARY,
    payload: keyWords
});
