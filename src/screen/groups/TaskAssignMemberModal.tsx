//external imports
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
//internal imports
import AllMembersTab from './AllMembersTab';
import CommonToast from '../../constants/CommonToast';
import GroupServices from '../../service/GroupServices';
import SubmitButton from '../../constants/SubmitButton';
import {colors} from '../../constants/ColorConstant';

const TaskAssignMemberModal = ({
  groupId,
  navigation,
  onClose,
  onSubmitClick,
  visibleModal,
}: {
  groupId: number;
  navigation: any;
  onClose: Function;
  onSubmitClick: Function;
  visibleModal: boolean;
}) => {
  const [allMembersData, setAllMembersData] = useState<any[]>([]);
  const [arrayList, setArrayList] = useState<any[]>([]);
  const [checked, setChecked] = useState(true);
  const [loader, setLoader] = useState(false);
  const [memberList, setMemberList] = useState<any[]>([]);
  const [noData, setNoData] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectVisible, setSelectVisible] = useState(false);
  const toastRef = useRef<any>();

  useEffect(() => {
    setSearchText('');
    setArrayList([]);
    getAllMembers();
  }, [visibleModal]);

  // function for get all members data on api call
  const getAllMembers = () => {
    setLoader(true);

    const data = {
      group_id: groupId,
    };

    setLoader(true);
    GroupServices.postRecentlyAddMembers(data)
      .then((response: any) => {
        setLoader(false);
        setAllMembersData(response.data.users);
      })
      .catch((error: any) => {
        console.log(error);
        setLoader(false);
      });
  };

  // list for all members
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

  // function on select members click
  const handleChecked = (selectedId: number, selectedData: any) => {
    setChecked(true);

    if (arrayList.includes(selectedId)) {
      setArrayList(arrayList.filter(ids => ids !== selectedId));
    } else {
      setArrayList([...arrayList, selectedId]);
    }

    // for member list
    const objWithIdIndex = memberList.findIndex(
      (obj: any) => obj.id === selectedData.id,
    );

    if (objWithIdIndex > -1) {
      memberList.splice(objWithIdIndex, 1);
    } else {
      setMemberList([...memberList, selectedData]);
    }
  };

  // function for search all member data on api call
  const getSearchMembers = (text: any) => {
    if (text !== '') {
      let data = {
        groupid: groupId,
        search: text,
      };

      GroupServices.postSearchMembers(data)
        .then((response: any) => {
          setAllMembersData(response.data.users);
          setNoData(true);
        })
        .catch((error: any) => {
          console.log(error);
        });
    } else {
      getAllMembers();
    }
  };

  // function on select all member click
  const handleSelectAll = () => {
    setSelectVisible(true);
    let membersId = allMembersData.map((e: any) => e.id);
    setArrayList(membersId);
    setMemberList(allMembersData);
  };

  // function on unselect all member click
  const handleUnSelectAll = () => {
    setSelectVisible(false);
    setArrayList([]);
    setMemberList([]);
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

            <Text style={styles.groupLabel}>
              Select member from group to assign this task
            </Text>

            {/* search member section  */}
            <TextInput
              placeholder="Search By Member Name"
              placeholderTextColor={colors.THEME_WHITE}
              style={styles.textInput}
              value={searchText}
              onChangeText={text => {
                setSearchText(text);
                getSearchMembers(text);
              }}
            />

            {/*recently added members  */}
            {!loader ? (
              allMembersData?.length >= 1 ? (
                <>
                  {/* select and unSelect section  */}
                  {!selectVisible ? (
                    <TouchableOpacity
                      style={{width: 80}}
                      onPress={() => {
                        handleSelectAll();
                      }}>
                      <Text style={styles.selectText}>Select All</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={{width: 95}}
                      onPress={() => {
                        handleUnSelectAll();
                      }}>
                      <Text style={styles.selectText}>Unselect All</Text>
                    </TouchableOpacity>
                  )}

                  {/* all members list  */}
                  <FlatList
                    data={allMembersData}
                    renderItem={renderAddedMembers}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item: any, index: any) => String(index)}
                  />
                </>
              ) : (
                <>
                  {!noData ? (
                    <View style={styles.noMembersContainer}>
                      <Text style={styles.noMembersText}>
                        No Members Available
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.noMembersContainer}>
                      <Text style={styles.noMembersText}>No Result Found </Text>
                    </View>
                  )}
                </>
              )
            ) : (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={colors.THEME_ORANGE} />
              </View>
            )}

            <View style={styles.buttonContainer}>
              <SubmitButton
                submitButton={() => {
                  setSelectVisible(false);
                  onSubmitClick(arrayList, memberList);
                }}
                buttonText={'Submit'}
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

export default TaskAssignMemberModal;

const styles = StyleSheet.create({
  centeredView: {
    backgroundColor: 'rgba(0, 0, 0, 0.66)',
    flex: 1,
    justifyContent: 'center',
  },
  modalViewEmailId: {
    backgroundColor: colors.BLACK3,
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
    fontWeight: '500',
    marginTop: 12,
    marginVertical: 3,
    paddingVertical: 10,
  },
  buttonContainer: {marginTop: 15},
  crossContainer: {
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 50,
    height: 30,
    position: 'absolute',
    right: 15,
    top: 8,
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
    fontSize: 20,
    fontWeight: '500',
    padding: 20,
  },
  textInput: {
    backgroundColor: colors.GRAY,
    borderColor: colors.brightGray,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.WHITE,
    fontSize: 16,
    padding: 10,
  },
  selectText: {
    color: colors.THEME_ORANGE,
    fontSize: 16,
    fontWeight: '500',
    padding: 2,
  },
});
