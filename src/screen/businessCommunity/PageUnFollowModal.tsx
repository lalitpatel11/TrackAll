// external imports
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
// internal imports
import {colors} from '../../constants/ColorConstant';

const PageUnFollowModal = ({
  handleUnFollowYesCLick,
  onClose,
  visibleModal,
}: {
  handleUnFollowYesCLick: Function;
  onClose: Function;
  visibleModal: boolean;
}) => {
  const [value, setValue] = useState('N');

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

            <Text style={styles.headingText}>
              Are you sure you want to unfollow this page ?
            </Text>

            <TouchableOpacity
              onPress={() => {
                setValue('Y');
                handleUnFollowYesCLick();
              }}
              style={value === 'Y' ? styles.checkedContainer : null}>
              <Text style={styles.yesNoText}>Yes</Text>
              {value === 'Y' ? (
                <Image
                  resizeMode="contain"
                  source={require('../../assets/pngImage/CheckCircle.png')}
                />
              ) : null}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setValue('N');
                onClose();
              }}
              style={value === 'N' ? styles.checkedContainer : null}>
              <Text style={styles.yesNoText}>No</Text>
              {value === 'N' ? (
                <Image
                  resizeMode="contain"
                  source={require('../../assets/pngImage/CheckCircle.png')}
                />
              ) : null}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PageUnFollowModal;

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
    paddingHorizontal: 30,
    paddingVertical: 10,
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
    height: '100%',
    width: '100%',
  },
  headingText: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '500',
    marginTop: 10,
    padding: 10,
  },
  yesNoText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
    padding: 10,
  },
  checkedContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 60,
    paddingRight: 10,
  },
});
