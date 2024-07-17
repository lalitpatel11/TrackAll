//external imports
import React from 'react';
import {Divider} from 'react-native-paper';
import {View, Text, Modal, StyleSheet, TouchableOpacity} from 'react-native';
//internal imports
import {colors} from '../../constants/ColorConstant';

const CameraGalleryModal = ({
  cameraClick,
  galleryClick,
  onClose,
  visibleModal,
}: {
  cameraClick: Function;
  galleryClick: Function;
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
            {/* select image upload section  */}
            <Text style={styles.headerText}>Select photo</Text>

            <Divider />

            <TouchableOpacity
              style={styles.optionContainer}
              onPress={() => {
                cameraClick();
              }}>
              <Text style={styles.optionText}>Take Photo</Text>
            </TouchableOpacity>

            <Divider />

            <TouchableOpacity
              style={styles.optionContainer}
              onPress={() => {
                galleryClick();
              }}>
              <Text style={styles.optionText}>Choose from library</Text>
            </TouchableOpacity>
          </View>

          {/* cancel button section  */}
          <TouchableOpacity
            style={styles.cancelContainer}
            onPress={() => {
              onClose();
            }}>
            <Text style={styles.optionText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default CameraGalleryModal;

const styles = StyleSheet.create({
  centeredView: {
    backgroundColor: 'rgba(0, 0, 0, 0.66)',
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
  },
  modalViewGroup: {
    backgroundColor: colors.BLACK3,
    borderRadius: 15,
    height: 'auto',
    padding: 10,
  },
  headerText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
    padding: 10,
    textAlign: 'center',
  },
  optionText: {
    color: colors.THEME_ORANGE,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  optionContainer: {
    marginBottom: 5,
    padding: 10,
  },
  cancelContainer: {
    alignItems: 'center',
    backgroundColor: colors.BLACK3,
    borderRadius: 15,
    height: 'auto',
    justifyContent: 'center',
    marginVertical: 5,
    padding: 15,
  },
});
