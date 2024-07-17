// external imports
import React, {useState} from 'react';
import {View, Text, Modal, Image, StyleSheet} from 'react-native';
// internal imports
import SubmitButton from '../../constants/SubmitButton';
import {colors} from '../../constants/ColorConstant';

const CreateEventSuccessModal = ({navigation}: {navigation: any}) => {
  const [loader, setLoader] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  //  function on continue button click
  const handleContinueButton = () => {
    setModalVisible(false);
    setTimeout(() => {
      navigation.replace('StackNavigation', {
        screen: 'EventDetails',
      });
    }, 200);
  };

  return (
    <View>
      {/* modal for successfully verification  */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View>
              <Image
                resizeMode="contain"
                style={styles.successImage}
                source={require('../../assets/pngImage/verificationChecked.png')}
              />
              <Text style={styles.successText}>Event created successfully</Text>
              <SubmitButton
                loader={loader}
                submitButton={() => handleContinueButton()}
                buttonText={'Continue'}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CreateEventSuccessModal;

const styles = StyleSheet.create({
  centeredView: {
    backgroundColor: 'rgba(0, 0, 0, 0.66)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalView: {
    backgroundColor: colors.WHITE,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    elevation: 5,
    padding: 20,
    paddingBottom: 20,
  },
  successImage: {
    alignSelf: 'center',
    height: 100,
    width: 100,
  },
  successText: {
    color: colors.BLACK,
    fontSize: 20,
    paddingVertical: 25,
    textAlign: 'center',
  },
});
