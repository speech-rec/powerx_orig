import { createSelector } from 'reselect';

export const selectDictionary = state => state.dictionary;

export const selectAllKeyWords = createSelector(
    [selectDictionary],
    dictionary => dictionary.allKeyWords
);
