import NAVIGATION_PATH from './navigator.type';
export const setNavigationPath = path => ({
    type: NAVIGATION_PATH.SET_PATH,
    payload: path
});
