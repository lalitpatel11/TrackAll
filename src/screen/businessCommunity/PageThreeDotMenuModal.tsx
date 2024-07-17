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

const PageThreeDotMenuModal = ({
  handleCopyLinkCLick,
  handleSharePostCLick,
  onClose,
  visibleModal,
}: {
  handleCopyLinkCLick: Function;
  handleSharePostCLick: Function;
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
          <View style={styles.modalViewRepeat}>
            <TouchableOpacity
              style={styles.checkedContainer}
              onPress={() => {
                handleCopyLinkCLick();
              }}>
              <Image
                resizeMode="contain"
                tintColor={colors.THEME_BLACK}
                style={{height: 25, width: 25}}
                source={require('../../assets/pngImage/Copy.png')}
              />
              <Text style={styles.optionText}>Copy Link</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkedContainer}
              onPress={() => {
                handleSharePostCLick();
              }}>
              <Image
                resizeMode="contain"
                tintColor={colors.THEME_BLACK}
                style={{height: 25, width: 25}}
                source={require('../../assets/pngImage/ShareIcon.png')}
              />
              <Text style={styles.optionText}>Share Post</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkedContainer}
              onPress={() => {
                onClose();
              }}>
              <Image
                resizeMode="contain"
                tintColor={colors.THEME_BLACK}
                style={{height: 25, width: 25}}
                source={require('../../assets/pngImage/cross.png')}
              />
              <Text style={styles.optionText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PageThreeDotMenuModal;

const styles = StyleSheet.create({
  centeredView: {
    backgroundColor: 'rgba(0, 0, 0, 0.66)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalViewRepeat: {
    backgroundColor: colors.WHITE,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  optionText: {
    color: colors.THEME_BLACK,
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
