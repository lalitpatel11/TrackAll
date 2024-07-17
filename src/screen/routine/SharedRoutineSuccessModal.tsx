//external imports
import React from 'react';
import {View, Text, StyleSheet, Modal} from 'react-native';
//internal imports
import SubmitButton from '../../constants/SubmitButton';
import {colors} from '../../constants/ColorConstant';

const SharedRoutineSuccessModal = ({
  groupCount,
  onClose,
  onSubmitClick,
  visibleModal,
}: {
  groupCount: number;
  onClose: Function;
  onSubmitClick: Function;
  visibleModal: boolean;
}) => {
  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={visibleModal}
        onRequestClose={() => {
          onClose();
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalViewRepeat}>
            <Text style={styles.heading}>Great!</Text>
            {groupCount === 1 ? (
              <Text style={styles.title}>
                You have shared a routine in {groupCount} group.
              </Text>
            ) : (
              <Text style={styles.title}>
                You have shared a routine in {groupCount} groups.
              </Text>
            )}

            {/* button section */}
            <View style={styles.buttonContainer}>
              <SubmitButton
                buttonText={'Continue'}
                submitButton={() => {
                  onSubmitClick();
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SharedRoutineSuccessModal;

const styles = StyleSheet.create({
  centeredView: {
    backgroundColor: 'rgba(0, 0, 0, 0.66)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalViewRepeat: {
    backgroundColor: colors.BLACK2,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 5,
    height: 'auto',
    padding: 15,
    shadowColor: '#000',
  },
  heading: {
    color: colors.THEME_ORANGE,
    fontSize: 25,
    fontWeight: '400',
    textAlign: 'center',
  },
  title: {
    color: colors.WHITE,
    fontSize: 15,
    fontWeight: '400',
    textAlign: 'center',
  },
  buttonContainer: {
    paddingVertical: 30,
  },
});
