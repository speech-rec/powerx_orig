import { createSelector } from 'reselect';

export const selectLicense = state => state.license;

export const selectAllPackages = createSelector(
    [selectLicense],
    license => license.allPackages
);

export const selectUserAllPackages = createSelector(
    [selectLicense],
    license => license.userAllPackages
);

export const selectUserLicenseData = createSelector(
    [selectLicense],
    license => license.licenseData
);
