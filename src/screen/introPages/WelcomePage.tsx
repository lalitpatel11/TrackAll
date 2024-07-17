//external imports
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
// import auth from '@react-native-firebase/auth';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {
//   GoogleSignin,
//   statusCodes,
// } from '@react-native-google-signin/google-signin';
// import {
//   AccessToken,
//   AuthenticationToken,
//   LoginManager,
//   Profile,
// } from 'react-native-fbsdk-next';
// internal imports
// import UserAuthService from '../../service/UserAuthService';
import {colors} from '../../constants/ColorConstant';

const WelcomePage = ({navigation}: {navigation: any}) => {
  // const [userDetails, setUserDetails] = useState({});

  // GoogleSignin.configure({
  //   webClientId:
  //     '192187979399-hnu22dmrvpijqk9u2msfumdjmhjmoeh2.apps.googleusercontent.com',
  //   offlineAccess: false,
  // });

  // function for google login api call
  // const googleSignIn = async () => {
  //   try {
  //     const fcmToken: any = await AsyncStorage.getItem('fcmToken');

  //     await GoogleSignin.hasPlayServices();
  //     await GoogleSignin.signOut();
  //     const userInfo = await GoogleSignin.signIn();

  //     const credential = auth.GoogleAuthProvider.credential(
  //       userInfo.idToken,
  //       userInfo.accessToken,
  //     );
  //     await auth().signInWithCredential(credential);
  //     setUserDetails({userInfo});

  //     const loginData = {email: userInfo.user.email, fcmtoken: fcmToken};

  //     // api call for gmail social login
  //     UserAuthService.postGmailSocialLogin(loginData)
  //       .then((response: any) => {
  //         // set user auth token  and user id for future use
  //         AsyncStorage.setItem('authToken', response?.data?.token);
  //         if (response.data.registrationstatus == 1) {
  //           props.navigation.replace('DrawerNavigator', {
  //             screen: 'BottomNavigator',
  //           });
  //         } else {
  //           props.navigation.replace('StackNavigation', {
  //             screen: 'SignUpDetails',
  //           });
  //         }
  //       })
  //       .catch((error: any) => {
  //         console.log(error);
  //       });
  //   } catch (error: any) {
  //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //       // user cancelled the login flow
  //     } else if (error.code === statusCodes.IN_PROGRESS) {
  //       // operation (e.g. sign in) is in progress already
  //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //       // play services not available or outdated
  //     } else {
  //       // some other error happened
  //       console.log('error====', error);
  //     }
  //   }
  // };

  // function for facebook login api call
  // const fbSignIn = async () => {
  //   try {
  //     const fcmToken: any = await AsyncStorage.getItem('fcmToken');

  //     LoginManager.logInWithPermissions(['public_profile']).then(
  //       (result: any) => {
  //         if (result.isCancelled) {
  //           console.log('Login Cancelled ' + JSON.stringify(result));
  //         } else {
  //           console.log(
  //             'Login success with permissions: ' +
  //               result.grantedPermissions.toString(),
  //           );

  //           if (Platform.OS === 'ios') {
  //             AuthenticationToken.getAuthenticationTokenIOS().then(res => {
  //               console.log(res?.authenticationToken);
  //             });
  //           } else {
  //             AccessToken.getCurrentAccessToken().then(res => {
  //               console.log('access token', res?.accessToken.toString());

  //               Profile.getCurrentProfile().then((currentProfile: any) => {
  //                 const loginData = {
  //                   facebookuserid: currentProfile?.userID,
  //                   fcmtoken: fcmToken,
  //                 };

  //                 // api call for facebook social login
  //                 UserAuthService.postFbSocialLogin(loginData)
  //                   .then((response: any) => {
  //                     // set user auth token  and user id for future use
  //                     AsyncStorage.setItem('authToken', response?.data?.token);
  //                     if (response.data.registrationstatus == 1) {
  //                       props.navigation.replace('DrawerNavigator', {
  //                         screen: 'BottomNavigator',
  //                       });
  //                     } else {
  //                       props.navigation.replace('StackNavigation', {
  //                         screen: 'SignUpDetails',
  //                         params: {
  //                           data: 'FBLOGIN',
  //                         },
  //                       });
  //                     }
  //                   })
  //                   .catch((error: any) => {
  //                     console.log(error);
  //                   });
  //               });
  //             });
  //           }
  //         }
  //       },
  //     );
  //   } catch (error) {
  //     console.log('Login failed with error: ' + error);
  //   }
  // };

  return (
    <View style={styles.container}>
      {/* <Image
          resizeMode="contain"
        source={require('../../assets/pngImage/WelcomeBackground.png')}
      />
      <Image
        style={styles.position}
          resizeMode="contain"
        source={require('../../assets/pngImage/WelcomeBackground2.png')}
      /> */}
      <Image
        style={styles.logo}
        resizeMode="contain"
        source={require('../../assets/pngImage/logo.png')}
      />

      <View style={styles.signUpContainer}>
        {/* facebook signIn  */}
        {/* <TouchableOpacity
          style={styles.signInBox}
          onPress={() => {
            // fbSignIn();
          }}>
          <Image
              resizeMode="contain"
            source={require('../../assets/pngImage/facebook.png')}
          />
          <Text style={styles.signUpText}>Sign in with Facebook</Text>
        </TouchableOpacity> */}

        {/* apple signIn */}
        {/* {Platform.OS === 'ios' ? (
          <TouchableOpacity style={styles.signInBox}>
            <Image
                resizeMode="contain"
              source={require('../../assets/pngImage/Apple.png')}
            />
            <Text style={styles.signUpText}>Sign in with Apple</Text>
          </TouchableOpacity>
        ) : null} */}

        {/* Google signIn  */}
        {/* <TouchableOpacity
          style={styles.signInBox}
          onPress={() => {
            // googleSignIn();
          }}>
          <Image
              resizeMode="contain"
            source={require('../../assets/pngImage/Google.png')}
          />
          <Text style={styles.signUpText}>Sign in with Google</Text>
        </TouchableOpacity> */}

        {/* Email signIn  */}
        <TouchableOpacity
          style={styles.signInBox}
          onPress={() => {
            navigation.navigate('SignIn');
          }}>
          <Image
            resizeMode="contain"
            source={require('../../assets/pngImage/envelope.png')}
          />
          <Text style={styles.signUpText}>Sign in with Email</Text>
        </TouchableOpacity>

        <View style={styles.otherTextContainer}>
          <Text style={styles.otherTextOne}>Don’t have an account</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('StackNavigation', {
                screen: 'SignUpIntroPage',
              });
            }}>
            <Text style={styles.otherTextOne}> Sign Up?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default WelcomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BLACK,
  },
  logo: {
    alignSelf: 'center',
    height: 209,
    marginTop: '40%',
    position: 'absolute',
    width: 219,
  },
  signUpContainer: {
    alignSelf: 'center',
    bottom: 40,
    height: 'auto',
    paddingVertical: 5,
    position: 'absolute',
    width: '85%',
  },
  signInBox: {
    backgroundColor: colors.BLACK3,
    borderRadius: 8,
    flexDirection: 'row',
    height: 50,
    marginVertical: 6,
    paddingLeft: 70,
    paddingVertical: 10,
  },
  signUpText: {
    alignSelf: 'center',
    color: colors.WHITE,
    fontSize: 16,
    justifyContent: 'center',
    marginLeft: 15,
    paddingVertical: 3,
    textAlign: 'center',
  },
  otherTextContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    marginTop: 15,
  },
  otherTextOne: {
    color: colors.WHITE,
    textAlign: 'center',
    fontSize: 15,
  },
  position: {
    position: 'absolute',
  },
});
