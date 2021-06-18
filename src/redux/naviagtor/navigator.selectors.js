import { createSelector } from 'reselect';

export const selectPath = state => state.navigation;

export const selectPreviousPath = createSelector(
    [selectPath],
    paths => paths.navigationPath
);