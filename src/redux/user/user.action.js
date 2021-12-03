import USERACTIONTYPE from './user.type';

export const setCurrentuser = user => ({
    type: USERACTIONTYPE.SET_CURRENT_USER,
    payload: user
});

export const logoutUser = data => ({
    type: USERACTIONTYPE.USER_LOGOUT,
    payload: data
});

export const setPreviousUserCredential = credential => ({
    type: USERACTIONTYPE.SET_USER_CREDENTIAL,
    payload: credential
});

export const setReceiverEmail = email => ({
    type: USERACTIONTYPE.SET_RECEIVER_EMAIL,
    payload: email
});