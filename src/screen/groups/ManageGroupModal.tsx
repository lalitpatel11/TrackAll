//external imports
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import React, {useEffect, useState} from 'react';
import ToggleSwitch from 'toggle-switch-react-native';
//internal imports
import SubmitButton from '../../constants/SubmitButton';
import {colors} from '../../constants/ColorConstant';

const ManageGroupModal = ({
  groupId,
  isEditingEnabled,
  isGroupEnabled,
  onClose,
  onDeleteClick,
  onSubmitClick,
  visibleModal,
}: {
  groupId: number;
  isEditingEnabled: boolean | any;
  isGroupEnabled: boolean | any;
  onClose: Function;
  onDeleteClick: Function;
  onSubmitClick: Function;
  visibleModal: boolean;
}) => {
  const [editingEnabled, setEditingEnabled] = useState<boolean>(true);
  const [groupEnabled, setGroupEnabled] = useState<boolean>(true);

  useEffect(() => {
    if (isGroupEnabled == 'true') {
      setGroupEnabled(true);
    } else if (isGroupEnabled == 'false') {
      setGroupEnabled(false);
    }

    if (isEditingEnabled == 'true') {
      setEditingEnabled(false);
    } else if (isEditingEnabled == 'false') {
      setEditingEnabled(true);
    }
  }, [visibleModal]);

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
                source={require('../../assets/pngImage/cross.png')}
              />
            </TouchableOpacity>

            <Text style={styles.groupLabel}>Manage Group</Text>

            <View style={styles.direction}>
              <Text style={styles.emailText}>Group ID:</Text>
              <Text style={styles.emailText}>{groupId}</Text>

              <TouchableOpacity
                onPress={() => {
                  Clipboard.setString(groupId?.toString());
                }}>
                <Image
                  resizeMode="contain"
                  source={require('../../assets/pngImage/Copy.png')}
                />
              </TouchableOpacity>
            </View>

            {/* toggle section  */}
            <View style={styles.toggleContainer}>
              <Text style={styles.toggleText}>Group Access</Text>
              <ToggleSwitch
                isOn={groupEnabled}
                onColor={colors.lightOrange}
                offColor={colors.lightGray}
                size="medium"
                onToggle={() => setGroupEnabled(!groupEnabled)}
              />
            </View>

            <View style={styles.toggleContainer}>
              <Text style={styles.toggleText}>Allow Editing</Text>
              <ToggleSwitch
                isOn={editingEnabled}
                onColor={colors.lightOrange}
                offColor={colors.lightGray}
                size="medium"
                onToggle={() => setEditingEnabled(!editingEnabled)}
              />
            </View>

            {/*save button section */}
            <SubmitButton
              buttonText={'Submit'}
              submitButton={() => {
                onSubmitClick(groupEnabled, editingEnabled);
              }}
            />
            {/*Cancel button section  */}
            <TouchableOpacity
              style={styles.cancelContainer}
              onPress={() => {
                onDeleteClick();
              }}>
              <Image
                resizeMode="contain"
                style={{height: 18, width: 18}}
                source={require('../../assets/pngImage/Trash.png')}
              />
              <Text style={styles.cancelText}>Delete Group</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ManageGroupModal;

const styles = StyleSheet.create({
  centeredView: {
    backgroundColor: 'rgba(0, 0, 0, 0.66)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalViewEmailId: {
    backgroundColor: colors.BLACK2,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    paddingHorizontal: 30,
    paddingVertical: 20,
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
    fontSize: 22,
    paddingVertical: 10,
  },
  direction: {
    flexDirection: 'row',
    paddingBottom: 10,
  },
  emailText: {
    color: colors.THEME_WHITE,
    fontSize: 16,
    paddingRight: 4,
  },
  toggleContainer: {
    backgroundColor: colors.BLACK3,
    borderColor: colors.GRAY,
    borderRadius: 8,
    borderWidth: 1,
    elevation: 20,
    flexDirection: 'row',
    fontSize: 16,
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 20,
    shadowColor: colors.lightOrange,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1.0,
    shadowRadius: 10,
  },
  toggleText: {
    color: colors.WHITE,
    fontSize: 16,
  },
  cancelContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    height: 60,
    justifyContent: 'center',
  },
  cancelText: {
    color: colors.RED,
    fontSize: 16,
    fontWeight: '500',
    paddingLeft: 8,
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
  image: {
    borderRadius: 50,
    height: '100%',
    width: '100%',
  },
});
