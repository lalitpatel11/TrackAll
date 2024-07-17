//external imports
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
//internal imports
import {colors} from '../../constants/ColorConstant';

const RepeatModal = ({
  onClose,
  repeatValue,
  visibleModal,
}: {
  onClose: Function;
  repeatValue: string;
  visibleModal: boolean;
}) => {
  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={visibleModal}
        onRequestClose={() => {
          onClose('');
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalViewRepeat}>
            {/* cross button section  */}
            <TouchableOpacity
              style={styles.crossContainer}
              onPress={() => {
                onClose('');
              }}>
              <Image
                style={styles.imageStyle}
                resizeMode="contain"
                source={require('../../assets/pngImage/cross.png')}
              />
            </TouchableOpacity>

            <Text style={styles.repeatText}>Repeat</Text>

            <TouchableOpacity
              onPress={() => {
                onClose('O');
              }}
              style={repeatValue === 'Once' ? styles.checkedContainer : null}>
              <Text style={styles.labelText}>Once</Text>
              {repeatValue === 'Once' ? (
                <Image
                  resizeMode="contain"
                  source={require('../../assets/pngImage/CheckedCircle.png')}
                />
              ) : null}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                onClose('D');
              }}
              style={repeatValue === 'Daily' ? styles.checkedContainer : null}>
              <Text style={styles.labelText}>Daily</Text>
              {repeatValue === 'Daily' ? (
                <Image
                  resizeMode="contain"
                  source={require('../../assets/pngImage/CheckedCircle.png')}
                />
              ) : null}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                onClose('T');
              }}
              style={repeatValue === 'Date' ? styles.checkedContainer : null}>
              <Text style={styles.labelText}>Date</Text>
              {repeatValue === 'Date' ? (
                <Image
                  resizeMode="contain"
                  source={require('../../assets/pngImage/CheckedCircle.png')}
                />
              ) : null}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                onClose('C');
              }}
              style={repeatValue === 'Custom' ? styles.checkedContainer : null}>
              <Text style={styles.labelText}>Custom</Text>
              {repeatValue === 'Custom' ? (
                <Image
                  resizeMode="contain"
                  source={require('../../assets/pngImage/CheckedCircle.png')}
                />
              ) : null}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default RepeatModal;

const styles = StyleSheet.create({
  centeredView: {
    backgroundColor: 'rgba(0, 0, 0, 0.66)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalViewRepeat: {
    backgroundColor: colors.BLACK3,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    paddingHorizontal: 30,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  repeatText: {
    color: colors.THEME_ORANGE,
    fontSize: 22,
    padding: 10,
  },
  labelText: {
    color: colors.WHITE,
    fontSize: 18,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  checkedContainer: {
    alignItems: 'center',
    borderColor: colors.THEME_ORANGE,
    borderRadius: 10,
    borderWidth: 2,
    flexDirection: 'row',
    height: 60,
    justifyContent: 'space-between',
    paddingRight: 10,
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
});
