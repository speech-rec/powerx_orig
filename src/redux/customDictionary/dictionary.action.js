import ACTIONTYPE from './dictionary.type';
export const setDictionary = keyWords => ({
    type: ACTIONTYPE.SET_DICTIONARY,
    payload: keyWords
});

export const setPunctuationKeyWords = keyWords => ({
    type: ACTIONTYPE.SET_PUNCTUATION_KEYWORDS,
    payload: keyWords
});
