import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Replace with your Web Client ID from the Firebase Console 
// (Go to Project Settings -> General, look for the 'Web SDK configuration')
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID,
});

export const signInWithGoogle = async () => {
  await GoogleSignin.hasPlayServices();
  const userInfo = await GoogleSignin.signIn();
  return userInfo;
};
