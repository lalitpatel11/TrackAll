//external imports
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  NativeModules
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import React, {useEffect, useRef, useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
//internal imports
import CommonToast from '../../constants/CommonToast';
import Header from '../../constants/Header';
import SubmitButton from '../../constants/SubmitButton';
import UserAuthService from '../../service/UserAuthService';
import {colors} from '../../constants/ColorConstant';

const SignInOtp = (props: any) => {
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState(false);
  const [loader, setLoader] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [otp, setOtp] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const toastRef = useRef<any>();
  const [timerCount, setTimerCount] = useState(30);
  const [timeInterval, setTimeInterval] = useState(null);
  const [clear, setClear] = useState(false);

  useEffect(() => {
    getUserData();
    getTimer();
  }, []);

  // show timer
  const getTimer = () => {
    setTimerCount(30);
    if (timeInterval) {
      clearInterval(timeInterval);
      // setTimerCount(updatedData.timer);
    }
    let interval: any = setInterval(() => {
      setTimerCount(lastTimerCount => {
        lastTimerCount == 1 && clearInterval(interval);
        return lastTimerCount - 1;
      });
    }, 1000);
    setTimeInterval(interval);

    return () => {
      if (timeInterval) {
        clearInterval(timeInterval);
      }
    };
  };

  // function for get user details
  const getUserData = async () => {
    setOtp(props?.route?.params?.otp);
    setUserEmail(props?.route?.params?.email);
  };

  // navigation on back arrow click
  const handleBackClick = () => {
    props.navigation.navigate('StackNavigation', {
      screen: 'SignIn',
    });
  };

  // function for submit button click on api call to resend opt
  const handleResendOtp = async () => {
    setCode('');
    setClear(true);
    setLoader(true);
    getTimer();
    const data = {
      email: userEmail,
    };
    UserAuthService.signInOtp(data)
      .then((response: any) => {
        setLoader(false);
        if (response.data.status === 1) {
          setOtp(response.data.otp);
          toastRef.current.getToast(response.data.message, 'success');
        } else if (response.data.status === 0) {
          toastRef.current.getToast(response.data.message, 'warning');
        }
      })
      .catch((error: any) => {
        setLoader(false);
        console.log(error, 'error');
      });
  };

  // function for submit button click on api call to submit opt
  const handleSubmitButton = () => {
    if (code.length === 4) {
      setErrorMsg(false);
      setLoader(true);
      const data = {
        email: userEmail,
        otp: code,
      };
      UserAuthService.signInVerifyOtp(data)
        .then((response: any) => {
          setLoader(false);
          if (response.data.status === 1) {
            // set user auth token  and user id for future use
            AsyncStorage.setItem('authToken', response?.data?.token);
            AsyncStorage.setItem('userId', response?.data?.userid);
            AsyncStorage.setItem('userType', response?.data?.usertype);
            AsyncStorage.setItem(
              'accountId',
              response?.data?.businessdetail?.businessid,
            );
            setModalVisible(true);
            toastRef.current.getToast(response.data.message, 'success');
          } else if (response.data.status === 0) {
            toastRef.current.getToast(response.data.message, 'warning');
          }
        })
        .catch((error: any) => {
          setLoader(false);
          console.log(error, 'error');
        });
    } else {
      setErrorMsg(true);
    }
  };

  // navigation after continue button click
  const handleContinueButton = () => {
    setModalVisible(false);
    setTimeout(() => {
      props.navigation.replace('DrawerNavigator', {
        screen: 'BottomTabNavigator',
      });
    }, 200);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {/* reusable header component  */}
      <Header
        headerText={'Go back'}
        backClick={handleBackClick}
        style={{marginTop: NativeModules?.StatusBarManager?.HEIGHT}}
      />

      {/* body section */}
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={styles.body}>
        <>
          <View style={styles.backContainer}>
            <View style={styles.bannerImageContainer}>
              <Image
                resizeMode="contain"
                style={styles.bannerImage}
                source={require('../../assets/pngImage/otpBanner.png')}
              />
            </View>

            <View style={styles.instructionContainer}>
              <Text style={styles.instructionText}>
                Verification code has been sent {'\n'}to your mail id
                successfully.
              </Text>
              <Text style={{...styles.instructionText, ...styles.note}}>
                Note : If you don’t receive the email, please check your spam
                folder.
              </Text>
            </View>

            <View style={styles.emailContainer}>
              <Text style={styles.emailText}>
                {userEmail}
                {/* {otp} */}
              </Text>

              {timerCount == 0 ? (
                <TouchableOpacity
                  style={styles.resendCodeContainer}
                  onPress={() => {
                    handleResendOtp();
                  }}>
                  <Text style={styles.resendCodeText}>
                    Resend Verification Code
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.timerContainer}>
                  <Text style={styles.timerText}>{timerCount}</Text>
                </View>
              )}
            </View>

            {/* Otp library */}
            <View style={styles.otpContainer}>
              <OTPInputView
                pinCount={4}
                autoFocusOnLoad
                codeInputFieldStyle={styles.otpInputField}
                onCodeChanged={item => {
                  setCode(item);
                  setClear(false);
                }}
                clearInputs={clear}
              />
            </View>

            <View style={styles.errorMessageContainer}>
              {errorMsg ? (
                <Text style={styles.errorMessage}>
                  Please enter Verification code
                </Text>
              ) : null}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <SubmitButton
              loader={loader}
              submitButton={handleSubmitButton}
              buttonText={'Validate Verification Code'}
            />
          </View>

          <View style={styles.signInContainer}>
            <Text style={styles.signInOne}>Don't have an account</Text>
            <TouchableOpacity
              style={styles.signInClick}
              onPress={() => {
                props.navigation.navigate('SignUp');
              }}>
              <Text style={styles.signInOne}>Sign Up?</Text>
            </TouchableOpacity>
          </View>
        </>
      </KeyboardAwareScrollView>

      {/* modal for successfully verification  */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View>
              <Image
                resizeMode="contain"
                style={styles.successImage}
                source={require('../../assets/pngImage/otpChecked.png')}
              />
              <Text style={styles.successText}>
                Verification code verified{'\n'}successfully
              </Text>

              {/* button section */}
              <SubmitButton
                loader={loader}
                submitButton={() => handleContinueButton()}
                buttonText={'Continue'}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* toaster message for error response from API  */}
      <CommonToast ref={toastRef} />
    </KeyboardAvoidingView>
  );
};

export default SignInOtp;
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
    padding: 5,
  },
  body: {
    marginTop: 40,
    flex: 1,
  },
  backContainer: {
    backgroundColor: colors.BLACK2,
    borderRadius: 15,
    height: 460,
    marginTop: 80,
    opacity: 29,
  },
  bannerImageContainer: {
    alignSelf: 'center',
    height: 244,
    justifyContent: 'center',
    position: 'absolute',
    top: -90,
    width: 267,
    zIndex: 1,
  },
  bannerImage: {
    height: 220,
    width: 250,
  },
  instructionContainer: {marginTop: 180},
  instructionText: {
    color: colors.WHITE,
    fontSize: 20,
    fontWeight: '500',
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  note: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: '400',
  },
  errorMessageContainer: {
    alignSelf: 'center',
    bottom: 10,
    height: 20,
    justifyContent: 'center',
    marginTop: 10,
    width: '70%',
  },
  errorMessage: {
    color: colors.RED,
  },
  emailContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  emailText: {
    color: colors.WHITE,
    fontSize: 16,
    textAlign: 'center',
  },
  timerContainer: {
    height: 30,
    width: 30,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.THEME_ORANGE,
    borderStyle: 'solid',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  timerText: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
    textAlign: 'center',
  },
  resendCodeContainer: {
    alignSelf: 'center',
    width: 'auto',
  },
  resendCodeText: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: 'bold',
    padding: 5,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  otpContainer: {
    alignSelf: 'center',
    height: '15%',
    marginTop: 20,
    paddingHorizontal: '15%',
  },
  otpInputField: {
    backgroundColor: colors.BLACK3,
    borderBottomWidth: 1,
    borderRadius: 30,
    color: colors.WHITE,
    fontSize: 25,
    height: 53,
    marginHorizontal: 8,
    textAlign: 'center',
    width: 67,
  },
  buttonContainer: {marginTop: 40},
  signInContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    paddingVertical: 5,
  },
  signInClick: {height: 30},
  signInOne: {
    color: colors.WHITE,
    fontSize: 15,
    marginLeft: 5,
    paddingVertical: 5,
    textAlign: 'center',
  },
  centeredView: {
    backgroundColor: 'rgba(0, 0, 0, 0.66)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalView: {
    backgroundColor: colors.BLACK3,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  successImage: {
    alignSelf: 'center',
    height: 50,
    width: 55,
  },
  successText: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '500',
    paddingBottom: 30,
    paddingTop: 5,
    textAlign: 'center',
  },
});
