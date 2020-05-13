const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firestore);

// On sign up.
exports.processSignUp = functions.auth.user().onCreate((user: any) => {
  const customClaims = {
    'https://hasura.io/jwt/claims': {
      'x-hasura-default-role': 'user',
      'x-hasura-allowed-roles': ['user'],
      'x-hasura-user-id': user.uid,
    },
  };

  return admin
    .auth()
    .setCustomUserClaims(user.uid, customClaims)
    .then(() => {
      // Update real-time database to notify client to force refresh.
      const userRef = admin.firestore().collection('users').doc(user.uid);
      // This will be captured on the client to force a token refresh.
      return userRef.update({ updatedAt: new Date() });
    })
    .catch((error: any) => {
      console.log(error);
    });
});
