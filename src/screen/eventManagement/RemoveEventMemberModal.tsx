// external imports
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
// internal imports
import AllMembersTab from '../groups/AllMembersTab';
import CommonToast from '../../constants/CommonToast';
import EventService from '../../service/EventService';
import SubmitButton from '../../constants/SubmitButton';
import {colors} from '../../constants/ColorConstant';

const RemoveEventMemberModal = ({
  visibleModal,
  onClose,
  onSubmitClick,
  eventId,
}: {
  visibleModal: boolean;
  onClose: Function;
  onSubmitClick: Function;
  eventId: number;
}) => {
  const [allMembersData, setAllMembersData] = useState<any[]>([]);
  const [arrayList, setArrayList] = useState<any[]>([]);
  const [checked, setChecked] = useState(false);
  const [loader, setLoader] = useState(false);
  const toastRef = useRef<any>();

  useEffect(() => {
    setArrayList([]);
    getAllMembers();
  }, [visibleModal]);

  // function for get all members on api call for event
  const getAllMembers = () => {
    setLoader(true);

    const data = {
      eventid: eventId,
    };
    EventService.postViewAllEventMember(data)
      .then((response: any) => {
        setLoader(false);
        setAllMembersData(response.data.users);
      })
      .catch(error => {
        setLoader(false);
        console.log(error);
      });
  };

  // list for pre added members
  const renderAddedMembers = ({item}: {item: any; index: any}) => {
    return (
      <AllMembersTab
        item={item}
        handleChecked={handleChecked}
        checked={checked}
        checkedList={arrayList}
      />
    );
  };

  // function for select members for remove
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

            <Text style={styles.groupLabel}>Remove member from event</Text>
            {/*recently added members  */}
            {!loader ? (
              allMembersData?.length >= 1 ? (
                <FlatList
                  data={allMembersData}
                  renderItem={renderAddedMembers}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item: any, index: any) => String(index)}
                />
              ) : (
                <View style={styles.noMembersContainer}>
                  <Text style={styles.noMembersText}>No Members Available</Text>
                </View>
              )
            ) : (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={colors.THEME_ORANGE} />
              </View>
            )}

            <View style={styles.buttonContainer}>
              <SubmitButton
                submitButton={() => {
                  onSubmitClick(arrayList);
                }}
                buttonText={'Remove'}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* toaster message for error response from API  */}
      <CommonToast ref={toastRef} />
    </View>
  );
};

export default RemoveEventMemberModal;

const styles = StyleSheet.create({
  centeredView: {
    backgroundColor: 'rgba(0, 0, 0, 0.66)',
    flex: 1,
    justifyContent: 'center',
  },
  modalViewEmailId: {
    backgroundColor: colors.BLACK2,
    borderRadius: 30,
    padding: 20,
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
    paddingVertical: 10,
    fontWeight: '500',
  },
  buttonContainer: {
    marginTop: 15,
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
  loaderContainer: {
    alignSelf: 'center',
    height: 50,
    justifyContent: 'center',
  },
  noMembersContainer: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noMembersText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
    padding: 20,
  },
});
