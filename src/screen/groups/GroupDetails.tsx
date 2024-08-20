// external imports
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useRef, useState} from 'react';
// internal imports
import AddMemberOnGroupModal from './AddMemberOnGroupModal';
import AddedTaskTab from './AddedTaskTab';
import CommonToast from '../../constants/CommonToast';
import CustomHeader from '../../constants/CustomHeader';
import DeleteAlertModal from './DeleteAlertModal';
import EditGroupNameModal from './EditGroupNameModal';
import GroupServices from '../../service/GroupServices';
import ManageGroupModal from './ManageGroupModal';
import RecentlyAddedMembersTab from './RecentlyAddedMembersTab';
import RemoveGroupMemberModal from './RemoveGroupMemberModal';
import {colors} from '../../constants/ColorConstant';
import AddTaskNotesRoutineButton from './AddTaskNotesRoutineButton';

const GroupDetails = ({route, navigation}: {route: any; navigation: any}) => {
  const [allTask, setAllTask] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editGroupNameModal, setEditGroupNameModal] = useState(false);
  const [groupDetails, setGroupDetails] = useState({});
  const [groupId, setGroupId] = useState(route?.params?.data);
  const [groupName, setGroupName] = useState('');
  const [manageGroupModal, setManageGroupModal] = useState(false);
  const [memberIdModal, setMemberIdModal] = useState(false);
  const [myUserId, setMyUserId] = useState<any>();
  const [userType, setUserType] = useState('1');
  const [pageLoader, setPageLoader] = useState(false);
  const [recentlyAddedMemberList, setRecentlyAddedMemberList] = useState([]);
  const [recentlyMemberLoader, setRecentlyMemberLoader] = useState(false);
  const [removeMemberIdModal, setRemoveMemberIdModal] = useState(false);
  const toastRef = useRef<any>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setPageLoader(true);
      let id: number = route?.params?.data;
      setGroupId(id);
      getAllDetails();
      getRecentlyAddMembers();
    });
    return unsubscribe;
  }, [navigation]);

  // function for get recently added members data on api call
  const getRecentlyAddMembers = () => {
    setRecentlyMemberLoader(true);
    const data = {
      group_id: groupId,
    };

    GroupServices.postRecentlyAddMembers(data)
      .then((response: any) => {
        setRecentlyMemberLoader(false);
        setRecentlyAddedMemberList(response.data.users);
      })
      .catch((error: any) => {
        setRecentlyMemberLoader(false);
        console.log(error, 'error');
      });
  };

  // function for get group details on api call
  const getAllDetails = async () => {
    // user id  and type for edit group name by owner only
    const userType = await AsyncStorage.getItem('userType');
    setUserType(userType);
    const token = await AsyncStorage.getItem('userId');
    setMyUserId(token);

    GroupServices.getGroupDetails(groupId)
      .then((response: any) => {
        setPageLoader(false);
        setGroupDetails(response.data.group);
        setGroupName(response.data.group.name);
        setAllTask(response.data.details);
      })
      .catch((error: any) => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // function for close modal on manage group icon click
  const handleManageGroupModalClose = () => {
    setManageGroupModal(false);
  };

  // function for submit button click on api call to manage group
  const handleManageGroupSubmitClick = (
    visibleGroup: boolean,
    isEdit: boolean,
  ) => {
    setManageGroupModal(false);

    var data = {
      visiblegroup: visibleGroup,
      isedit: isEdit,
      groupid: groupId,
    };

    GroupServices.postManageGroup(data)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        getAllDetails(); //refresh the page
      })
      .catch((error: any) => {
        console.log(error, 'error');
      });
  };

  // function for close modal on delete group click
  const handleManageGroupDeleteClick = () => {
    setManageGroupModal(false);
    setDeleteModal(true);
  };

  // function for delete button click on api call to delete group
  const handleDelete = () => {
    setDeleteModal(false);
    GroupServices.getDeleteGroup(groupId)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        if (response.data.status === 1) {
          navigation.replace('DrawerNavigator', {
            screen: 'BottomNavigator',
            params: {
              screen: 'Home',
            },
          });
        } else if (response.data.status === 0) {
          toastRef.current.getToast(response.data.message, 'warning');
        }
      })
      .catch((error: any) => {
        console.log(error, 'error');
      });
  };

  // navigation on taskName, routine and notes click
  const handleViewTaskClick = (id: number, type: any) => {
    if (type === 'T') {
      navigation.navigate('StackNavigation', {
        screen: 'TaskAllComments',
        params: {
          data: id,
        },
      });
    } else if (type === 'R') {
      navigation.navigate('StackNavigation', {
        screen: 'RoutineAllComments',
        params: {
          data: id,
          flow: 'GROUPDETAILS',
        },
      });
    } else if (type === 'N') {
      navigation.navigate('StackNavigation', {
        screen: 'NotesAllComments',
        params: {
          data: id,
        },
      });
    }
  };

  // function for close member modal
  const handleMemberIdModalClose = () => {
    setMemberIdModal(false);
  };

  // function for submit button click on api call to add member on group
  const handleMemberIdAddClick = (memberList: number[]) => {
    setMemberIdModal(false);
    setRecentlyMemberLoader(true);

    const feedBackData = new FormData();
    feedBackData.append('group_id', groupId);
    memberList.map((e: number, index: any) => {
      feedBackData.append(`user_id[${index}]`, e);
    });

    GroupServices.postAddMembers(feedBackData)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        getRecentlyAddMembers(); // refresh the member list
        getAllDetails(); // refresh the page for member count
      })
      .catch((error: any) => {
        setRecentlyMemberLoader(false);
        console.log('error', JSON.stringify(error));
      });
  };

  // function for submit button click on api call to remove members from group
  const handleRemoveMemberIdSubmitClick = (memberList: number[]) => {
    Keyboard.dismiss();

    setRemoveMemberIdModal(false);
    const data = new FormData();
    data.append('groupid', groupId);
    memberList.map((e: number, index: any) => {
      data.append(`deletemembers[${index}]`, e);
    });

    GroupServices.postGroupMembersDelete(data)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        getRecentlyAddMembers(); // refresh the member list
        getAllDetails(); // refresh the page for member count
      })
      .catch((error: any) => {
        setRecentlyMemberLoader(false);
        console.log('error', JSON.stringify(error));
      });
  };

  // list for added task
  const renderAddedTasks = ({item}: {item: any; index: any}) => {
    return (
      <AddedTaskTab
        items={item}
        viewTaskClicks={handleViewTaskClick}
        onTaskTabClick={handleTaskTabClick}
        myUserId={myUserId}
        isEdit={groupDetails?.is_edit}
      />
    );
  };

  // navigation on taskName, routine and notes click
  const handleTaskTabClick = (taskData: any) => {
    {
      taskData?.task_type === 'T'
        ? navigation.navigate('StackNavigation', {
            screen: 'TaskDetails',
            params: {id: taskData?.id},
          })
        : taskData?.task_type === 'R'
        ? navigation.navigate('StackNavigation', {
            screen: 'RoutineDetails',
            params: {id: taskData?.id},
          })
        : taskData?.task_type === 'N'
        ? navigation.navigate('StackNavigation', {
            screen: 'NotesDetails',
            params: {id: taskData?.id},
          })
        : taskData?.task_type === 'A'
        ? navigation.navigate('StackNavigation', {
            screen: 'AppointmentDetail',
            params: {data: taskData?.id},
          })
        : null;
    }
  };

  // function for close modal on edit group close click
  const handleEditGroupModalClose = () => {
    setEditGroupNameModal(false);
  };

  // function for submit button click on api call to edit the group name
  const handleEditGroupSubmitClick = (
    editedGroupName: string,
    profileImage: any,
  ) => {
    setEditGroupNameModal(false);
    const data = new FormData();
    if (profileImage != '') {
      const imageName = profileImage.path.slice(
        profileImage.path.lastIndexOf('/'),
        profileImage.path.length,
      );
      data.append('groupimage', {
        name: imageName,
        type: profileImage.mime,
        uri: profileImage.path,
      });
    }
    data.append('groupid', groupId);
    data.append('editgroupname', editedGroupName);

    GroupServices.postEditGroupName(data)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        getAllDetails(); // refresh the page
      })
      .catch((error: any) => {
        console.log(error, 'error');
      });
  };

  // navigation for add new task in group
  const handleAddNewTask = () => {
    navigation.navigate('StackNavigation', {
      screen: 'CreateTask',
      params: {
        flow: 'AddNewTask',
        data: groupId,
        groupName: groupName,
      },
    });
  };

  // list for recently added members
  const renderAddedMembers = ({item}: {item: any; index: any}) => {
    return <RecentlyAddedMembersTab item={item} />;
  };

  return (
    <View style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={groupName}
        backButton={{
          visible: true,
          onClick: () => {
            navigation.goBack();
          },
        }}
      />
      {groupDetails?.groupCreatedBy == myUserId ? (
        <TouchableOpacity
          style={styles.settingIconContainer}
          onPress={() => {
            setManageGroupModal(true);
          }}>
          <Image
            resizeMode="contain"
            style={{height: 18, width: 18}}
            source={require('../../assets/pngImage/settingWhite.png')}
          />
        </TouchableOpacity>
      ) : null}

      {/* body section */}
      {!pageLoader ? (
        <View style={styles.body}>
          {/* group details  */}
          <View style={styles.profileContainer}>
            <View style={styles.nameContainer}>
              <Text style={styles.nameText}>{groupName}</Text>

              {/* edit icon basis of user id match*/}
              {groupDetails?.groupCreatedBy == myUserId ? (
                <TouchableOpacity
                  style={styles.editIconContainer}
                  onPress={() => {
                    setEditGroupNameModal(true);
                  }}>
                  <Image
                    resizeMode="contain"
                    style={{height: 18, width: 18}}
                    source={require('../../assets/pngImage/editIcon.png')}
                  />
                </TouchableOpacity>
              ) : null}

              <View style={styles.direction}>
                <Text style={styles.emailText}>Total group members:</Text>
                <Text style={styles.emailText}>
                  {groupDetails?.totalgroupmembers}
                </Text>
              </View>

              {/* add members basis of user id match*/}
              {groupDetails?.groupCreatedBy == myUserId ? (
                <TouchableOpacity
                  onPress={() => {
                    setMemberIdModal(true);
                  }}
                  style={styles.addMembersContainer}>
                  <Image
                    resizeMode="contain"
                    style={styles.icon}
                    source={require('../../assets/pngImage/UserPlus.png')}
                  />

                  <Text style={styles.addMemberText}>Add Members</Text>
                  {/* {userType == '3' ? 'Add Employee' : 'Add Members'} */}
                </TouchableOpacity>
              ) : null}
            </View>

            {/* group image  */}
            {groupDetails?.groupimage ? (
              <View style={styles.groupImageContainer}>
                <Image
                  style={styles.image}
                  resizeMode="cover"
                  source={{uri: `${groupDetails?.groupimage}`}}
                />
              </View>
            ) : (
              <View style={styles.noGroupImageContainer}>
                <View style={styles.noGroupImage}>
                  <Image
                    style={{width: '100%', height: '100%'}}
                    resizeMode="cover"
                    source={require('../../assets/pngImage/noImage.png')}
                  />
                </View>
              </View>
            )}
          </View>

          {/*recently added members and remove members  */}
          <View style={styles.textDirection}>
            <Text style={styles.preferenceText}>Added Members</Text>

            {/* remove members basis of user id match*/}
            {groupDetails?.groupCreatedBy == myUserId ? (
              <TouchableOpacity
                onPress={() => {
                  setRemoveMemberIdModal(true);
                }}>
                <Text style={styles.addEditText}>Remove Members</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {recentlyAddedMemberList?.length > 0 ? (
            !recentlyMemberLoader ? (
              <View style={{height: '16%'}}>
                <FlatList
                  data={recentlyAddedMemberList}
                  renderItem={renderAddedMembers}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item: any, index: any) => String(index)}
                />
              </View>
            ) : (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={colors.THEME_ORANGE} />
              </View>
            )
          ) : (
            <View style={styles.noMembersContainer}>
              <Text style={styles.noMembersText}>No members added</Text>
            </View>
          )}

          {/* Task section  */}
          <View style={styles.textDirection}>
            <Text style={styles.preferenceText}>Tasks</Text>

            {/* add task option based on user type  */}
            {userType == '1' ? (
              <>
                {/* add new task basis of user id match*/}
                {groupDetails?.groupCreatedBy == myUserId &&
                groupDetails?.is_edit == 'false' ? (
                  <TouchableOpacity
                    onPress={() => {
                      handleAddNewTask();
                    }}>
                    <Text style={styles.addEditText}>Add New Task</Text>
                  </TouchableOpacity>
                ) : null}
              </>
            ) : null}
          </View>

          {allTask?.length > 0 ? (
            <View
              style={{
                height: '52%',
                paddingBottom: 10,
              }}>
              <FlatList
                data={allTask}
                renderItem={renderAddedTasks}
                keyExtractor={(item: any, index: any) => String(index)}
              />
            </View>
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>
                No task added here. {'\n'}Click on the "Add New Task" to create
                a task.
              </Text>
            </View>
          )}

          {/* create task notes and routine icon  */}
          {userType == '1' ? null : (
            <>
              {groupDetails?.is_edit == 'false' ? (
                <View style={styles.createIconContainer}>
                  <AddTaskNotesRoutineButton
                    navigation={navigation}
                    groupId={groupId}
                  />
                </View>
              ) : null}
            </>
          )}

          {/* edit group name  */}
          <EditGroupNameModal
            groupNameData={groupName}
            groupImage={groupDetails?.groupimage}
            visibleModal={editGroupNameModal}
            onClose={handleEditGroupModalClose}
            onSubmitClick={handleEditGroupSubmitClick}
          />

          {/* manage group modal  */}
          <ManageGroupModal
            visibleModal={manageGroupModal}
            groupId={groupDetails?.id}
            isGroupEnabled={groupDetails?.visiblegroup}
            isEditingEnabled={groupDetails?.is_edit}
            onClose={handleManageGroupModalClose}
            onSubmitClick={handleManageGroupSubmitClick}
            onDeleteClick={handleManageGroupDeleteClick}
          />

          {/* Member Email Id modal  */}
          <AddMemberOnGroupModal
            visibleModal={memberIdModal}
            onClose={handleMemberIdModalClose}
            onSubmitClick={handleMemberIdAddClick}
            navigation={navigation}
          />

          {/* Remove Member from group modal  */}
          <RemoveGroupMemberModal
            visibleModal={removeMemberIdModal}
            onClose={() => {
              setRemoveMemberIdModal(false);
            }}
            onSubmitClick={handleRemoveMemberIdSubmitClick}
            navigation={navigation}
            groupId={groupId}
            myUserId={myUserId}
          />

          {/* Delete alert modal  */}
          <DeleteAlertModal
            visibleModal={deleteModal}
            onRequestClosed={() => {
              setDeleteModal(false);
            }}
            onPressRightButton={() => {
              handleDelete();
            }}
            subHeading={'Are you sure you want to delete this group ?'}
          />
        </View>
      ) : (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.THEME_ORANGE} />
        </View>
      )}

      {/* toaster message for error response from API  */}
      <CommonToast ref={toastRef} />
    </View>
  );
};

export default GroupDetails;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {
    padding: 10,
  },
  profileContainer: {
    alignItems: 'center',
    backgroundColor: colors.BLACK2,
    borderRadius: 15,
    flexDirection: 'row',
    height: 'auto',
    justifyContent: 'space-between',
    marginVertical: 10,
    padding: 10,
  },
  direction: {flexDirection: 'row'},
  nameContainer: {
    justifyContent: 'center',
    width: '75%',
  },
  nameText: {
    color: colors.THEME_ORANGE,
    fontSize: 22,
    fontWeight: 'bold',
  },
  emailText: {
    color: colors.WHITE,
    fontSize: 16,
    paddingRight: 4,
  },
  settingIconContainer: {
    alignItems: 'center',
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 50,
    height: 40,
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
    top: Platform.OS === 'ios' ? 50 : 35,
    width: 40,
  },
  editIconContainer: {
    alignItems: 'center',
    backgroundColor: colors.BLACK3,
    borderRadius: 50,
    height: 30,
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    top: -5,
    width: 30,
  },
  addMembersContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 5,
    width: 140,
  },
  textDirection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  preferenceText: {
    color: colors.WHITE,
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    paddingVertical: 5,
  },
  addMemberText: {
    color: colors.THEME_ORANGE,
    fontSize: 16,
    paddingHorizontal: 5,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
  },
  addEditText: {
    color: colors.THEME_ORANGE,
    fontSize: 16,
  },
  image: {
    borderRadius: 50,
    height: '100%',
    width: '100%',
  },
  groupImageContainer: {
    borderColor: colors.THEME_WHITE,
    borderRadius: 50,
    borderWidth: 1,
    height: 80,
    right: 0,
    width: 80,
  },
  noGroupImageContainer: {
    alignItems: 'center',
    backgroundColor: colors.GRAY,
    borderColor: colors.THEME_WHITE,
    borderRadius: 50,
    borderWidth: 1,
    height: 90,
    justifyContent: 'center',
    width: 90,
  },
  noGroupImage: {
    height: 40,
    width: 35,
  },
  loaderContainer: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  noDataContainer: {
    alignItems: 'center',
    height: '52%',
    justifyContent: 'center',
  },
  noDataText: {
    color: colors.WHITE,
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
  noMembersContainer: {
    alignContent: 'center',
    alignItems: 'center',
    height: '16%',
    justifyContent: 'center',
  },
  noMembersText: {
    color: colors.THEME_BLACK,
    fontSize: 16,
    fontWeight: '500',
    padding: 20,
  },
  createIconContainer: {
    alignItems: 'center',
    borderRadius: 100,
    bottom: 60,
    height: 60,
    justifyContent: 'center',
    position: 'absolute',
    right: -20,
    width: 60,
    zIndex: 1,
  },
  createIconImage: {
    borderRadius: 100,
    height: 25,
    width: 25,
  },
  icon: {
    height: 20,
    width: 20,
    tintColor: colors.THEME_ORANGE,
  },
});
