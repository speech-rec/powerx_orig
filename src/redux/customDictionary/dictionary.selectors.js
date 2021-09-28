import { createSelector } from 'reselect';

export const selectDictionary = state => state.dictionary;

export const selectAllKeyWords = createSelector(
    [selectDictionary],
    dictionary => dictionary.allKeyWords
);

export const selectPunctuationKeywords = createSelector(
    [selectDictionary],
    dictionary => dictionary.punctuationKeywords
);
