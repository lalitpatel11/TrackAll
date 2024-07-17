// external imports
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
// internal imports
import SubmitButton from '../../../constants/SubmitButton';
import {colors} from '../../../constants/ColorConstant';

const SettleSplitBillCompleteModal = ({
  onClose,
  onSubmitClick,
  settleAmount,
  visibleModal,
}: {
  onClose: Function;
  onSubmitClick: Function;
  settleAmount: number;
  visibleModal: boolean;
}) => {
  const [loader, setLoader] = useState(false);

  useEffect(() => {}, [visibleModal]);

  const onSubmit = () => {
    setLoader(true);
    setLoader(false);
    onSubmitClick();
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={visibleModal}
        onRequestClose={() => {
          onClose();
        }}>
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
                source={require('../../../assets/pngImage/cross.png')}
              />
            </TouchableOpacity>

            <Text style={styles.heading}>Settle Up Bill</Text>
            <View style={styles.imageContainer}>
              <Image
                resizeMode="contain"
                style={styles.image}
                source={require('../../../assets/pngImage/settlebillimage.png')}
              />
            </View>

            <Text style={styles.subHeading}>Amount due to settle</Text>
            <Text style={styles.amountText}>${settleAmount}</Text>

            {/* button section */}
            <View style={styles.buttonContainer}>
              <SubmitButton
                buttonText={'Settle Bill'}
                loader={loader}
                submitButton={() => onSubmit()}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SettleSplitBillCompleteModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredView: {
    backgroundColor: 'rgba(0, 0, 0, 0.66)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalViewEmailId: {
    backgroundColor: colors.BLACK2,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  crossContainer: {
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 50,
    height: 30,
    position: 'absolute',
    right: 10,
    top: 10,
    width: 30,
    zIndex: 1,
  },
  heading: {
    alignSelf: 'center',
    color: colors.WHITE,
    fontSize: 25,
    fontWeight: '400',
  },
  image: {
    borderRadius: 50,
    height: '100%',
    width: '100%',
  },
  imageContainer: {
    alignSelf: 'center',
    height: 320,
    justifyContent: 'center',
    marginBottom: 10,
    width: 230,
  },
  subHeading: {
    alignSelf: 'center',
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '500',
  },
  amountText: {
    alignSelf: 'center',
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '500',
    padding: 10,
  },
  buttonContainer: {
    marginVertical: 10,
  },
});
