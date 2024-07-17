// external imports
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
import * as Progress from 'react-native-progress';
import CalendarPicker from 'react-native-calendar-picker';
import React, {useEffect, useRef, useState} from 'react';
// internal imports
import CustomHeader from '../../constants/CustomHeader';
import {colors} from '../../constants/ColorConstant';
import GoalTrackerService from '../../service/GoalTrackerService';
import DeleteAlertModal from '../groups/DeleteAlertModal';
import moment from 'moment';
import AllTimeWithComplete from '../groups/AllTimeWithComplete';
import CommonToast from '../../constants/CommonToast';
import CustomDays from './CustomDays';
import TaskCompleteAlert from './TaskCompleteAlert';

const GoalTrackerDetails = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const [allDaysPercent, setAllDaysPercent] = useState<any>(0);
  const [allTimes, setAllTimes] = useState([]);
  const [customDays, setCustomDays] = useState([]);
  const [date, setDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
  const [deleteModal, setDeleteModal] = useState(false);
  const [goalDetails, setGoalDetails] = useState({});
  const [goalId, setGoalId] = useState(route?.params?.id);
  const [markCompleteModal, setMarkCompleteModal] = useState(false);
  const [markInCompleteModal, setMarkInCompleteModal] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [sevenDays, setSevenDays] = useState(0);
  const [startDate, setStartDate] = useState(0);
  const [taskCompleteVisible, setTaskCompleteVisible] = useState(false);
  const [timeValue, setTimeValue] = useState('');

  const toastRef = useRef<any>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setPageLoader(true);
      setGoalId(route?.params?.id);
      getData();
      getTimeWithDate();
    });
    return unsubscribe;
  }, [navigation]);

  const getData = () => {
    const data = {
      goalid: goalId,
    };

    GoalTrackerService.postGoalDetails(data)
      .then((response: any) => {
        setPageLoader(false);

        // days difference
        var start = new Date(Date.now());
        var end = new Date(response?.data?.goaldetail?.schedule_enddate);
        var timeDiff = end.getTime() - start.getTime();
        var daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24) + 1);

        // percent according to day difference
        let total = (daysDiff * 100) / response.data.goaldetail?.daysdifference;
        let totalPercent = Math.floor(total) / 100;
        let exactPercent = 1 - totalPercent;

        // end date cross then process bar should be 100 percent
        let today = moment(new Date()).format('YYYY-MM-DD');
        let lastDate = moment(
          response?.data?.goaldetail?.schedule_enddate,
        ).format('YYYY-MM-DD');

        if (today > lastDate) {
          setAllDaysPercent(100);
        } else if (
          response?.data?.goaldetail?.schedule_startdate ==
          response?.data?.goaldetail?.schedule_enddate
        ) {
          setAllDaysPercent(100);
        } else {
          setAllDaysPercent(exactPercent);
        }

        // start date percent according to percentage
        if (
          response?.data?.goaldetail?.averagecompletpercentagefromstartdate >= 0
        ) {
          const startDatePercent =
            response?.data?.goaldetail?.averagecompletpercentagefromstartdate /
            100;
          setStartDate(startDatePercent);
        }

        // seven date percent according to percentage
        if (
          response?.data?.goaldetail?.averagecompletpercentagefromlastseven >= 0
        ) {
          const sevenDaysPercent =
            response?.data?.goaldetail?.averagecompletpercentagefromlastseven /
            100;
          setSevenDays(sevenDaysPercent);
        }

        // days set in state incase of custome type
        if (response?.data?.goaldetail?.repeattype == 'C') {
          setCustomDays(response?.data?.goaldetail?.repeatdays);
        }
        // all state set
        setGoalDetails(response?.data?.goaldetail);
      })
      .catch((error: any) => {
        setPageLoader(false);
        console.log(error);
      });
  };

  const getTimeWithDate = (selectDate?: string) => {
    // setPageLoader(true);

    const data = {
      goalid: goalId,
      date: selectDate ? selectDate : date,
    };

    GoalTrackerService.postTimeWithDate(data)
      .then((response: any) => {
        setPageLoader(false);
        setAllTimes(response?.data?.alltimes);
      })
      .catch((error: any) => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // list for all time with on goal details
  const renderAddedTimeWithComplete = ({item}: {item: any; index: any}) => {
    return (
      <AllTimeWithComplete
        items={item}
        handleMarkComplete={handleMarkComplete}
        handleMarkInComplete={handleMarkInComplete}
      />
    );
  };

  // function for open modal on mark complete icon click
  const handleMarkComplete = (value: string) => {
    let today = moment(new Date()).format('YYYY-MM-DD');
    let select = moment(date).format('YYYY-MM-DD');

    if (select > today) {
      setTaskCompleteVisible(true);
    } else {
      setTaskCompleteVisible(false);
      setMarkCompleteModal(true);
      setTimeValue(value);
    }
  };

  // function for close modal on mark complete icon click api call
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
        getData();
        getTimeWithDate(); //for refresh the goal
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
      goalid: goalId,
      time: timeValue,
      date: date,
    };

    GoalTrackerService.postMarkInCompleteGoal(data)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        getData();
        getTimeWithDate(); //for refresh the goal
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  // function for delete button click on api call to delete task
  const handleDelete = () => {
    setDeleteModal(false);
    GoalTrackerService.getDeleteGoal(goalId)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        navigation.goBack();
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  // STYLING SUNDAYS AS RED
  const customDayHeaderStylesCallback = (DayOfWeekName: {dayOfWeek: any}) => {
    switch (DayOfWeekName.dayOfWeek) {
      case 7:
        return {
          textStyle: styles.weekEnd,
        };
      default:
        return {};
    }
  };

  // on date change
  const onDateChange = (selectDate: any) => {
    setSelectedDate(selectDate);
    setDate(moment(selectDate).format('YYYY-MM-DD'));
    getTimeWithDate(moment(selectDate).format('YYYY-MM-DD'));
  };

  const customDatesStylesCallback = (date: any) => {
    // only weekend styling
    if (date.isoWeekday() === 7) {
      return {
        textStyle: styles.onlyWeekEnd,
      };
    }
    return {};
  };

  // list for custom days
  const renderDays = ({item}: {item: any; index: any}) => {
    return <CustomDays items={item} />;
  };

  // Highlight tasks
  // for (let i = 0; i < updatedData.userTasks.length; i++) {
  //   // highlight task with weekend styling
  //   if (
  //     date.isoWeekday() === 7 &&
  //     new Date(date).getDate() ===
  //       new Date(updatedData.userTasks[i]).getDate() &&
  //     new Date(date).getMonth() ===
  //       new Date(updatedData.userTasks[i]).getMonth()
  //   ) {
  //     return {
  //       textStyle: styles.taskWeekEndText,
  //       style: styles.taskWeekEndStyle,
  //     };
  //   }
  //   // Highlight only task
  //   if (
  //     new Date(date).getDate() ===
  //       new Date(updatedData.userTasks[i]).getDate() &&
  //     new Date(date).getMonth() ===
  //       new Date(updatedData.userTasks[i]).getMonth()
  //   ) {
  //     return {
  //       textStyle: {color: colors.WHITE},
  //       style: {
  //         backgroundColor: colors.RED,
  //       },
  //     };
  //   }
  // }

  return (
    <View style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Goal Details'}
        backButton={{
          visible: true,
          onClick: () => {
            navigation.goBack();
          },
        }}
      />
      {/* body section */}
      {!pageLoader ? (
        <ScrollView nestedScrollEnabled={true}>
          <View style={styles.body}>
            <View style={styles.profileContainer}>
              {/* name and edit section  */}
              <View style={styles.nameContainer}>
                <Text style={styles.nameText}>{goalDetails?.name}</Text>

                {/* edit icon basis of user id match*/}
                <View style={styles.iconsContainer}>
                  <View style={styles.direction}>
                    <TouchableOpacity
                      style={styles.editIconContainer}
                      onPress={() => {
                        navigation.navigate('StackNavigation', {
                          screen: 'EditGoalTracker',
                          params: {
                            data: goalDetails,
                            time: goalDetails?.alltimes,
                          },
                        });
                      }}>
                      <Image
                        resizeMode="contain"
                        style={{width: 15, height: 15}}
                        source={require('../../assets/pngImage/editIcon.png')}
                      />
                    </TouchableOpacity>

                    {/* delete icon  */}
                    <TouchableOpacity
                      style={styles.editIconContainer}
                      onPress={() => {
                        setDeleteModal(true);
                      }}>
                      <Image
                        resizeMode="contain"
                        style={{width: 15, height: 15}}
                        source={require('../../assets/pngImage/Trash.png')}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* repeattype section */}
              <View style={styles.direction}>
                <Text style={styles.typeLabel}>Repeat Type : </Text>
                {goalDetails?.repeattype == 'D' ? (
                  <Text style={styles.typeText}>Daily</Text>
                ) : (
                  <Text style={styles.typeText}>Custom</Text>
                )}
              </View>

              {/* days list  */}
              {goalDetails?.repeattype == 'C' ? (
                <View>
                  <FlatList
                    data={customDays}
                    renderItem={renderDays}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item: any, index: any) => String(index)}
                  />
                </View>
              ) : null}

              {/* total days count and range section */}
              <View style={styles.daysDirection}>
                <View style={styles.daysContainer}>
                  <Text style={styles.daysCount}>
                    {goalDetails?.daysdifference}
                  </Text>
                  <Text style={styles.daysText}>Days</Text>
                </View>

                <View style={styles.daysSectionContainer}>
                  <Progress.Bar
                    progress={allDaysPercent}
                    width={200}
                    color={colors.THEME_ORANGE}
                  />
                  <View style={styles.daysDirection}>
                    <Text style={styles.startDate}>
                      {moment(goalDetails?.schedule_startdate).format(
                        'MM-DD-YYYY',
                      )}
                    </Text>
                    <Text style={styles.startDate}>
                      {moment(goalDetails?.schedule_enddate).format(
                        'MM-DD-YYYY',
                      )}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* tab section */}
            <View style={styles.direction}>
              <View style={styles.amountPercentContainer}>
                <View style={styles.amountContainer}>
                  <Text style={styles.monthText}>Avg Complete</Text>
                  <Text style={styles.monthText}>(This week)</Text>

                  {/* percent according to color and uses  */}
                  <Text style={styles.percentText}>
                    {goalDetails?.averagecompletpercentagefromlastseven}%
                  </Text>

                  {goalDetails?.averagecompletpercentagefromlastseven <= 25 &&
                  goalDetails?.averagecompletpercentagefromlastseven >= 0 ? (
                    <Progress.Bar
                      progress={sevenDays}
                      width={120}
                      color={colors.GREEN}
                    />
                  ) : goalDetails?.averagecompletpercentagefromlastseven <=
                      50 &&
                    goalDetails?.averagecompletpercentagefromlastseven > 25 ? (
                    <Progress.Bar
                      progress={sevenDays}
                      width={120}
                      color={colors.YELLOW}
                    />
                  ) : goalDetails?.averagecompletpercentagefromlastseven <=
                      75 &&
                    goalDetails?.averagecompletpercentagefromlastseven > 50 ? (
                    <Progress.Bar
                      progress={sevenDays}
                      width={120}
                      color={colors.AMBER}
                    />
                  ) : goalDetails?.averagecompletpercentagefromlastseven <=
                      100 &&
                    goalDetails?.averagecompletpercentagefromlastseven > 75 ? (
                    <Progress.Bar
                      progress={sevenDays}
                      width={120}
                      color={colors.RED}
                    />
                  ) : (
                    <Progress.Bar
                      progress={sevenDays}
                      width={120}
                      color={colors.RED}
                    />
                  )}
                </View>
              </View>

              <View style={styles.amountPercentContainer}>
                <View style={styles.amountContainer}>
                  <Text style={styles.monthText}>Avg Complete</Text>
                  <Text style={styles.monthText}>(From start date)</Text>

                  {/* percent according to color and uses  */}
                  <Text style={styles.percentText}>
                    {goalDetails?.averagecompletpercentagefromstartdate}%
                  </Text>
                  {goalDetails?.averagecompletpercentagefromstartdate <= 25 &&
                  goalDetails?.averagecompletpercentagefromstartdate >= 0 ? (
                    <Progress.Bar
                      progress={startDate}
                      width={120}
                      color={colors.GREEN}
                    />
                  ) : goalDetails?.averagecompletpercentagefromstartdate <=
                      50 &&
                    goalDetails?.averagecompletpercentagefromstartdate > 25 ? (
                    <Progress.Bar
                      progress={startDate}
                      width={120}
                      color={colors.YELLOW}
                    />
                  ) : goalDetails?.averagecompletpercentagefromstartdate <=
                      75 &&
                    goalDetails?.averagecompletpercentagefromstartdate > 50 ? (
                    <Progress.Bar
                      progress={startDate}
                      width={120}
                      color={colors.AMBER}
                    />
                  ) : goalDetails?.averagecompletpercentagefromstartdate <=
                      100 &&
                    goalDetails?.averagecompletpercentagefromstartdate > 75 ? (
                    <Progress.Bar
                      progress={startDate}
                      width={120}
                      color={colors.RED}
                    />
                  ) : (
                    <Progress.Bar
                      progress={startDate}
                      width={120}
                      color={colors.RED}
                    />
                  )}
                </View>
              </View>
            </View>

            {/* time section according to date */}
            <View style={{height: 'auto', marginVertical: 10}}>
              <Text style={styles.timeLabel}>Goal tasks</Text>
              <FlatList
                horizontal={true}
                data={allTimes}
                showsHorizontalScrollIndicator={false}
                renderItem={renderAddedTimeWithComplete}
                keyExtractor={(item: any, index: any) => String(index)}
              />
            </View>

            {/* calendar section */}
            <View>
              <CalendarPicker
                customDayHeaderStyles={customDayHeaderStylesCallback}
                customDatesStyles={customDatesStylesCallback}
                dayLabelsWrapper={styles.days}
                monthTitleStyle={styles.month}
                disabledDatesTextStyle={styles.pastDate}
                minDate={goalDetails?.schedule_startdate}
                maxDate={goalDetails?.schedule_enddate}
                nextComponent={
                  <View style={styles.nextBtn}>
                    <Image
                      resizeMode="contain"
                      tintColor={colors.WHITE}
                      style={styles.nextImg}
                      source={require('../../assets/pngImage/rightarrow.png')}
                    />
                  </View>
                }
                onDateChange={onDateChange}
                previousComponent={
                  <View style={styles.previousBtn}>
                    <Image
                      resizeMode="contain"
                      tintColor={colors.WHITE}
                      style={styles.previousImg}
                      source={require('../../assets/pngImage/leftarrow.png')}
                    />
                  </View>
                }
                selectedDayStyle={styles.selectedDate}
                selectedDayTextColor={colors.WHITE}
                showDayStragglers={true}
                startFromMonday={true}
                textStyle={styles.allTexts}
                todayBackgroundColor={colors.WHITE}
                todayTextStyle={styles.today}
                yearTitleStyle={styles.year}
                onMonthChange={data => {
                  console.log('Changes', data);
                }}
              />
            </View>
          </View>
        </ScrollView>
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
        subHeading={'Are you sure you want to delete this goal ?'}
      />

      {/* Delete alert modal for goal mark complete */}
      <DeleteAlertModal
        visibleModal={markCompleteModal}
        onRequestClosed={() => {
          setMarkCompleteModal(false);
        }}
        onPressRightButton={handleCompleteTask}
        subHeading={'Are you sure you want to complete this goal ?'}
      />

      {/* Delete alert modal for goal mark complete */}
      <DeleteAlertModal
        visibleModal={markInCompleteModal}
        onRequestClosed={() => {
          setMarkInCompleteModal(false);
        }}
        onPressRightButton={handleInCompleteTask}
        subHeading={'Are you sure you want to incomplete this goal ?'}
      />

      {/* Modal for task complete alert plan*/}
      <TaskCompleteAlert
        visibleModal={taskCompleteVisible}
        onClose={() => {
          setTaskCompleteVisible(false);
        }}
      />

      {/* toaster message for error response from API */}
      <CommonToast ref={toastRef} />
    </View>
  );
};

export default GoalTrackerDetails;
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {
    margin: 10,
    padding: 10,
  },
  profileContainer: {
    backgroundColor: colors.BLACK2,
    borderRadius: 15,
    height: 'auto',
    marginVertical: 10,
    padding: 10,
  },
  direction: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  nameContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameText: {
    color: colors.THEME_ORANGE,
    fontSize: 18,
    fontWeight: '500',
    width: '75%',
  },
  editIconContainer: {
    alignItems: 'center',
    backgroundColor: colors.BLACK3,
    borderRadius: 50,
    height: 30,
    justifyContent: 'center',
    width: 30,
    marginLeft: 3,
  },
  typeLabel: {
    color: colors.WHITE,
    fontSize: 14,
    paddingRight: 4,
    marginVertical: 10,
  },
  typeText: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
    paddingRight: 4,
  },
  daysDirection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  daysContainer: {
    alignItems: 'center',
    marginVertical: 10,
    width: 40,
  },
  daysCount: {
    color: colors.THEME_ORANGE,
    fontSize: 22,
    paddingRight: 4,
  },
  daysText: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
    paddingRight: 4,
  },
  daysSectionContainer: {width: '70%'},
  startDate: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '400',
  },

  // tab
  amountPercentContainer: {
    backgroundColor: colors.BLACK2,
    borderRadius: 15,
    height: 150,
    justifyContent: 'center',
    marginRight: 10,
    paddingLeft: 10,
    paddingVertical: 10,
    width: '48%',
    alignItems: 'center',
  },
  amountContainer: {
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  monthText: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  percentText: {
    color: colors.THEME_ORANGE,
    fontSize: 26,
    fontWeight: '500',
    paddingVertical: 5,
  },
  greenPercentText: {
    color: colors.GREEN,
    fontSize: 26,
    fontWeight: '500',
    paddingVertical: 5,
  },
  yellowPercentText: {
    color: colors.YELLOW,
    fontSize: 26,
    fontWeight: '500',
    paddingVertical: 5,
  },
  amberPercentText: {
    color: colors.AMBER,
    fontSize: 26,
    fontWeight: '500',
    paddingVertical: 5,
  },
  redPercentText: {
    color: colors.RED,
    fontSize: 26,
    fontWeight: '500',
    paddingVertical: 5,
  },
  textDirection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  // calendar
  allTexts: {
    color: colors.WHITE,
    fontWeight: '600',
  },
  days: {
    borderBottomWidth: 0,
    borderTopWidth: 0,
  },
  month: {
    color: colors.THEME_ORANGE,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  nextBtn: {
    borderColor: colors.WHITE,
    borderRadius: 5,
    borderWidth: 1,
    marginRight: 25,
    marginTop: 10,
  },
  nextImg: {
    height: 20,
    width: 20,
  },
  onlyWeekEnd: {
    color: colors.RED,
  },
  previousBtn: {
    borderColor: colors.WHITE,
    borderRadius: 5,
    borderWidth: 1,
    marginLeft: 25,
    marginTop: 10,
  },
  previousImg: {
    height: 20,
    width: 20,
  },
  pastDate: {
    color: colors.lightGray,
  },
  selectedDate: {
    backgroundColor: colors.THEME_ORANGE,
    color: colors.BLACK,
  },
  today: {
    color: colors.BLACK,
  },
  weekEnd: {
    color: colors.RED,
  },
  year: {
    color: colors.THEME_ORANGE,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  eventWeekEndStyle: {
    borderWidth: 3,
    borderColor: colors.GREEN,
  },
  eventWeekEndText: {
    color: colors.RED,
  },
  taskWeekEndStyle: {
    backgroundColor: colors.RED,
  },
  taskWeekEndText: {
    color: colors.WHITE,
  },
  loaderContainer: {
    alignSelf: 'center',
    height: '83%',
    justifyContent: 'center',
  },
  commonDatesWeekEndStyle: {
    borderWidth: 3,
    borderColor: colors.GREEN,
    backgroundColor: colors.RED,
  },
  commonDatesWeekEndText: {
    color: colors.WHITE,
  },
  iconsContainer: {
    height: 30,
    width: '20%',
  },
  timeLabel: {
    color: colors.WHITE,
    marginVertical: 10,
    fontSize: 16,
    fontWeight: '500',
  },
});
