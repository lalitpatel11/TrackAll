//external imports
import {Modal, StyleSheet, Text, View} from 'react-native';
import React from 'react';
//internal imports
import SubmitButton from '../../constants/SubmitButton';
import {colors} from '../../constants/ColorConstant';

const TaskCompleteAlert = ({
  onClose,
  visibleModal,
}: {
  onClose: Function;
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
          <View style={styles.modalViewGroup}>
            {/* error msg section */}
            <Text style={styles.alertMsg}>
              You can not mark complete for future date.
            </Text>

            {/* button section */}
            <View style={styles.buttonContainer}>
              <SubmitButton
                submitButton={() => {
                  onClose();
                }}
                buttonText={'Ok'}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TaskCompleteAlert;

const styles = StyleSheet.create({
  centeredView: {
    backgroundColor: 'rgba(0, 0, 0, 0.66)',
    flex: 1,
    justifyContent: 'center',
  },
  modalViewGroup: {
    backgroundColor: colors.BLACK2,
    borderRadius: 10,
    margin: 20,
    padding: 20,
  },
  alertMsg: {
    color: colors.WHITE,
    fontSize: 18,
    paddingVertical: 10,
  },
  buttonContainer: {paddingTop: 10},
});
