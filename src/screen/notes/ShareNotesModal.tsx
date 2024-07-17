//external imports
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
//internal imports
import GroupServices from '../../service/GroupServices';
import ShareRoutineModalTab from '../routine/ShareRoutineModalTab';
import SubmitButton from '../../constants/SubmitButton';
import {colors} from '../../constants/ColorConstant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BusinessService from '../../service/BusinessService';

const ShareNotesModal = ({
  buttonLoader,
  onClose,
  onSubmitClick,
  visibleModal,
  notesData,
}: {
  buttonLoader: boolean;
  onClose: Function;
  onSubmitClick: Function;
  visibleModal: boolean;
  notesData: any;
}) => {
  const [arrayList, setArrayList] = useState<any[]>([]);
  const [checked, setChecked] = useState(true);
  const [myGroupList, setMyGroupList] = useState([]);

  useEffect(() => {
    if (notesData?.groupdetails != null) {
      // for preselected group id
      let groupId = notesData?.groupdetails.map((e: any) => e.groupid);
      setArrayList(groupId);
    }

    getAllGroups();
  }, [visibleModal, onClose, onSubmitClick]);

  // function for get all my group data on api call
  const getAllGroups = async () => {
    const accountId = await AsyncStorage.getItem('accountId');
    const userType = await AsyncStorage.getItem('userType');

    if (userType == '2') {
      BusinessService.getMyBusinessGroups(accountId)
        .then((response: any) => {
          setMyGroupList(response?.data?.mygroups);
        })
        .catch((error: any) => {
          console.log(error);
        });
    } else {
      GroupServices.getMyGroups()
        .then((response: any) => {
          setMyGroupList(response?.data?.mygroups);
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  };

  // list for shared routine
  const renderGroupList = ({item}: {item: any; index: any}) => {
    return (
      <ShareRoutineModalTab
        items={item}
        handleChecked={handleChecked}
        checked={checked}
        checkedList={arrayList}
      />
    );
  };

  // function on select group click
  const handleChecked = (selectedId: number) => {
    setChecked(true);
    if (arrayList.includes(selectedId)) {
      setArrayList(arrayList.filter(ids => ids !== selectedId));
    } else {
      setArrayList([...arrayList, selectedId]);
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

            <Text style={styles.heading}>Great!</Text>
            <Text style={styles.title}>
              Share your notes across groups your Are In..
            </Text>

            <FlatList
              data={myGroupList}
              renderItem={renderGroupList}
              keyExtractor={(item: any, index: any) => String(index)}
            />
            <SubmitButton
              loader={buttonLoader}
              buttonText={'Share'}
              submitButton={() => {
                onSubmitClick(arrayList);
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ShareNotesModal;

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
    elevation: 5,
    height: 500,
    padding: 20,
    shadowColor: '#000',
  },
  heading: {
    color: colors.THEME_ORANGE,
    fontSize: 25,
    fontWeight: '400',
    paddingTop: 10,
  },
  title: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '400',
  },
  direction: {
    flexDirection: 'row',
  },
  titleText: {
    color: colors.THEME_ORANGE,
    fontSize: 18,
    fontWeight: '500',
    paddingVertical: 5,
  },
  nameText: {
    color: colors.THEME_BLACK,
    fontSize: 18,
    fontWeight: '500',
    paddingVertical: 5,
    width: '70%',
  },
  crossContainer: {
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 50,
    height: 30,
    position: 'absolute',
    right: 15,
    top: 20,
    width: 30,
    zIndex: 1,
  },
  imageStyle: {
    borderRadius: 10,
    height: '100%',
    width: '100%',
  },
});
