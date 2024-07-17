// external imports
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
// internal imports
import {colors} from '../../constants/ColorConstant';
import SubmitButton from '../../constants/SubmitButton';

const SubscriptionPurchaseModal = ({
  onClose,
  onSubmitClick,
  visibleModal,
}: {
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
                source={require('../../assets/pngImage/cross.png')}
              />
            </TouchableOpacity>

            <Text style={styles.alertMsg}>
              Subscribe to view all Posts and Routines
            </Text>

            <View style={styles.buttonContainer}>
              <SubmitButton
                submitButton={() => {
                  onSubmitClick();
                }}
                buttonText={'Subscribe Now'}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SubscriptionPurchaseModal;

const styles = StyleSheet.create({
  centeredView: {
    backgroundColor: 'rgba(0, 0, 0, 0.66)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalViewGroup: {
    backgroundColor: colors.BLACK3,
    borderRadius: 10,
    margin: 20,
    padding: 20,
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
  imageStyle: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
  },
  alertMsg: {
    color: colors.WHITE,
    fontSize: 18,
    marginTop: 25,
  },
  buttonContainer: {paddingTop: 30},
});
