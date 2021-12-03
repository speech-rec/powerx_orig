import { createSelector } from 'reselect';

export const selectUser = state => state.user;

export const selectCurrentUser = createSelector(
    [selectUser],
    user => user.currentUser
);

export const selectUserCredential = createSelector(
    [selectUser],
    user => user.userCredential
);

export const selectReceiverEmail = createSelector(
    [selectUser],
    user => user.receiverEmail
);