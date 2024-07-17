import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useRef, useState} from 'react';
import {Formik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
//internal imports
import CommonToast from '../../constants/CommonToast';
import SubmitButton from '../../constants/SubmitButton';
import UserAuthService from '../../service/UserAuthService';
import {colors} from '../../constants/ColorConstant';
import {signUpValidation} from '../../constants/SchemaValidation';

const SignUp = ({navigation}: {navigation: any}) => {
  const [loader, setLoader] = useState(false);
  const toastRef = useRef<any>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {});
    return unsubscribe;
  }, [navigation]);

  // function for submit button click on api call to sign up opt
  const onSubmit = async (values: any) => {
    let fcmToken: any = await AsyncStorage.getItem('fcmToken');

    const data = {
      email: values.email,
      fcmtoken: fcmToken,
    };
    setLoader(true);
    UserAuthService.signUpOtp(data)
      .then((response: any) => {
        setLoader(false);
        if (response.data.status === 1) {
          navigation.navigate('StackNavigation', {
            screen: 'SignUpOtp',
            params: {otp: response.data.otp, email: values.email},
          });
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

  const initialValues = {
    email: '',
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {/* body section */}
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={styles.body}>
        <Formik
          validationSchema={signUpValidation}
          initialValues={initialValues}
          onSubmit={values => {
            onSubmit(values);
          }}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldTouched,
          }) => (
            <>
              <View style={styles.backContainer}>
                <View style={styles.bannerImageContainer}>
                  <Image
                    resizeMode="contain"
                    style={styles.bannerImage}
                    source={require('../../assets/pngImage/signUpBanner.png')}
                  />
                </View>

                <View style={styles.instructionContainer}>
                  <Text style={styles.instructionText}>
                    Create a Track All account {'\n'}So that we remind you!
                  </Text>
                </View>

                <View style={styles.emailContainer}>
                  <Text style={styles.emailText}>Email Id</Text>

                  <TextInput
                    style={styles.emailInput}
                    placeholder="Enter Email Id"
                    placeholderTextColor={colors.textGray}
                    onChangeText={handleChange('email')}
                    onBlur={() => {
                      handleBlur('email');
                      setFieldTouched('email');
                    }}
                    value={values.email.trim()}
                  />

                  <Text style={styles.errorMessage}>
                    {touched.email && errors.email}
                  </Text>
                </View>
              </View>

              {/* button with loader  */}
              <View style={styles.buttonContainer}>
                <SubmitButton
                  submitButton={handleSubmit}
                  buttonText={'Get Verification Code'}
                  loader={loader}
                />
              </View>

              <View style={styles.signInContainer}>
                <Text style={styles.signInOne}>Already have an account</Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('StackNavigation', {
                      screen: 'SignIn',
                    });
                  }}>
                  <Text style={styles.signInOne}>Sign In?</Text>
                </TouchableOpacity>
              </View>

              {/* toaster message for error response from API  */}
              <CommonToast ref={toastRef} />
            </>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
    padding: 10,
  },
  body: {
    flex: 1,
    marginTop: 40,
  },
  backContainer: {
    backgroundColor: colors.BLACK2,
    borderRadius: 15,
    height: 380,
    marginTop: 130,
    opacity: 29,
  },
  bannerImageContainer: {
    alignSelf: 'center',
    height: 212,
    justifyContent: 'center',
    position: 'absolute',
    top: -90,
    width: 263,
    zIndex: 1,
  },
  bannerImage: {
    height: '100%',
    width: '100%',
  },
  instructionContainer: {
    marginTop: 150,
  },
  instructionText: {
    color: colors.WHITE,
    fontSize: 22,
    padding: 20,
  },
  emailContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  emailText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
  },
  emailInput: {
    borderBottomColor: colors.THEME_BLACK,
    borderBottomWidth: 2,
    color: colors.WHITE,
    height: 55,
    marginTop: 10,
    paddingLeft: 10,
  },
  buttonContainer: {marginTop: 40},
  signInContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    marginVertical: 20,
    paddingVertical: 5,
  },
  signInOne: {
    color: colors.WHITE,
    fontSize: 15,
    marginLeft: 5,
    paddingVertical: 5,
    textAlign: 'center',
  },
  errorMessage: {
    color: colors.RED,
  },
});
