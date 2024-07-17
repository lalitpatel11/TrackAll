// external imports
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Formik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// internal imports
import CommonToast from '../../constants/CommonToast';
import CustomHeader from '../../constants/CustomHeader';
import SubmitButton from '../../constants/SubmitButton';
import {colors} from '../../constants/ColorConstant';
import {createServiceValidation} from '../../constants/SchemaValidation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BusinessService from '../../service/BusinessService';

const CreateService = ({navigation, route}: {navigation: any; route: any}) => {
  // const [businessId, setBusinessId] = useState(route?.params?.id);
  const [buttonLoader, setButtonLoader] = useState(false);
  const toastRef = useRef<any>();

  useEffect(() => {
    // setBusinessId(route?.params?.id);
  }, []);

  //  function for notes submit button click
  const onSubmit = async (values: any) => {
    const accountId = await AsyncStorage.getItem('accountId');

    setButtonLoader(true);

    const feedBackData = new FormData();
    feedBackData.append('accountId', accountId);
    feedBackData.append('servicename', values.serviceName);
    feedBackData.append('totaltime', values.timeInMinute);

    BusinessService.postAddBusinessService(feedBackData)
      .then((response: any) => {
        setButtonLoader(false);
        toastRef.current.getToast(response.data.message, 'success');
        // navigation.replace('StackNavigation', {
        //   screen: 'BusinessDetailsPage',
        //   params: {
        //     id: businessId,
        //   },
        // });
        navigation.goBack();
      })
      .catch((error: any) => {
        setButtonLoader(false);
        console.log(error);
      });
  };

  const initialValues = {
    serviceName: '',
    timeInMinute: '',
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Create Service'}
        backButton={{
          visible: true,
          onClick: () => {
            navigation.goBack();
          },
        }}
      />
      {/* body section  */}
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={styles.body}>
        <Formik
          validationSchema={createServiceValidation}
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
            <View style={styles.body}>
              {/*service name section  */}
              <View>
                <TextInput
                  placeholder="Service name"
                  placeholderTextColor={colors.WHITE}
                  style={styles.textInput}
                  value={values.serviceName}
                  onChangeText={handleChange('serviceName')}
                  onBlur={() => {
                    handleBlur('serviceName');
                    setFieldTouched('serviceName');
                  }}
                />
                <Text style={styles.errorMessage}>
                  {touched.serviceName && errors.serviceName}
                </Text>
              </View>

              {/* time in minute section  */}
              <View>
                <TextInput
                  placeholder="Total time in minute"
                  placeholderTextColor={colors.WHITE}
                  style={styles.textInput}
                  value={values.timeInMinute}
                  onChangeText={handleChange('timeInMinute')}
                  onBlur={() => {
                    handleBlur('timeInMinute');
                    setFieldTouched('timeInMinute');
                  }}
                />
                <Text style={styles.errorMessage}>
                  {touched.timeInMinute && errors.timeInMinute}
                </Text>
              </View>

              {/* save group button  */}
              <SubmitButton
                buttonText={'Submit'}
                submitButton={handleSubmit}
                loader={buttonLoader}
              />

              {/* toaster message for error response from API  */}
              <CommonToast ref={toastRef} />
            </View>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateService;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {
    flex: 1,
    padding: 10,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  textInput: {
    backgroundColor: colors.BLACK3,
    borderRadius: 10,
    color: colors.WHITE,
    fontSize: 16,
    padding: 15,
  },
  errorMessage: {
    color: colors.RED,
    paddingHorizontal: 10,
  },
});
