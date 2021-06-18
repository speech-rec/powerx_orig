import { createSelector } from 'reselect';

export const selectSetting = state => state.awsSetting;

export const selectCurrentSetting = createSelector(
    [selectSetting],
    settings => settings.awsCurrentSetting
);

