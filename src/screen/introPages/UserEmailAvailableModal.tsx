//external imports
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Formik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
//external imports
import SubmitButton from '../../constants/SubmitButton';
import UserAuthService from '../../service/UserAuthService';
import {colors} from '../../constants/ColorConstant';
import {signUpValidation} from '../../constants/SchemaValidation';

const UserEmailAvailableModal = ({
  onClose,
  visibleModal,
}: {
  onClose: Function;
  visibleModal: boolean;
}) => {
  const [loader, setLoader] = useState(false);
  const [responseMsg, setResponseMsg] = useState('');

  // function for get user email available on api call
  const onSubmit = (values: any) => {
    Keyboard.dismiss();
    setLoader(true);

    const data = {email: values.email};
    UserAuthService.postUserEmailAvailable(data)
      .then((response: any) => {
        setLoader(false);
        if (response.data.status === 0) {
          onClose();
        } else if (response.data.status === 1) {
          setResponseMsg(response.data.message);
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
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={styles.body}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={visibleModal}
          onRequestClose={() => {
            onClose();
          }}>
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
              <View style={styles.centeredView}>
                <View style={styles.modalViewGroup}>
                  <Text style={styles.groupLabel}>Enter Email Id</Text>
                  <TextInput
                    placeholder="Enter Email Id"
                    placeholderTextColor={colors.textGray}
                    style={styles.textInput}
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={() => {
                      handleBlur('email');
                      setFieldTouched('email');
                    }}
                  />
                  <Text style={styles.errorMessage}>
                    {touched.email && errors.email}
                  </Text>

                  {responseMsg !== '' ? (
                    <Text style={styles.errorMessage}>{responseMsg}</Text>
                  ) : null}

                  {/* button with loader  */}
                  <View style={styles.buttonContainer}>
                    <SubmitButton
                      loader={loader}
                      submitButton={handleSubmit}
                      buttonText={'Save'}
                    />
                  </View>
                </View>
              </View>
            )}
          </Formik>
        </Modal>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

export default UserEmailAvailableModal;

const styles = StyleSheet.create({
  container: {flex: 1},
  body: {flex: 1, padding: 10},
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.66)',
  },
  modalViewGroup: {
    backgroundColor: colors.WHITE,
    borderRadius: 30,
    elevation: 5,
    margin: 10,
    padding: 20,
  },
  imageContainer: {
    alignSelf: 'center',
    height: 150,
    justifyContent: 'center',
    marginBottom: 10,
    width: 190,
  },
  groupLabel: {
    color: colors.BLACK,
    fontSize: 18,
    paddingVertical: 10,
  },
  textInput: {
    backgroundColor: colors.WHITE,
    borderColor: colors.brightGray,
    borderRadius: 8,
    borderWidth: 2,
    color: colors.THEME_BLACK,
    fontSize: 16,
    padding: 15,
  },
  errorMessage: {
    color: colors.RED,
    paddingHorizontal: 10,
  },
  buttonContainer: {paddingTop: 20},
  crossContainer: {
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 50,
    height: 30,
    position: 'absolute',
    right: 15,
    top: 10,
    width: 30,
    zIndex: 1,
  },
  imageStyle: {
    borderRadius: 10,
    height: '100%',
    width: '100%',
  },
  uploadMediaContainer: {
    alignItems: 'center',
    backgroundColor: colors.WHITE,
    borderColor: colors.THEME_ORANGE,
    borderRadius: 50,
    borderStyle: 'dotted',
    borderWidth: 2,
    flexDirection: 'row',
    height: 60,
    justifyContent: 'center',
  },
  uploadImageStyle: {
    height: 30,
    paddingHorizontal: 25,
    width: 30,
  },
  uploadMediaText: {
    color: colors.THEME_BLACK,
    fontSize: 14,
    fontWeight: '400',
  },
  uploadMediaBox: {
    borderRadius: 10,
    height: 90,
    marginBottom: 10,
    width: 130,
  },
});
