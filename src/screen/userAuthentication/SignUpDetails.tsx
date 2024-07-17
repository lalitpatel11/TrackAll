//external imports
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useRef, useState} from 'react';
import {Formik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
//internal imports
import CommonToast from '../../constants/CommonToast';
import Interests from './Interests';
import SubmitButton from '../../constants/SubmitButton';
import UserAuthService from '../../service/UserAuthService';
import UserEmailAvailableModal from '../introPages/UserEmailAvailableModal';
import {colors} from '../../constants/ColorConstant';
import {nameValidation} from '../../constants/SchemaValidation';

const SignUpDetails = ({navigation, route}: {navigation: any; route: any}) => {
  const [arrayList, setArrayList] = useState<any[]>([]);
  const [checked, setChecked] = useState(false);
  const [err, setErr] = useState(false);
  const [loader, setLoader] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [preferenceList, setPreferenceList] = useState<any[]>([]);
  const [userEmailCheck, setUserEmailCheck] = useState(false);
  const toastRef = useRef<any>();

  useEffect(() => {
    setPageLoader(true);

    if (route?.params?.data == 'FBLOGIN') {
      setUserEmailCheck(true);
    } else {
      setUserEmailCheck(false);
    }

    // api call to get preference list
    UserAuthService.preferenceList()
      .then((response: any) => {
        setPageLoader(false);
        setPreferenceList(response.data.preferences);
      })
      .catch((error: any) => {
        setPageLoader(false);
      });
  }, []);

  // list for interest tab
  const renderInterestItem = ({item}: {item: any; index: any}) => {
    return (
      <Interests
        interests={item}
        handleChecked={handleChecked}
        checked={checked}
        checkedList={arrayList}
      />
    );
  };

  // function on select interest click
  const handleChecked = async (selectedId: number) => {
    setErr(false);
    setChecked(true);
    if (arrayList.includes(selectedId)) {
      setArrayList(arrayList.filter(ids => ids !== selectedId));
    } else {
      setArrayList([...arrayList, selectedId]);
    }
  };

  // navigation for back arrow click
  const handleBackClick = () => {
    navigation.navigate('StackNavigation', {
      screen: 'SignUp',
    });
  };

  // function for submit button click on api call to sign up
  const onSubmit = (values: any) => {
    // user name for future use
    AsyncStorage.setItem('usersName', values.name);

    if (arrayList.length >= 1) {
      setLoader(true);
      setErr(false);

      const data = new FormData();
      data.append('fullname', values.name);
      arrayList.map((e: number, index: any) => {
        data.append(`interests[${index}]`, e);
      });

      UserAuthService.signUpDetails(data)
        .then((response: any) => {
          setLoader(false);
          navigation.replace('DrawerNavigator', {
            screen: 'BottomNavigator',
          });
        })
        .catch((error: any) => {
          setLoader(false);
        });
    } else {
      setErr(true);
    }
  };

  const initialValues = {
    name: '',
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
          validationSchema={nameValidation}
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
            <View style={styles.container}>
              {!pageLoader ? (
                <>
                  <View style={styles.nameContainer}>
                    <Text style={styles.nameLabel}>What’s your full name?</Text>
                    <TextInput
                      style={styles.nameInput}
                      placeholder="John Doe"
                      placeholderTextColor={colors.textGray}
                      onChangeText={handleChange('name')}
                      onBlur={() => {
                        handleBlur('name');
                        setFieldTouched('name');
                      }}
                      value={values.name}
                    />
                    <Text style={styles.errorMessage}>
                      {touched.name && errors.name}
                    </Text>
                  </View>

                  <View>
                    <Text style={styles.nameLabel}>
                      Select your preferences
                    </Text>

                    <FlatList
                      data={preferenceList}
                      renderItem={renderInterestItem}
                      numColumns={3}
                      keyExtractor={(item: any, index: any) => String(index)}
                    />
                  </View>

                  {err ? (
                    <Text style={styles.errorText}>
                      Please select any preference.
                    </Text>
                  ) : (
                    <Text style={styles.errorText} />
                  )}

                  {/* button part  */}
                  <SubmitButton
                    loader={loader}
                    submitButton={handleSubmit}
                    buttonText={'Submit'}
                  />
                </>
              ) : (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color={colors.THEME_ORANGE} />
                </View>
              )}
            </View>
          )}
        </Formik>

        {/* modal for check user email id */}
        <UserEmailAvailableModal
          visibleModal={userEmailCheck}
          onClose={() => {
            setUserEmailCheck(false);
          }}
        />

        {/* toaster message for error response from API  */}
        <CommonToast ref={toastRef} />
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUpDetails;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {
    flex: 1,
    padding: 20,
  },
  nameContainer: {
    height: '20%',
    marginVertical: 10,
  },
  nameLabel: {
    color: colors.WHITE,
    fontSize: 22,
    paddingVertical: 15,
  },
  nameInput: {
    borderColor: colors.WHITE,
    borderRadius: 30,
    borderWidth: 1,
    color: colors.WHITE,
    height: 53,
    padding: 15,
  },
  loaderContainer: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  errorMessage: {
    color: colors.RED,
    padding: 10,
  },
  errorText: {
    color: colors.RED,
    padding: 5,
  },
});
