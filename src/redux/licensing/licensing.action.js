import ACTIONTYPE from './licensing.type';
export const setPackages = packages => ({
    type: ACTIONTYPE.SET_PACKAGES,
    payload: packages
});

export const setUserPackages = userPackages => ({
    type: ACTIONTYPE.SET_USER_PACKAGES,
    payload: userPackages
});

export const setUserLicenseData = licenseData => ({
    type: ACTIONTYPE.SET_USER_LICENSE_DATA,
    payload: licenseData
});
