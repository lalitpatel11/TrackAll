//external imports
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useRef, useState} from 'react';
import moment from 'moment';
//internal imports
import AddedTimeTab from './AddedTimeTab';
import AllTimeWithComplete from './AllTimeWithComplete';
import CommentsOnRoutine from '../routine/CommentsOnRoutine';
import CommonToast from '../../constants/CommonToast';
import CustomHeader from '../../constants/CustomHeader';
import DeleteAlertModal from './DeleteAlertModal';
import GroupServices from '../../service/GroupServices';
import NotesImages from '../notes/NotesImages';
import RecentlyAddedMembersTab from './RecentlyAddedMembersTab';
import {colors} from '../../constants/ColorConstant';

const TaskDetails = ({navigation, route}: {navigation: any; route: any}) => {
  const [commentCount, setCommentCount] = useState(0);
  const [deleteModal, setDeleteModal] = useState(false);
  const [markCompleteModal, setMarkCompleteModal] = useState(false);
  const [markInCompleteModal, setMarkInCompleteModal] = useState(false);
  const [myUserId, setMyUserId] = useState<any>();
  const [pageLoader, setPageLoader] = useState(false);
  const [taskComments, setTaskComments] = useState<any[]>([]);
  const [taskDetails, setTaskDetails] = useState({});
  const [taskId, setTaskId] = useState(route?.params?.id);
  const [timeValue, setTimeValue] = useState('');
  const toastRef = useRef<any>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setTaskId(route?.params?.id);
      getData();
      getComments();
    });
    return unsubscribe;
  }, [navigation]);

  // function for get all task details on api call
  const getData = async () => {
    // user id for delete and edit icon
    const token = await AsyncStorage.getItem('userId');
    setMyUserId(token);

    setPageLoader(true);
    GroupServices.getTasksDetails(taskId)
      .then((response: any) => {
        setPageLoader(false);
        setTaskDetails(response.data.taskdetails);
      })
      .catch((error: any) => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // function for get all comments data on api call
  const getComments = () => {
    const data = {
      taskid: taskId,
      tasktype: 'T',
    };
    GroupServices.postAllCommentsOnTask(data)
      .then((response: any) => {
        setTaskComments(response.data.taskdetails.commentdetails);
        setCommentCount(response.data.taskdetails.commentsCount);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  // navigation on task details on tab click
  const handleViewCommentsClick = (id: number) => {
    navigation.navigate('StackNavigation', {
      screen: 'TaskAllComments',
      params: {
        data: id,
        flow: 'TASKDETAILS',
      },
    });
  };

  // list for comments on task details
  const renderCommentsRoutine = ({item}: {item: any; index: any}) => {
    return (
      <CommentsOnRoutine
        data={item}
        viewCommentsClick={handleViewCommentsClick}
        routineId={taskDetails?.id}
      />
    );
  };

  // list for images on task details
  const renderAddedTaskImages = ({item}: {item: any; index: any}) => {
    return <NotesImages notesImages={item} />;
  };

  // list for added time on task details
  const renderAddedTime = ({item}: {item: any; index: any}) => {
    return <AddedTimeTab items={item} />;
  };

  // list for all time with on task details
  const renderAddedTimeWithComplete = ({item}: {item: any; index: any}) => {
    return (
      <AllTimeWithComplete
        items={item}
        handleMarkComplete={handleMarkComplete}
        handleMarkInComplete={handleMarkInComplete}
      />
    );
  };

  // function for delete button click on api call to delete task
  const handleDelete = () => {
    setDeleteModal(false);
    GroupServices.getDeleteTask(taskId)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        navigation.goBack();
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  // function for open modal on mark complete icon click
  const handleMarkComplete = (value: string) => {
    setMarkCompleteModal(true);
    setTimeValue(value);
  };

  // function for close modal on mark complete icon click api call
  const handleCompleteTask = () => {
    setMarkCompleteModal(false);
    const data = {
      taskid: taskId,
      time: timeValue,
    };
    GroupServices.postCompleteTask(data)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        navigation.goBack();
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  // function for open modal on mark in complete icon click
  const handleMarkInComplete = (value: string) => {
    setMarkInCompleteModal(true);
    setTimeValue(value);
  };

  // function for close modal on mark incomplete icon click api call
  const handleInCompleteTask = () => {
    setMarkInCompleteModal(false);
    const data = {
      taskid: taskId,
      time: timeValue,
    };
    GroupServices.postInCompleteTask(data)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        navigation.goBack();
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  // list for recently added member click
  const renderAddedMembers = ({item}: {item: any; index: any}) => {
    return <RecentlyAddedMembersTab item={item} />;
  };

  return (
    <View style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Task Details'}
        backButton={{
          visible: true,
          onClick: () => {
            navigation.goBack();
          },
        }}
      />

      {/* body section */}
      {!pageLoader ? (
        <View style={styles.body}>
          {/* details container */}
          <View style={styles.detailsContainer}>
            <View style={styles.direction}>
              {/* title and sub priority section  */}
              <View style={styles.titleContainer}>
                <Text style={styles.taskName}>{taskDetails?.name}</Text>
                {taskDetails?.priority === 'H' ? (
                  <Text style={styles.priority}>High</Text>
                ) : taskDetails?.priority === 'M' ? (
                  <Text style={styles.priority}>Medium</Text>
                ) : taskDetails?.priority === 'L' ? (
                  <Text style={styles.priority}>Low</Text>
                ) : null}
              </View>

              {/* display complete, edit and delete icon basis of customer id match  */}
              <View style={styles.iconsContainer}>
                {myUserId == taskDetails?.taskCreatedBy ? (
                  <View style={styles.direction}>
                    {/* edit icon  */}
                    <TouchableOpacity
                      style={styles.editContainer}
                      onPress={() => {
                        navigation.navigate('StackNavigation', {
                          screen: 'EditTask',
                          params: {
                            data: taskDetails,
                          },
                        });
                      }}>
                      <Image
                        resizeMode="contain"
                        style={{width: 18, height: 18}}
                        source={require('../../assets/pngImage/editIcon.png')}
                      />
                    </TouchableOpacity>

                    {/* delete icon  */}
                    <TouchableOpacity
                      style={styles.editContainer}
                      onPress={() => {
                        setDeleteModal(true);
                      }}>
                      <Image
                        resizeMode="contain"
                        style={{width: 18, height: 18}}
                        source={require('../../assets/pngImage/Trash.png')}
                      />
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            </View>

            {/* date time section  */}
            <View style={styles.dateTimeContainer}>
              <View style={styles.direction}>
                <Image
                  resizeMode="contain"
                  tintColor={colors.WHITE}
                  style={{height: 15, width: 15}}
                  source={require('../../assets/pngImage/CalendarBlank.png')}
                />
                <Text style={styles.date}>
                  {moment(taskDetails?.datetime).format('MM-DD-YYYY')}
                </Text>
              </View>

              {/* time section  */}
              {myUserId == taskDetails?.taskCreatedBy ? (
                <FlatList
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  data={taskDetails?.time}
                  renderItem={renderAddedTimeWithComplete}
                  keyExtractor={(item: any, index: any) => String(index)}
                />
              ) : (
                <FlatList
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  data={taskDetails?.time}
                  renderItem={renderAddedTime}
                  keyExtractor={(item: any, index: any) => String(index)}
                />
              )}

              {/* description section  */}
              {taskDetails?.description ? (
                <View style={styles.descriptionContainer}>
                  <ScrollView nestedScrollEnabled={true}>
                    <Text style={styles.descriptionText}>
                      {taskDetails?.description}
                    </Text>
                  </ScrollView>
                </View>
              ) : null}

              {/* task image section  */}
              {taskDetails?.taskimages?.length > 0 ? (
                <View style={{marginVertical: 10}}>
                  <FlatList
                    data={taskDetails?.taskimages}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderAddedTaskImages}
                    keyExtractor={(item: any, index: any) => String(index)}
                  />
                </View>
              ) : null}
            </View>
          </View>

          <Text style={styles.commentCount}>Assigned Members</Text>

          {taskDetails?.taskassignmembers?.length > 0 ? (
            <View style={{height: 'auto'}}>
              <FlatList
                data={taskDetails?.taskassignmembers}
                renderItem={renderAddedMembers}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item: any, index: any) => String(index)}
              />
            </View>
          ) : (
            <View style={styles.noMembersContainer}>
              <Text style={styles.noMembersText}>No members assigned</Text>
            </View>
          )}

          {/* Comments section */}
          <View style={styles.commentLabelContainer}>
            <Text style={styles.commentCount}>Comments ({commentCount})</Text>
            <TouchableOpacity
              style={styles.createRoutineContainer}
              onPress={() => {
                navigation.navigate('StackNavigation', {
                  screen: 'TaskAllComments',
                  params: {
                    data: taskDetails?.id,
                    flow: 'TASKDETAILS',
                  },
                });
              }}>
              <Text style={styles.createRoutineText}> Add Comment</Text>
              <View style={styles.createRoutineIcon}>
                <Image
                  resizeMode="contain"
                  style={styles.image}
                  source={require('../../assets/pngImage/editIcon.png')}
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* other users comments on this task*/}
          {taskComments?.length > 0 ? (
            <View style={styles.commentContainer}>
              <FlatList
                data={taskComments}
                scrollEnabled={false}
                renderItem={renderCommentsRoutine}
                keyExtractor={(item: any, index: any) => String(index)}
              />

              {/* view all comments  */}
              <TouchableOpacity
                style={styles.createRoutineContainer}
                onPress={() => {
                  navigation.navigate('StackNavigation', {
                    screen: 'TaskAllComments',
                    params: {
                      data: taskDetails?.id,
                      flow: 'TASKDETAILS',
                    },
                  });
                }}>
                <Text style={styles.createRoutineText}>View All Comments</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.noCommentContainer}>
              <Image
                resizeMode="contain"
                style={styles.noCommentImage}
                tintColor={colors.WHITE}
                source={require('../../assets/pngImage/noCommentImage.png')}
              />
              <Text style={styles.noCommentText}>No Comments Available!</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.THEME_ORANGE} />
        </View>
      )}

      {/* Delete alert modal for delete task */}
      <DeleteAlertModal
        visibleModal={deleteModal}
        onRequestClosed={() => {
          setDeleteModal(false);
        }}
        onPressRightButton={() => {
          handleDelete();
        }}
        subHeading={'Are you sure you want to delete this task ?'}
      />

      {/* Delete alert modal for task mark complete */}
      <DeleteAlertModal
        visibleModal={markCompleteModal}
        onRequestClosed={() => {
          setMarkCompleteModal(false);
        }}
        onPressRightButton={handleCompleteTask}
        subHeading={'Are you sure you want to complete this task ?'}
      />

      {/* Delete alert modal for task mark complete */}
      <DeleteAlertModal
        visibleModal={markInCompleteModal}
        onRequestClosed={() => {
          setMarkInCompleteModal(false);
        }}
        onPressRightButton={handleInCompleteTask}
        subHeading={'Are you sure you want to incomplete this task ?'}
      />

      {/* toaster message for error response from API */}
      <CommonToast ref={toastRef} />
    </View>
  );
};
export default TaskDetails;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {
    margin: 10,
    padding: 10,
  },
  detailsContainer: {
    backgroundColor: colors.BLACK3,
    borderRadius: 15,
    marginBottom: 10,
    padding: 10,
  },
  direction: {
    flexDirection: 'row',
  },
  titleContainer: {
    height: 'auto',
    width: '80%',
  },
  taskName: {
    color: colors.THEME_ORANGE,
    fontSize: 16,
    fontWeight: '500',
  },
  priority: {
    color: colors.WHITE,
    fontSize: 12,
    fontWeight: '400',
    paddingVertical: 5,
  },
  iconsContainer: {
    height: 30,
    width: '20%',
  },
  editContainer: {
    alignItems: 'center',
    borderRadius: 50,
    justifyContent: 'center',
    marginHorizontal: 3,
    padding: 3,
  },
  dateTimeContainer: {
    marginVertical: 3,
    width: '95%',
  },
  date: {
    color: colors.WHITE,
    fontSize: 12,
    marginBottom: 5,
    paddingLeft: 5,
  },
  descriptionContainer: {
    height: 'auto',
    marginVertical: 10,
    maxHeight: 130,
    padding: 10,
  },
  descriptionText: {
    color: colors.WHITE,
    fontSize: 14,
    textAlign: 'justify',
  },
  commentLabelContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  commentCount: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '400',
    paddingVertical: 10,
  },
  createRoutineContainer: {
    alignItems: 'center',
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 20,
    flexDirection: 'row',
    height: 32,
    justifyContent: 'center',
    width: 127,
  },
  createRoutineIcon: {
    backgroundColor: colors.WHITE,
    borderRadius: 50,
    height: 24,
    padding: 3,
    width: 24,
  },
  image: {
    borderRadius: 50,
    height: '100%',
    width: '100%',
  },
  createRoutineText: {
    color: colors.WHITE,
    fontSize: 12,
    fontWeight: '400',
    paddingRight: 5,
  },
  commentContainer: {height: '45%'},
  noCommentContainer: {
    alignContent: 'center',
    alignItems: 'center',
    height: '40%',
    justifyContent: 'center',
  },
  noCommentImage: {
    height: 135,
    width: 135,
  },
  noCommentText: {
    color: colors.THEME_BLACK,
    fontSize: 18,
    fontWeight: '400',
    padding: 20,
  },
  submitButtonContainer: {marginVertical: 20},
  loaderContainer: {
    alignSelf: 'center',
    height: '83%',
    justifyContent: 'center',
  },
  noMembersContainer: {
    alignContent: 'center',
    alignItems: 'center',
    height: 'auto',
    justifyContent: 'center',
  },
  noMembersText: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '400',
    padding: 20,
  },
});
