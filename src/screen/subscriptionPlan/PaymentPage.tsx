//external imports
import {
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import React, {useRef, useState} from 'react';
import {Formik} from 'formik';
//internal imports
import CommonToast from '../../constants/CommonToast';
import CustomHeader from '../../constants/CustomHeader';
import SubmitButton from '../../constants/SubmitButton';
import SubscriptionServices from '../../service/SubscriptionServices';
import {cardValidation} from '../../constants/SchemaValidation';
import {colors} from '../../constants/ColorConstant';

const PaymentPage = ({route, navigation}: {route: any; navigation: any}) => {
  const [loader, setLoader] = useState(false);
  const toastRef = useRef<any>();

  // function on pay button click on api call
  const onSubmit = async (values: any) => {
    Keyboard.dismiss();
    setLoader(true);

    const data = {
      plan_id: route?.params?.planId,
      cardnumber: values.cardNumber,
      exp_month: values.expMonth,
      exp_year: values.expYear,
      cvc: values.cvv,
    };

    SubscriptionServices.postNewSubscription(data)
      .then((response: any) => {
        setLoader(false);
        if (response.data.status === 1) {
          toastRef.current.getToast(response.data.message, 'success');
          navigation.navigate('Home');
        } else if (response.data.status === 0) {
          toastRef.current.getToast(response.data.message, 'warning');
        }
      })
      .catch((error: any) => {
        setLoader(false);
        console.log('error', JSON.stringify(error));
      });
  };

  const initialValues = {
    cardNumber: '',
    cvv: '',
    expMonth: '',
    expYear: '',
  };

  return (
    <View style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Payment'}
        backButton={{
          visible: true,
          onClick: () => {
            navigation.goBack();
          },
        }}
      />

      {/* body section */}
      <Formik
        validationSchema={cardValidation}
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
            <Text style={styles.subHeading}>
              Please fill your card details.
            </Text>

            <LinearGradient
              colors={['#F28520', '#F5BD35']}
              style={styles.cardContainer}>
              {/* card number  */}
              <Text style={styles.labelText}>Card number</Text>
              <TextInput
                keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                maxLength={16}
                style={styles.cardInput}
                placeholder="4242 4242 4242 4242"
                placeholderTextColor={colors.GRAY}
                onChangeText={handleChange('cardNumber')}
                onBlur={() => {
                  handleBlur('cardNumber');
                  setFieldTouched('cardNumber');
                }}
                value={values.cardNumber.trim()}
              />
              <Text style={styles.errorMessage}>
                {touched.cardNumber && errors.cardNumber}
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                {/* exp month section  */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={styles.labelText}>exp.</Text>
                  {/* exp month  */}
                  <TextInput
                    keyboardType={
                      Platform.OS === 'ios' ? 'number-pad' : 'numeric'
                    }
                    maxLength={2}
                    style={styles.cardInput}
                    placeholder="MM"
                    placeholderTextColor={colors.GRAY}
                    onChangeText={handleChange('expMonth')}
                    onBlur={() => {
                      handleBlur('expMonth');
                      setFieldTouched('expMonth');
                    }}
                    value={values.expMonth.trim()}
                  />
                  <Text
                    style={{
                      color: colors.WHITE,
                      fontSize: 28,
                      fontWeight: '500',
                    }}>
                    {' '}
                    /{' '}
                  </Text>

                  {/* exp year  */}
                  <TextInput
                    keyboardType={
                      Platform.OS === 'ios' ? 'number-pad' : 'numeric'
                    }
                    maxLength={2}
                    style={styles.cardInput}
                    placeholder="YY"
                    placeholderTextColor={colors.GRAY}
                    onChangeText={handleChange('expYear')}
                    onBlur={() => {
                      handleBlur('expYear');
                      setFieldTouched('expYear');
                    }}
                    value={values.expYear.trim()}
                  />
                </View>

                {/* cvv section  */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.labelText}>cvv</Text>

                  {/* cvv number  */}
                  <TextInput
                    keyboardType={
                      Platform.OS === 'ios' ? 'number-pad' : 'numeric'
                    }
                    maxLength={3}
                    style={styles.cardInput}
                    placeholder="555"
                    placeholderTextColor={colors.GRAY}
                    onChangeText={handleChange('cvv')}
                    onBlur={() => {
                      handleBlur('cvv');
                      setFieldTouched('cvv');
                    }}
                    value={values.cvv.trim()}
                  />
                </View>
              </View>

              {/* error section for all felid */}
              <Text style={styles.errorMessage}>
                {touched.expMonth && errors.expMonth}
                {touched.expYear && errors.expYear}
                {touched.cvv && errors.cvv}
              </Text>
            </LinearGradient>

            {/* submit button section  */}
            <View style={styles.buttonContainer}>
              <SubmitButton
                loader={loader}
                buttonText={'Pay'}
                submitButton={handleSubmit}
              />
            </View>
          </View>
        )}
      </Formik>

      {/* toaster message for error response from API  */}
      <CommonToast ref={toastRef} />
    </View>
  );
};

export default PaymentPage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {padding: 10},
  subHeading: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '500',
    paddingVertical: 10,
  },
  cardContainer: {
    backgroundColor: colors.brightBlue,
    borderColor: colors.GRAY,
    borderRadius: 20,
    borderWidth: 1,
    height: 200,
    justifyContent: 'center',
    marginVertical: 20,
    padding: 10,
    width: '100%',
  },
  labelText: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '500',
    padding: 5,
  },
  cardInput: {
    backgroundColor: colors.WHITE,
    borderRadius: 10,
    color: colors.BLACK,
    fontSize: 16,
    fontWeight: '500',
    padding: 10,
  },
  errorMessage: {
    color: colors.RED,
    fontSize: 14,
    padding: 3,
  },
  buttonContainer: {marginVertical: 20},
});
