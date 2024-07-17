//external imports
import {
  Image,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
//internal imports
import {colors} from '../../constants/ColorConstant';
import SubmitButton from '../../constants/SubmitButton';
import GroupServices from '../../service/GroupServices';

const ShareGroupIdModal = ({
  onClose,
  onSubmitClick,
  visibleModal,
}: {
  onClose: Function;
  onSubmitClick: Function;
  visibleModal: boolean;
}) => {
  const [err, setErr] = useState(false);
  const [groupId, setGroupId] = useState('');
  const [loader, setLoader] = useState(false);
  const [responseMsg, setResponseMsg] = useState('');

  useEffect(() => {
    setErr(false);
    setGroupId('');
    setResponseMsg('');
  }, [visibleModal, onClose, onSubmitClick]);

  // function for submit button click on api call to add in group
  const onSubmit = () => {
    setLoader(true);
    Keyboard.dismiss();

    if (groupId !== '') {
      setLoader(false);
      setErr(false);
      const data = {
        groupid: parseInt(groupId, 10),
      };
      setLoader(true);
      GroupServices.postRequestToGroupAdd(data)
        .then((response: any) => {
          setLoader(false);
          setErr(false);
          if (response.data.status == 1) {
            setResponseMsg(response.data.message);
            onSubmitClick(response.data.message);
          } else if (response.data.status == 2) {
            setResponseMsg(response.data.message);
          }
        })
        .catch((error: any) => {
          setErr(false);
          setLoader(false);
          console.log(error, 'error');
        });
    } else {
      setErr(true);
      setLoader(false);
    }
  };

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

            <Text style={styles.groupLabel}>Enter Group Id</Text>
            <TextInput
              placeholder="Enter Group Id"
              placeholderTextColor={colors.textGray}
              style={styles.textInput}
              onChangeText={(text: any) => {
                setErr(false), setGroupId(text);
              }}
            />
            {/* validation error message  */}
            {err ? (
              <Text style={styles.errorMessage}>*Please enter group id.</Text>
            ) : (
              <Text style={styles.errorMessage} />
            )}

            {/* after api response message  */}
            {responseMsg ? (
              <Text style={styles.responseMessage}>{responseMsg}</Text>
            ) : (
              <Text style={styles.responseMessage} />
            )}

            {/* button with loader  */}
            <View style={styles.buttonContainer}>
              <SubmitButton
                loader={loader}
                submitButton={onSubmit}
                buttonText={'Submit'}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ShareGroupIdModal;

const styles = StyleSheet.create({
  centeredView: {
    backgroundColor: 'rgba(0, 0, 0, 0.66)',
    flex: 1,
    justifyContent: 'center',
  },
  modalViewGroup: {
    backgroundColor: colors.BLACK2,
    borderRadius: 30,
    paddingVertical: 20,
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
  groupLabel: {
    color: colors.WHITE,
    fontSize: 18,
    paddingVertical: 15,
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
    paddingHorizontal: 10,
  },
  responseMessage: {
    color: colors.RED,
    fontSize: 14,
    fontWeight: '500',
    paddingHorizontal: 10,
  },
  buttonContainer: {marginTop: 5},
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
