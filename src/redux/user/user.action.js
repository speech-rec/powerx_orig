export const setCurrentuser = user => ({
    type: 'setCurrentUser',
    payload: user
});

export const logoutUser = data => ({
    type: 'USER_LOGOUT',
    payload: data
});

export const setPreviousUserCredential = credential => ({
    type: 'setUserCredential',
    payload: credential
});