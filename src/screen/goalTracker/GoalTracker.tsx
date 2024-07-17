//external imports
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import React, {useEffect, useRef, useState} from 'react';
// internal imports
import CustomHeader from '../../constants/CustomHeader';
import {colors} from '../../constants/ColorConstant';
import GoalTrackerService from '../../service/GoalTrackerService';
import GoalTrackerTabs from './GoalTrackerTabs';
import GoalTabOnHomePage from './GoalTabOnHomePage';
import moment from 'moment';
import DeleteAlertModal from '../groups/DeleteAlertModal';
import CommonToast from '../../constants/CommonToast';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GoalTracker = ({navigation}: {navigation: any}) => {
  const [goals, setGoals] = useState([]);
  const [noData, setNoData] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [todayGoalList, setTodayGoalList] = useState([]);
  const [markCompleteModal, setMarkCompleteModal] = useState(false);
  const [markInCompleteModal, setMarkInCompleteModal] = useState(false);
  const [goalId, setGoalId] = useState(0);
  const [timeValue, setTimeValue] = useState('');
  const [date, setDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
  const toastRef = useRef<any>();

  // function for open side menu
  const handleOpenDrawer = () => {
    navigation.openDrawer();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setPageLoader(true);
      getData();
    });
    return unsubscribe;
  }, [navigation]);

  // function for get all goal data on api call
  const getData = async () => {
    const accountId = await AsyncStorage.getItem('accountId');
    const userType = await AsyncStorage.getItem('userType');

    const data = new FormData();
    data.append('date', date);

    if (userType == '2') {
      data.append('accountId', accountId);
    }

    GoalTrackerService.postGoalOnHome(data)
      .then((response: any) => {
        setPageLoader(false);
        setGoals(response?.data?.allgoals);
        setTodayGoalList(response?.data?.goals);
      })
      .catch((error: any) => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // list for all goals
  const renderGoalsItem = ({item}: {item: any; index: any}) => {
    return <GoalTrackerTabs item={item} onTabClick={handleViewGoal} />;
  };

  // navigation for notes details on notes tab click
  const handleViewGoal = (goalId: number) => {
    navigation.navigate('StackNavigation', {
      screen: 'GoalTrackerDetails',
      params: {id: goalId},
    });
  };

  // function for open modal on mark complete click
  const handleMarkComplete = (id: number, value: string) => {
    setMarkCompleteModal(true);
    setGoalId(id);
    setTimeValue(value);
  };

  // function for mark complete click on api call to complete task
  const handleCompleteTask = () => {
    setMarkCompleteModal(false);
    const data = {
      goalid: goalId,
      time: timeValue,
      date: date,
    };

    GoalTrackerService.postMarkCompleteGoal(data)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        getData(); //for refresh the goal
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  // function for open modal on mark incomplete click
  const handleMarkInComplete = (id: number, value: string) => {
    setMarkInCompleteModal(true);
    setGoalId(id);
    setTimeValue(value);
  };

  // function for mark incomplete click on api call to incomplete task
  const handleInCompleteTask = () => {
    setMarkInCompleteModal(false);
    const data = {
      goalid: goalId,
      time: timeValue,
      date: date,
    };

    GoalTrackerService.postMarkInCompleteGoal(data)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        getData(); //for refresh the goal
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Goal Tracker'}
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
      <View style={styles.body}>
        {/* search box */}
        <View style={styles.searchBoxContainer}>
          {/* <View style={styles.inputContainer}>
            <TextInput
              editable={false}
              placeholder="Search Goals By Name"
              placeholderTextColor={colors.textGray}
              style={styles.searchInput}
              onChangeText={() => {
                navigation.navigate('StackNavigation', {
                  screen: 'AllGoals',
                });
              }}
            />
          </View> */}

          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => {
              navigation.navigate('StackNavigation', {
                screen: 'AllGoals',
              });
            }}>
            <Text style={styles.searchInput}>Search Goals By Name</Text>
          </TouchableOpacity>

          <View style={styles.searchContainer}>
            <TouchableOpacity>
              <Image
                resizeMode="contain"
                source={require('../../assets/pngImage/searchIcon.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {!pageLoader ? (
        <>
          <SafeAreaView style={styles.container}>
            <ScrollView nestedScrollEnabled={true}>
              {goals?.length > 0 ? (
                <>
                  <View style={styles.direction}>
                    <Text style={styles.goalHeading}>Your Goals</Text>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('StackNavigation', {
                          screen: 'AllGoals',
                        });
                      }}>
                      <Text style={styles.allGoals}>All Goals</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.goalContainer}>
                    <FlatList
                      data={goals}
                      renderItem={renderGoalsItem}
                      numColumns={2}
                      keyExtractor={(item: any, index: any) => String(index)}
                    />
                  </View>
                </>
              ) : (
                <View style={styles.noDataContainer}>
                  {!noData ? (
                    <Text style={styles.noDataText}>
                      No Goals Created. {'\n'}Click on the "Create Icon" to
                      create a Goal.
                    </Text>
                  ) : (
                    <Text style={styles.noDataText}>No Result Found</Text>
                  )}
                </View>
              )}

              {todayGoalList?.length > 0 ? (
                <>
                  {/* task tab */}
                  <View style={styles.myTasksContainer}>
                    <Text style={styles.myTaskTitle}>
                      My Goals ({moment(new Date()).format('MMM DD, YYYY')})
                    </Text>
                  </View>

                  <View style={styles.taskContainer}>
                    <ScrollView nestedScrollEnabled={true}>
                      {todayGoalList.map(item => {
                        return (
                          <GoalTabOnHomePage
                            data={item}
                            onGoalTabClick={handleViewGoal}
                            handleMarkComplete={handleMarkComplete}
                            handleMarkInComplete={handleMarkInComplete}
                          />
                        );
                      })}
                    </ScrollView>
                  </View>
                </>
              ) : null}
            </ScrollView>
          </SafeAreaView>
        </>
      ) : (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.THEME_ORANGE} />
        </View>
      )}

      {/* create notes icon  */}
      <LinearGradient
        colors={['#ED933C', '#E15132']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.createIconContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('StackNavigation', {
              screen: 'CreateGoalTracker',
            });
          }}>
          <Image
            style={styles.createIconImage}
            resizeMode="contain"
            source={require('../../assets/pngImage/Plus.png')}
          />
        </TouchableOpacity>
      </LinearGradient>

      {/* Delete alert modal for goal mark complete */}
      <DeleteAlertModal
        visibleModal={markCompleteModal}
        onRequestClosed={() => {
          setMarkCompleteModal(false);
        }}
        onPressRightButton={handleCompleteTask}
        subHeading={'Are you sure you want to mark this goal as complete ?'}
      />

      {/* Delete alert modal for goal mark inComplete */}
      <DeleteAlertModal
        visibleModal={markInCompleteModal}
        onRequestClosed={() => {
          setMarkInCompleteModal(false);
        }}
        onPressRightButton={handleInCompleteTask}
        subHeading={'AAre you sure you want to mark this goal as Incomplete ?'}
      />

      {/* toaster message for error response from API */}
      <CommonToast ref={toastRef} />
    </View>
  );
};

export default GoalTracker;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {
    padding: 10,
  },
  searchBoxContainer: {
    flexDirection: 'row',
    height: 45,
    justifyContent: 'space-between',
  },
  inputContainer: {
    borderRadius: 8,
    width: '83%',
  },
  searchInput: {
    backgroundColor: colors.BLACK3,
    borderRadius: 8,
    color: colors.textGray,
    fontSize: 16,
    height: 45,
    padding: 10,
    paddingLeft: 10,
  },
  searchContainer: {
    alignItems: 'center',
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 10,
    justifyContent: 'center',
    width: '14%',
  },
  direction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalHeading: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 20,
  },
  allGoals: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
    paddingLeft: 5,
    marginRight: 10,
  },
  goalContainer: {
    flex: 1,
    marginBottom: 10,
    paddingBottom: 10,
    paddingVertical: 5,
  },
  createIconContainer: {
    alignItems: 'center',
    backgroundColor: colors.WHITE,
    borderRadius: 50,
    bottom: 50,
    height: 60,
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
    width: 60,
    zIndex: 1,
  },
  createIconImage: {
    borderRadius: 50,
    height: 25,
    width: 25,
  },
  loaderContainer: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  noDataContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginTop: '50%',
    paddingHorizontal: 5,
  },
  noDataText: {
    color: colors.WHITE,
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    padding: 5,
  },
  taskContainer: {
    height: Platform.OS === 'ios' ? 390 : 360,
    marginBottom: 10,
  },
  noTaskContainer: {
    alignContent: 'center',
    alignItems: 'center',
    height: 320,
    justifyContent: 'center',
  },
  noTaskText: {
    color: colors.GRAY,
    fontSize: 18,
    fontWeight: '500',
    padding: 20,
  },
  myTaskTitle: {
    color: colors.THEME_ORANGE,
    fontSize: 16,
    fontWeight: '500',
  },
  myTasksContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
});
