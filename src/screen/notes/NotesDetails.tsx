//external imports
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useRef, useState} from 'react';
import moment from 'moment';
//external imports
import CommentsOnRoutine from '../routine/CommentsOnRoutine';
import CommonToast from '../../constants/CommonToast';
import CustomHeader from '../../constants/CustomHeader';
import DeleteAlertModal from '../groups/DeleteAlertModal';
import GroupServices from '../../service/GroupServices';
import ManageNotesModal from './ManageNotesModal';
import NotesImages from './NotesImages';
import NotesService from '../../service/NotesService';
import ShareNotesModal from './ShareNotesModal';
import ShareNotesSuccessModal from './ShareNotesSuccessModal';
import SharedNotesTab from './SharedNotesTab';
import {colors} from '../../constants/ColorConstant';

const NotesDetails = ({route, navigation}: {route: any; navigation: any}) => {
  const [buttonLoader, setButtonLoader] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [deleteGroupModal, setDeleteGroupModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [groupCount, setGroupCount] = useState(0);
  const [groupId, setGroupId] = useState(0);
  const [manageEditModal, setManageEditModal] = useState(false);
  const [myUserId, setMyUserId] = useState<any>();
  const [notesComments, setNotesComments] = useState<any[]>([]);
  const [notesDetails, setNotesDetails] = useState({});
  const [notesId, setNotesId] = useState(route?.params?.id);
  const [notesImages, setNotesImages] = useState([]);
  const [pageLoader, setPageLoader] = useState(false);
  const [shareNotesModal, setShareNotesModal] = useState(false);
  const [sharedGroups, setSharedGroups] = useState([]);
  const [sharedNotesSuccessModal, setSharedNotesSuccessModal] = useState(false);
  const toastRef = useRef<any>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setNotesId(route?.params?.id);
      getData();
      getComments();
    });
    return unsubscribe;
  }, [navigation]);

  // function for get all noted details data on api call
  const getData = async () => {
    // user id for delete and edit icon
    const token = await AsyncStorage.getItem('userId');
    setMyUserId(token);

    setPageLoader(true);
    NotesService.getNotesDetails(notesId)
      .then((response: any) => {
        setPageLoader(false);
        setNotesDetails(response?.data?.notesdetail);
        setNotesImages(response?.data?.notesdetail?.imagedetails);
        setSharedGroups(response?.data?.notesdetail?.groupdetails);
      })
      .catch((error: any) => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // function for get all comments data on api call
  const getComments = () => {
    const data = {
      taskid: notesId,
      tasktype: 'N',
    };
    GroupServices.postAllCommentsOnTask(data)
      .then((response: any) => {
        setNotesComments(response?.data?.taskdetails?.commentdetails);
        setCommentCount(response?.data?.taskdetails?.commentsCount);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  // navigation on all comments screen on view comment click
  const handleViewCommentsClick = (id: number) => {
    navigation.navigate('StackNavigation', {
      screen: 'NotesAllComments',
      params: {
        data: id,
        flow: 'NOTESDETAILS',
      },
    });
  };

  // list for comments
  const renderCommentsRoutine = ({item}: {item: any; index: any}) => {
    return (
      <CommentsOnRoutine
        data={item}
        viewCommentsClick={handleViewCommentsClick}
        routineId={notesId}
      />
    );
  };

  // list for images on notes
  const renderAddedNotesImages = ({item}: {item: any; index: any}) => {
    return <NotesImages notesImages={item} />;
  };

  // function start for share notes in group
  const handleShareNotes = () => {
    setShareNotesModal(true);
  };

  // function for close modal on share note click
  const handleShareNotesModalClose = () => {
    setShareNotesModal(false);
  };

  // function for share click on api call to delete budget
  const handleShareNotesSubmitClick = (list: any[]) => {
    setButtonLoader(true);
    const feedBackData = new FormData();
    feedBackData.append('note_id', notesId);
    list.map((e: number, index: any) => {
      feedBackData.append(`group_id[${index}]`, e);
    });
    setGroupCount(list.length);

    NotesService.postShareNotes(feedBackData)
      .then((response: any) => {
        setButtonLoader(false);
        setShareNotesModal(false);
        setSharedNotesSuccessModal(true);
      })
      .catch((error: any) => {
        setButtonLoader(false);
        console.log(error);
      });
  };

  // function for close modal on success modal close click
  const handleShareRoutineSuccessModalClose = () => {
    setSharedNotesSuccessModal(false);
  };

  // function for close modal on success modal submit click
  const handleShareRoutineSuccessSubmitClick = () => {
    setSharedNotesSuccessModal(false);
    getData(); //refresh the data
  };

  // function for submit button click on api call to edit notes
  const handleManageNotesSubmitClick = (isEdit: boolean) => {
    setManageEditModal(false);
    var data = {
      isedit: isEdit,
      noteid: notesId,
    };

    NotesService.postManageNotes(data)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        getData(); //refresh the page
      })
      .catch((error: any) => {
        toastRef.current.getToast(error.response.data.message, 'error');
      });
  };

  // function for submit button click on api call to delete notes
  const handleDelete = () => {
    setDeleteModal(false);
    NotesService.getDeleteNotes(notesId)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        navigation.goBack();
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  // list for shared notes
  const renderShareNotes = ({item}: {item: any; index: any}) => {
    return <SharedNotesTab items={item} onDeleteClick={handleDeleteGroup} />;
  };

  // function for open modal on delete group
  const handleDeleteGroup = (id: number) => {
    setDeleteGroupModal(true);
    setGroupId(id);
  };

  // function for delete button click on api call to delete notes
  const handleShareNotesDeleteClick = () => {
    setDeleteGroupModal(false);
    const data = {
      note_id: notesId,
      groupid: groupId,
    };
    NotesService.postRemoveShareNotes(data)
      .then((response: any) => {
        getData(); //refresh the data
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      {/* header section  */}
      <CustomHeader
        headerText={'Notes Details'}
        backButton={{
          visible: true,
          onClick: () => {
            navigation.goBack();
          },
        }}
      />

      {/* display setting icon basis of customer id match  */}
      {myUserId == notesDetails?.Created_by ? (
        <TouchableOpacity
          style={styles.settingIconContainer}
          onPress={() => {
            setManageEditModal(true);
          }}>
          <Image
            resizeMode="contain"
            style={{height: 18, width: 18}}
            source={require('../../assets/pngImage/settingWhite.png')}
          />
        </TouchableOpacity>
      ) : null}

      {/* body section */}
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        {!pageLoader ? (
          <View style={styles.body}>
            <View style={styles.detailsContainer}>
              <View style={styles.direction}>
                {/* notes name section  */}
                <View style={styles.notesTitleContainer}>
                  <Text style={styles.notesTitle}>
                    {notesDetails?.notes_title}
                  </Text>
                </View>

                {/* display share, edit and delete icon basis of customer id match  */}
                <View style={styles.iconsContainer}>
                  {/* share icon */}
                  {myUserId == notesDetails?.Created_by ? (
                    <TouchableOpacity
                      onPress={() => {
                        handleShareNotes();
                      }}
                      style={styles.editContainer}>
                      <Image
                        resizeMode="contain"
                        style={{
                          height: 18,
                          width: 18,
                          tintColor: colors.THEME_ORANGE,
                        }}
                        source={require('../../assets/pngImage/ShareIcon.png')}
                      />
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.editContainer} />
                  )}

                  {/* edit icon based on user id match and isEdit true*/}
                  {notesDetails?.is_edit == 'true' ? (
                    <TouchableOpacity
                      style={styles.editContainer}
                      onPress={() => {
                        navigation.navigate('StackNavigation', {
                          screen: 'EditNotes',
                          params: {
                            data: notesDetails,
                          },
                        });
                      }}>
                      <Image
                        resizeMode="contain"
                        style={{height: 18, width: 18}}
                        source={require('../../assets/pngImage/editIcon.png')}
                      />
                    </TouchableOpacity>
                  ) : myUserId == notesDetails?.Created_by ? (
                    <TouchableOpacity
                      style={styles.editContainer}
                      onPress={() => {
                        navigation.navigate('StackNavigation', {
                          screen: 'EditNotes',
                          params: {
                            data: notesDetails,
                          },
                        });
                      }}>
                      <Image
                        style={{height: 18, width: 18}}
                        resizeMode="contain"
                        source={require('../../assets/pngImage/editIcon.png')}
                      />
                    </TouchableOpacity>
                  ) : null}

                  {/* delete icon */}
                  {myUserId == notesDetails?.Created_by ? (
                    <TouchableOpacity
                      style={styles.editContainer}
                      onPress={() => {
                        setDeleteModal(true);
                      }}>
                      <Image
                        style={{height: 18, width: 18}}
                        resizeMode="contain"
                        source={require('../../assets/pngImage/Trash.png')}
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>

              {/* date time section */}
              <View style={styles.dateTimeContainer}>
                <View style={styles.direction}>
                  <Image
                    resizeMode="contain"
                    style={{
                      height: 15,
                      width: 15,
                      tintColor: colors.THEME_ORANGE,
                    }}
                    source={require('../../assets/pngImage/CalendarBlank1.png')}
                  />
                  <Text style={styles.date}>
                    {moment(notesDetails?.datetime).format('ddd DD')}
                  </Text>
                </View>
              </View>

              {/* last edit by and edit date if available */}
              {notesDetails?.modifiedby !== '' ? (
                <>
                  <View style={styles.direction}>
                    <Text style={styles.createRoutineText}>
                      Last modified by:
                    </Text>
                    <Text style={styles.descriptionText}>
                      {notesDetails?.modifiedby}
                    </Text>
                  </View>
                  <View style={styles.direction}>
                    <Text style={styles.createRoutineText}>
                      Last modified date:
                    </Text>
                    <Text style={styles.descriptionText}>
                      {notesDetails?.editdate}
                    </Text>
                  </View>
                </>
              ) : null}

              {/* description section  */}
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionText}>
                  {notesDetails?.notes_text}
                </Text>
              </View>

              {/* notes image section  */}
              {notesImages?.length >= 0 ? (
                <View>
                  <FlatList
                    data={notesImages}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderAddedNotesImages}
                    keyExtractor={(item: any, index: any) => String(index)}
                  />
                </View>
              ) : null}
            </View>

            {/* View notes history   ///////for future use  */}
            {/* <TouchableOpacity
              style={{width: 90}}
              onPress={() => {
                navigation.navigate('StackNavigation', {
                  screen: 'NotesHistory',
                  params: {
                    data: notesId,
                    flow: 'NOTESDETAILS',
                  },
                });
              }}>
              <Text style={styles.createRoutineText}>View history</Text>
            </TouchableOpacity> */}

            {/* shared group count section  */}
            {notesDetails?.groupcount > 0 ? (
              <View style={styles.commentLabelContainer}>
                {notesDetails?.groupcount === 1 ? (
                  <Text style={styles.sharedText}>
                    Note shared with {notesDetails?.groupcount} group
                  </Text>
                ) : (
                  <Text style={styles.sharedText}>
                    Note shared with {notesDetails?.groupcount} groups
                  </Text>
                )}
              </View>
            ) : (
              <Text style={styles.sharedText}>No sharing yet</Text>
            )}

            <View style={styles.sharedGroupList}>
              <FlatList
                data={sharedGroups}
                renderItem={renderShareNotes}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item: any, index: any) => String(index)}
              />
            </View>

            {/* Comments section */}
            <View style={styles.commentLabelContainer}>
              <Text style={styles.commentCount}>Comments ({commentCount})</Text>
              <TouchableOpacity
                style={styles.createRoutineContainer}
                onPress={() => {
                  navigation.navigate('StackNavigation', {
                    screen: 'NotesAllComments',
                    params: {
                      data: notesId,
                      flow: 'NOTESDETAILS',
                    },
                  });
                }}>
                <View style={styles.createRoutineIcon}>
                  <Image
                    resizeMode="contain"
                    style={styles.image}
                    source={require('../../assets/pngImage/Plus.png')}
                  />
                </View>
                <Text style={styles.createRoutineText}>Add Comment</Text>
              </TouchableOpacity>
            </View>

            {/* other users comments on this task*/}
            {notesComments?.length > 0 ? (
              <View style={styles.commentContainer}>
                <FlatList
                  data={notesComments}
                  scrollEnabled={false}
                  renderItem={renderCommentsRoutine}
                  keyExtractor={(item: any, index: any) => String(index)}
                />
                {/* view all comments  */}
                <TouchableOpacity
                  style={{width: 140}}
                  onPress={() => {
                    navigation.navigate('StackNavigation', {
                      screen: 'NotesAllComments',
                      params: {
                        data: notesId,
                        flow: 'NOTESDETAILS',
                      },
                    });
                  }}>
                  <Text style={styles.createRoutineText}>
                    View All Comments
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.noCommentContainer}>
                <Text style={styles.noCommentText}>No Comments Available</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.THEME_ORANGE} />
          </View>
        )}
      </ScrollView>

      {/* Delete alert modal for note delete*/}
      <DeleteAlertModal
        visibleModal={deleteModal}
        onRequestClosed={() => {
          setDeleteModal(false);
        }}
        onPressRightButton={() => {
          handleDelete();
        }}
        subHeading={'Are you sure you want to delete this note ?'}
      />

      {/* Delete alert modal for remove group sharing */}
      <DeleteAlertModal
        visibleModal={deleteGroupModal}
        onRequestClosed={() => {
          setDeleteGroupModal(false);
        }}
        onPressRightButton={() => {
          handleShareNotesDeleteClick();
        }}
        subHeading={'Are you sure you want to remove this group ?'}
      />

      {/* Share Notes Modal */}
      <ShareNotesModal
        buttonLoader={buttonLoader}
        visibleModal={shareNotesModal}
        onClose={handleShareNotesModalClose}
        onSubmitClick={handleShareNotesSubmitClick}
        notesData={notesDetails}
      />

      {/* Share Notes Success Modal */}
      <ShareNotesSuccessModal
        groupCount={groupCount}
        visibleModal={sharedNotesSuccessModal}
        onClose={handleShareRoutineSuccessModalClose}
        onSubmitClick={handleShareRoutineSuccessSubmitClick}
      />

      {/* manage group modal */}
      <ManageNotesModal
        visibleModal={manageEditModal}
        isEditingEnabled={notesDetails?.is_edit}
        onClose={() => setManageEditModal(false)}
        onSubmitClick={handleManageNotesSubmitClick}
      />

      {/* toaster message for error response from API  */}
      <CommonToast ref={toastRef} />
    </View>
  );
};

export default NotesDetails;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {
    margin: 10,
    padding: 10,
  },
  notesTitleContainer: {width: '73%'},
  notesTitle: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '500',
  },
  date: {
    color: colors.textGray,
    fontSize: 12,
    paddingLeft: 5,
  },
  direction: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  dateTimeContainer: {
    width: '95%',
    marginVertical: 5,
  },
  iconsContainer: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    width: '26%',
  },
  imageStyle: {
    height: 20,
    paddingHorizontal: 12,
    width: 20,
  },
  editContainer: {
    alignItems: 'center',
    borderRadius: 50,
    justifyContent: 'center',
    marginHorizontal: 3,
    padding: 3,
  },
  descriptionContainer: {
    height: 'auto',
    marginVertical: 5,
    padding: 10,
  },
  descriptionText: {
    color: colors.WHITE,
    fontSize: 14,
    textAlign: 'justify',
  },
  loaderContainer: {
    alignSelf: 'center',
    height: '83%',
    justifyContent: 'center',
  },
  commentLabelContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commentCount: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
    padding: 5,
  },
  createRoutineContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  createRoutineIcon: {
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 50,
    height: 20,
    marginRight: 3,
    padding: 3,
    width: 20,
  },
  image: {
    borderRadius: 50,
    height: '100%',
    width: '100%',
  },
  createRoutineText: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
    fontWeight: '500',
    padding: 3,
  },
  sharedText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
    marginTop: 10,
    padding: 5,
  },
  sharedGroupList: {
    height: 'auto',
  },
  commentContainer: {
    height: '35%',
    marginTop: 10,
  },
  noCommentContainer: {
    alignContent: 'center',
    alignItems: 'center',
    height: '35%',
    justifyContent: 'center',
  },
  noCommentText: {
    color: colors.GRAY,
    fontSize: 18,
    fontWeight: '500',
    padding: 20,
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
  detailsContainer: {
    backgroundColor: colors.BLACK2,
    borderRadius: 15,
    marginBottom: 10,
    padding: 10,
  },
});
