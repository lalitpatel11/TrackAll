// external imports
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {Formik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// internal imports
import SubmitButton from '../../constants/SubmitButton';
import {card} from '../../constants/SchemaValidation';
import {colors} from '../../constants/ColorConstant';

const AddCardModal = ({
  onClose,
  onSubmitClick,
  visibleModal,
}: {
  onClose: Function;
  onSubmitClick: Function;
  visibleModal: boolean;
}) => {
  // function for submit button click
  const onSubmit = (values: any) => {
    Keyboard.dismiss();
    onSubmitClick(values.cardName);
  };

  const initialValues = {
    cardName: '',
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
            validationSchema={card}
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
                <View style={styles.modalViewEmailId}>
                  {/* cross button section  */}
                  <TouchableOpacity
                    style={styles.crossContainer}
                    onPress={() => {
                      onClose();
                    }}>
                    <Image
                      style={styles.image}
                      resizeMode="contain"
                      source={require('../../assets/pngImage/cross.png')}
                    />
                  </TouchableOpacity>

                  <Text style={styles.cardLabel}>Add Card</Text>

                  <TextInput
                    placeholder="Add Identifier"
                    placeholderTextColor={colors.textGray}
                    style={styles.textInput}
                    value={values.cardName}
                    onChangeText={handleChange('cardName')}
                    onBlur={() => {
                      handleBlur('cardName');
                      setFieldTouched('cardName');
                    }}
                  />
                  <Text style={styles.errorMessage}>
                    {touched.cardName && errors.cardName}
                  </Text>

                  {/*save button section */}
                  <SubmitButton
                    buttonText={'Add'}
                    submitButton={() => {
                      handleSubmit();
                    }}
                  />
                </View>
              </View>
            )}
          </Formik>
        </Modal>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddCardModal;

const styles = StyleSheet.create({
  container: {flex: 1},
  body: {flex: 1, padding: 5},
  centeredView: {
    backgroundColor: 'rgba(0, 0, 0, 0.66)',
    flex: 1,
    justifyContent: 'center',
  },
  modalViewEmailId: {
    backgroundColor: colors.BLACK2,
    borderRadius: 30,
    elevation: 5,
    padding: 20,
  },
  cardLabel: {
    color: colors.WHITE,
    fontSize: 22,
    fontWeight: '500',
    paddingVertical: 10,
    textAlign: 'center',
  },
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
  image: {
    borderRadius: 50,
    height: '100%',
    width: '100%',
  },
  textInput: {
    backgroundColor: colors.BLACK3,
    borderColor: colors.brightGray,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.WHITE,
    fontSize: 16,
    padding: 15,
  },
  errorMessage: {
    color: colors.RED,
    fontSize: 14,
    padding: 5,
  },
});
