//external imports
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {colors} from '../../../constants/ColorConstant';
import SubmitButton from '../../../constants/SubmitButton';
//internal imports

const RejectAppointmentModal = ({
  onClose,
  onCreateClick,
  visibleModal,
}: {
  onClose: Function;
  onCreateClick: Function;
  visibleModal: boolean;
}) => {
  const [reason, setReason] = useState('');

  useEffect(() => {}, [visibleModal]);

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
          <View style={styles.centeredView}>
            <View style={styles.modalViewGroup}>
              {/* cross button section  */}
              <TouchableOpacity
                style={styles.crossContainer}
                onPress={() => {
                  onClose();
                }}>
                <Image
                  style={styles.imageStyle}
                  resizeMode="contain"
                  source={require('../../../assets/pngImage/cross.png')}
                />
              </TouchableOpacity>

              <Text style={styles.groupLabel}>Reject Reason</Text>
              <TextInput
                placeholder="Reject Reason"
                placeholderTextColor={colors.textGray}
                style={styles.textInput}
                value={reason}
                onChangeText={text => {
                  setReason(text);
                }}
              />

              {/* button with loader  */}
              <View style={styles.buttonContainer}>
                <SubmitButton
                  submitButton={() => onCreateClick(reason)}
                  buttonText={'Submit'}
                />
              </View>
            </View>
          </View>
        </Modal>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

export default RejectAppointmentModal;

const styles = StyleSheet.create({
  container: {flex: 1},
  body: {
    flex: 1,
    padding: 5,
  },
  centeredView: {
    backgroundColor: 'rgba(0, 0, 0, 0.66)',
    flex: 1,
    justifyContent: 'center',
  },
  modalViewGroup: {
    backgroundColor: colors.BLACK2,
    borderRadius: 30,
    paddingVertical: 40,
    paddingHorizontal: 20,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  imageContainer: {
    alignSelf: 'center',
    height: 150,
    justifyContent: 'center',
    marginBottom: 10,
    width: 190,
  },
  groupLabel: {
    color: colors.WHITE,
    fontSize: 18,
    paddingVertical: 10,
  },
  textInput: {
    backgroundColor: colors.BLACK3,
    borderColor: colors.brightGray,
    borderRadius: 8,
    borderWidth: 2,
    color: colors.WHITE,
    fontSize: 16,
    padding: 15,
  },
  errorMessage: {
    color: colors.RED,
    paddingHorizontal: 10,
  },
  buttonContainer: {paddingTop: 10},
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
});
