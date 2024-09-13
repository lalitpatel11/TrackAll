//external imports
import {
  ActivityIndicator,
  FlatList,
  Image,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import React, {useEffect, useRef, useState} from 'react';
import moment from 'moment';
//internal imports
import AddedExpensesTab from '../expenseManagement/AddedExpensesTab';
import CommonToast from '../../constants/CommonToast';
import CustomHeader from '../../constants/CustomHeader';
import DeleteAlertModal from '../groups/DeleteAlertModal';
import GroupServices from '../../service/GroupServices';
import GroupTab from './GroupTab';
import HomeScreenService from '../../service/HomeScreenService';
import TaskTab from './TaskTab';
import {colors} from '../../constants/ColorConstant';
import EventService from '../../service/EventService';
import EventTab from '../eventManagement/EventTab';

const Home = ({navigation}: {navigation: any}) => {
  const [eventCount, setEventCount] = useState(0);
  const [groupList, setGroupList] = useState([]);
  const [hideTaskList, setHideTaskList] = useState([]);
  const [isHide, setIsHide] = useState(false);
  const [markCompleteModal, setMarkCompleteModal] = useState(false);
  const [markHideModal, setMarkHideModal] = useState(false);
  const [markInCompleteModal, setMarkInCompleteModal] = useState(false);
  const [markUnHideModal, setMarkUnHideModal] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [postCount, setPostCount] = useState(0);
  const [taskId, setTaskId] = useState(0);
  const [scheduleId, setScheduleId] = useState('');
  const [unHideTaskList, setUnHideTaskList] = useState([]);
  const [upComingExpenses, setUpComingExpenses] = useState([]);
  const [upComingEvent, setUpComingEvent] = useState<any[]>([]);

  const toastRef = useRef<any>();
  const [selectedDate, setSelectedDate] = useState(
    moment(new Date()).format('YYYY-MM-DD'),
  );

  const [region, setRegion] = useState({
    latitude: 0,
    latitudeDelta: 0.015,
    longitude: 0,
    longitudeDelta: 0.0121,
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getTask();
      getLocation();
    });
    return unsubscribe;
  }, [navigation]);

  // function for open side menu
  const handleOpenDrawer = () => {
    navigation.openDrawer();
  };

  // function for get current location data on api call
  const getLocation = async () => {
    let granted = null;
    let iosLocationPermission = null;
    if (Platform.OS === 'android') {
      granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Remindably Permission',
          message: 'Remindably needs access to your location ',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
    } else {
      iosLocationPermission = await Geolocation.requestAuthorization(
        'whenInUse',
      );
    }
    let metadata = null;
    if (
      granted === PermissionsAndroid.RESULTS.GRANTED ||
      (Platform.OS === 'ios' && iosLocationPermission == 'granted')
    ) {
      Geolocation.getCurrentPosition(
        position => {
          metadata = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          };
          setRegion(metadata);
          getData(metadata);
        },
        error => {
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }
    getData(metadata ? metadata : '');
  };

  // function for get all home details data on api call
  const getData = async (metadata?: any) => {
    try {
      // API for getting home data
      setPageLoader(true);
      const data = {
        lat: metadata ? metadata?.latitude : region.latitude,
        long: metadata ? metadata?.longitude : region.longitude,
      };

      const response = await HomeScreenService.postHomeDetails(data);
      console.log(response?.data)

      setGroupList(response?.data?.groupList);
      setPostCount(response?.data?.postcount);
      setEventCount(response?.data?.nearbyeventcounts);
    } catch (error) {
      console.log(error, 'error');
    } finally {
      setPageLoader(false);
    }
  };

  // function for get all task data on api call

  // const getTask = async () => {
  //   setPageLoader(true);
  //   const body = {
  //     date: selectedDate,
  //   };

  //   HomeScreenService.postTaskOnHome(body)
  //     .then((response: any) => {
  //       // for all incoming expenses
  //       setUpComingExpenses(response?.data?.allupcommingexpenses);
  //       setUpComingEvent(response?.data?.upcomingEvent);
  //       // for all un hide tasks
  //       var newArray = response.data.tasks.filter((e: any) => {
  //         {
  //           return e.hidestatus == '0';
  //         }
  //       });
  //       setUnHideTaskList(newArray);

  //       // for all hide tasks
  //       var newArray = response.data.tasks.filter((e: any) => {
  //         {
  //           return e.hidestatus == '1';
  //         }
  //       });
  //       setHideTaskList(newArray);
  //     })
  //     .catch(error => {
  //       console.log(error, 'error');
  //       setPageLoader(false);
  //     });
  // };

  const getTask = async () => {
    try {
      setPageLoader(true);
      const body = {
        date: selectedDate,
      };

      const response = await HomeScreenService.postTaskOnHome(body);
      setUpComingExpenses(response?.data?.allupcommingexpenses);
      setUpComingEvent(response?.data?.upcomingEvent);

      const unHiddenTasks = response.data.tasks.filter(
        (e: any) => e.hidestatus == '0',
      );
      setUnHideTaskList(unHiddenTasks);

      const hiddenTasks = response.data.tasks.filter(
        (e: any) => e.hidestatus == '1',
      );
      setHideTaskList(hiddenTasks);
    } catch (error) {
      console.log(error, 'error');
    } finally {
      setPageLoader(false);
    }
  };

  // navigation on my group, shared groups, my routine and shared routine
  const handleTabPress = (title: string) => {
    if (title === 'My Groups') {
      navigation.navigate('StackNavigation', {
        screen: 'MyGroups',
        params: {title: 'My Groups'},
      });
    } else if (title === 'Shared Groups') {
      navigation.navigate('StackNavigation', {
        screen: 'SharedGroups',
        params: {title: 'Shared Groups'},
      });
    } else if (title === 'My Routines') {
      navigation.navigate('StackNavigation', {
        screen: 'Routine',
        params: {title: 'My Routines'},
      });
    } else if (title === 'Shared Routines') {
      navigation.navigate('StackNavigation', {
        screen: 'SharedRoutines',
        params: {title: 'Shared Routines'},
      });
    } else {
    }
  };

  // list for group tab
  const renderGroupItem = ({item}: {item: any; index: any}) => {
    return <GroupTab items={item} tabPress={handleTabPress} />;
  };

  // navigation on task details and routine details
  const handleTaskTabClick = (taskData: any) => {
    {
      taskData?.tasktype === 'T'
        ? navigation.navigate('StackNavigation', {
            screen: 'TaskDetails',
            params: {id: taskData?.id},
          })
        : taskData?.tasktype === 'R'
        ? navigation.navigate('StackNavigation', {
            screen: 'RoutineDetails',
            params: {id: taskData?.id},
          })
        : null;
    }
  };

  // function for open modal on hide click
  const handleHideClick = (id: number, value: string) => {
    setMarkHideModal(true);
    setTaskId(id);
    setScheduleId(value);
  };

  // function for hide click on api call to hide task
  const handleHideYesClick = () => {
    setMarkHideModal(false);
    const data = {
      hidestatus: '1',
      scheduleid: scheduleId,
    };
    HomeScreenService.postHideTask(data)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        getTask(); //for refresh the tasks
      })
      .catch(error => {
        console.log(error, 'error');
      });
  };

  // function for open modal on unHide click
  const HandleUnHideClick = (id: number, value: string) => {
    setMarkUnHideModal(true);
    setTaskId(id);
    setScheduleId(value);
  };

  // function for unHide click on api call to unHide task
  const handleUnHideYesClick = () => {
    setMarkUnHideModal(false);
    const data = {
      hidestatus: '0',
      scheduleid: scheduleId,
    };
    HomeScreenService.postHideTask(data)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        getTask(); //for refresh the tasks
      })
      .catch(error => {
        console.log(error, 'error');
      });
  };

  // function for open modal on mark complete click
  const handleMarkComplete = (id: number, value: string) => {
    console.log(id, value);

    setMarkCompleteModal(true);
    setTaskId(id);
    setScheduleId(value);
  };

  // function for mark complete click on api call to complete task
  const handleCompleteTask = () => {
    setMarkCompleteModal(false);
    const data = {
      taskid: taskId,
      time: scheduleId,
      date: moment().format('YYYY-MM-DD'),
    };
    GroupServices.postCompleteTask(data)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        getTask(); //for refresh the tasks
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  // function for open modal on mark incomplete click
  const handleMarkInComplete = (id: number, value: string) => {
    setMarkInCompleteModal(true);
    setTaskId(id);
    setScheduleId(value);
  };

  // function for mark incomplete click on api call to incomplete task
  const handleInCompleteTask = () => {
    setMarkInCompleteModal(false);
    const data = {
      taskid: taskId,
      time: scheduleId,
      date: moment().format('YYYY-MM-DD'),
    };
    GroupServices.postInCompleteTask(data)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        getTask(); //for refresh the tasks
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  // list for added expenses
  const renderAddedExpenses = ({item}: {item: any; index: any}) => {
    return (
      <AddedExpensesTab
        items={item}
        navigation={navigation}
        onRefresh={getData}
      />
    );
  };

  // list for event tab
  const renderEventList = ({item}: {item: any; index: any}) => {
    return (
      <EventTab
        item={item}
        handleView={handleViewPage}
        onLikeClick={handleLike}
        onUnLikeClick={handleUnLike}
        getData={() => {
          getData();
        }}
        navigation={navigation}
      />
    );
  };

  // navigation for event details
  const handleViewPage = (id: any) => {
    navigation.navigate('StackNavigation', {
      screen: 'EventDetails',
      params: {id: id},
    });
  };

  // function for api call on like click
  const handleLike = (id: number) => {
    const data = {
      eventid: id,
      status: 1,
    };
    EventService.postLikeUnlikeEvent(data)
      .then((response: any) => {
        getData();
      })
      .catch(error => {
        console.log(error);
      });
  };

  // function for api call on unlike click
  const handleUnLike = (id: number) => {
    const data = {
      eventid: id,
      status: 0,
    };
    EventService.postLikeUnlikeEvent(data)
      .then((response: any) => {
        getData();
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Home'}
        drawerButton={{
          visible: true,
          onClick: () => {
            handleOpenDrawer();
          },
        }}
        bellButton={{
          visible: true,
          onClick: () => {
            navigation.navigate('StackNavigation', {
              screen: 'Notifications',
            });
          },
        }}
      />

      {/* body section */}
      {!pageLoader ? (
        <SafeAreaView style={styles.container}>
          <ScrollView nestedScrollEnabled={true}>
            {/* groups tab */}
            <View style={styles.groupTab}>
              <FlatList
                data={groupList}
                renderItem={renderGroupItem}
                numColumns={2}
                keyExtractor={(item: any, index: any) => String(index)}
              />
            </View>

            {/* expense management tab */}
            <View style={styles.expenseContainer}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('StackNavigation', {
                    screen: 'ExpenseManagement',
                  });
                }}
                style={styles.expenseTab}>
                <View style={styles.expenseImage}>
                  <Image
                    style={{height: 47, width: 47}}
                    resizeMode="cover"
                    source={require('../../assets/pngImage/expensesIcon.png')}
                  />
                </View>
                <Text style={styles.tabTitle}>Expenses</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('StackNavigation', {
                    screen: 'BusinessCommunity',
                  });
                }}
                style={styles.expenseTab}>
                {postCount > 0 ? (
                  <Text style={styles.notificationText}>{postCount}</Text>
                ) : null}

                <View style={styles.expenseImage}>
                  <Image
                    style={{
                      height: 40,
                      width: 40,
                      tintColor: colors.THEME_ORANGE,
                    }}
                    resizeMode="cover"
                    source={require('../../assets/pngImage/businessIcon.png')}
                  />
                </View>
                <Text style={styles.tabTitle}>Business/ Community</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('StackNavigation', {
                    screen: 'EventManagement',
                  });
                }}
                style={styles.expenseTab}>
                {eventCount > 0 ? (
                  <Text style={styles.notificationText}>{eventCount}</Text>
                ) : null}

                <View style={styles.expenseImage}>
                  <Image
                    style={{height: 47, width: 47}}
                    resizeMode="cover"
                    source={require('../../assets/pngImage/eventIcon.png')}
                  />
                </View>
                <Text style={styles.tabTitle}>Events</Text>
              </TouchableOpacity>
            </View>

            {/* task tab */}
            <View style={styles.buttonDirection}>
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => {
                  getTask();
                  setIsHide(false);
                }}>
                <Text style={styles.buttonText}>
                  My Tasks ({moment(new Date()).format('MMM DD, YYYY')})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.disableButtonContainer}
                onPress={() => {
                  navigation.navigate('StackNavigation', {
                    screen: 'MyAllTask',
                  });
                }}>
                <Text style={styles.disableButtonText}>View All </Text>
              </TouchableOpacity>
            </View>

            {/* state according to hide and unHide status  */}
            {isHide ? (
              <>
                {hideTaskList?.length > 0 ? (
                  <View style={styles.taskContainer}>
                    <ScrollView nestedScrollEnabled={true}>
                      {hideTaskList.map(item => {
                        return (
                          <TaskTab
                            data={item}
                            onTaskTabClick={handleTaskTabClick}
                            hideClick={handleHideClick}
                            unHideClick={HandleUnHideClick}
                            handleMarkComplete={handleMarkComplete}
                            handleMarkInComplete={handleMarkInComplete}
                          />
                        );
                      })}
                    </ScrollView>
                  </View>
                ) : (
                  <View style={styles.noTaskContainer}>
                    <Text style={styles.noTaskText}>
                      No Hide Task Available
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <>
                {unHideTaskList?.length > 0 ? (
                  <View style={styles.taskContainer}>
                    <ScrollView nestedScrollEnabled={true}>
                      {unHideTaskList.map(item => {
                        return (
                          <TaskTab
                            data={item}
                            onTaskTabClick={handleTaskTabClick}
                            hideClick={handleHideClick}
                            unHideClick={HandleUnHideClick}
                            handleMarkComplete={handleMarkComplete}
                            handleMarkInComplete={handleMarkInComplete}
                          />
                        );
                      })}
                    </ScrollView>
                  </View>
                ) : (
                  <View style={styles.noTaskContainer}>
                    <Text style={styles.noTaskText}>No Task Available</Text>
                  </View>
                )}
              </>
            )}

            {/*all upcoming events */}
            <View style={styles.textDirection}>
              <Text style={styles.labelText}>Events</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('StackNavigation', {
                    screen: 'EventManagement',
                  });
                }}>
                {upComingEvent?.length > 0 ? (
                  <Text style={styles.addEditText}>View All</Text>
                ) : null}
              </TouchableOpacity>
            </View>

            <View style={{flex: 1, marginHorizontal: 3}}>
              {upComingEvent?.length > 0 ? (
                <View style={styles.eventContainer}>
                  <FlatList
                    data={upComingEvent}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderEventList}
                    keyExtractor={(item: any, index: any) => String(index)}
                  />
                </View>
              ) : (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noExpansesText}>No event added yet.</Text>
                </View>
              )}
            </View>

            <View style={styles.textDirection}>
              <Text style={styles.labelText}>Recent Expenses</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('StackNavigation', {
                    screen: 'AllExpenses',
                  });
                }}>
                {upComingExpenses?.length > 0 ? (
                  <Text style={styles.addEditText}>View All</Text>
                ) : null}
              </TouchableOpacity>
            </View>

            <View>
              {/*all upcoming expense */}
              {upComingExpenses?.length > 0 ? (
                <View style={styles.expansesContainer}>
                  <FlatList
                    data={upComingExpenses}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderAddedExpenses}
                    keyExtractor={(item: any, index: any) => String(index)}
                  />
                </View>
              ) : (
                <View style={styles.expansesContainer}>
                  <Text style={styles.noExpansesText}>
                    No recent expenses added.
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      ) : (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.THEME_ORANGE} />
        </View>
      )}

      {/* Delete alert modal for hide task */}
      <DeleteAlertModal
        visibleModal={markHideModal}
        onRequestClosed={() => {
          setMarkHideModal(false);
        }}
        onPressRightButton={handleHideYesClick}
        subHeading={'Are you sure you want to hide ?'}
      />

      {/* Delete alert modal for un hide task */}
      <DeleteAlertModal
        visibleModal={markUnHideModal}
        onRequestClosed={() => {
          setMarkUnHideModal(false);
        }}
        onPressRightButton={handleUnHideYesClick}
        subHeading={'Are you sure you want to unhide ?'}
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

      {/* Delete alert modal for task mark inComplete */}
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

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  calendarDateView: {
    backgroundColor: colors.WHITE,
    borderRadius: 5,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  taskContainer: {
    height: 320,
    marginBottom: 10,
  },
  viewAllTaskTitle: {
    color: colors.THEME_ORANGE,
    fontSize: 16,
    fontWeight: '500',
    margin: 10,
    width: 70,
  },
  myTasksContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  expenseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  expenseTab: {
    backgroundColor: colors.BLACK2,
    borderRadius: 30,
    height: 110,
    justifyContent: 'center',
    width: '32%',
  },
  tabTitle: {
    color: colors.WHITE,
    fontSize: 12,
    fontWeight: '400',
    marginTop: 5,
    textAlign: 'center',
  },
  expenseImage: {
    alignContent: 'center',
    alignSelf: 'center',
    borderRadius: 50,
  },
  loaderContainer: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  groupTab: {
    marginTop: 10,
    paddingHorizontal: 5,
  },
  noTaskContainer: {
    alignContent: 'center',
    alignItems: 'center',
    height: 320,
    justifyContent: 'center',
  },
  noTaskText: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '500',
    padding: 20,
  },
  notificationText: {
    backgroundColor: colors.RED,
    borderRadius: 100,
    color: colors.WHITE,
    fontSize: 12,
    fontWeight: '500',
    height: 25,
    justifyContent: 'center',
    padding: 3,
    position: 'absolute',
    right: 3,
    textAlign: 'center',
    top: 0,
    width: 25,
    zIndex: 1,
  },
  textDirection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  labelText: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '500',
    paddingVertical: 5,
  },
  addEditText: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
  },
  expansesContainer: {
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    height: 180,
    justifyContent: 'center',
    marginBottom: 20,
    marginVertical: 5,
  },
  noExpansesText: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '500',
    padding: 20,
  },
  buttonDirection: {
    backgroundColor: colors.BLACK3,
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
  },
  buttonContainer: {
    alignItems: 'center',
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 50,
    height: 46,
    justifyContent: 'center',
    width: 180,
  },
  buttonText: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  disableButtonContainer: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 180,
  },
  disableButtonText: {
    color: colors.THEME_WHITE,
    fontSize: 14,
    fontWeight: '400',
  },
  eventContainer: {
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    height: 'auto',
    justifyContent: 'center',
    marginBottom: 20,
    marginVertical: 5,
    maxHeight: 450,
  },
  noDataContainer: {
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    height: 80,
    justifyContent: 'center',
    marginBottom: 20,
    marginVertical: 5,
  },
});
