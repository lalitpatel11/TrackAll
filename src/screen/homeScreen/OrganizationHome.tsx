//external imports
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import React, {useEffect, useRef, useState} from 'react';
import moment from 'moment';
//internal imports
import AddedExpensesTab from '../expenseManagement/AddedExpensesTab';
import CommonToast from '../../constants/CommonToast';
import CustomHeader from '../../constants/CustomHeader';
import EventService from '../../service/EventService';
import EventTab from '../eventManagement/EventTab';
import MyGroupsTab from '../groups/MyGroupsTab';
import OrganizationEmployee from './OrganizationEmployee';
import OrganizationService from '../../service/OrganisationService';
import {colors} from '../../constants/ColorConstant';

const OrganizationHome = ({navigation}: {navigation: any}) => {
  const [businessDetails, setBusinessDetails] = useState({});
  const [businessEvent, setBusinessEvent] = useState<any[]>([]);
  const [businessExpenses, setBusinessExpenses] = useState([]);
  const [businessGroups, setBusinessGroups] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(moment().month() + 1);
  const [currentYear, setCurrentYear] = useState(moment().year());
  const [date, setDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
  const [employees, setEmployees] = useState<any[]>([]);
  const [monthWiseAppointmentData, setMonthWiseAppointmentData] = useState({});
  const [pageLoader, setPageLoader] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const toastRef = useRef<any>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setPageLoader(true);
      getData(currentMonth, currentYear);

      if (moment().month() == 0) {
        setCurrentMonth(1);
      } else if (moment().month() == 1) {
        setCurrentMonth(2);
      } else if (moment().month() == 2) {
        setCurrentMonth(3);
      } else if (moment().month() == 3) {
        setCurrentMonth(4);
      } else if (moment().month() == 4) {
        setCurrentMonth(5);
      } else if (moment().month() == 5) {
        setCurrentMonth(6);
      } else if (moment().month() == 6) {
        setCurrentMonth(7);
      } else if (moment().month() == 7) {
        setCurrentMonth(8);
      } else if (moment().month() == 8) {
        setCurrentMonth(9);
      } else if (moment().month() == 9) {
        setCurrentMonth(10);
      } else if (moment().month() == 10) {
        setCurrentMonth(11);
      } else if (moment().month() == 11) {
        setCurrentMonth(12);
      } else null;
    });
    return unsubscribe;
  }, [navigation]);

  // function for open side menu
  const handleOpenDrawer = () => {
    navigation.openDrawer();
  };

  // function for get all task data on api call
  const getData = async (currentMonth: any, currentYear: any) => {
    const body = {
      month: currentMonth,
      year: currentYear,
    };

    OrganizationService.postOrganizationHome(body)
      .then((response: any) => {
        setPageLoader(false);
        setBusinessDetails(response?.data?.business);
        setBusinessGroups(response?.data?.mygroups);
        setBusinessEvent(response?.data?.upcomingEvent);
        setBusinessExpenses(response?.data?.upcomingExpense);
        setMonthWiseAppointmentData(response?.data?.monthwiseappointmentdatas);
        setEmployees(response?.data?.employess);
      })
      .catch(error => {
        setPageLoader(false);
        console.log(error, 'error');
      });
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
          getData(currentMonth, currentYear);
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
        getData(currentMonth, currentYear);
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
        getData(currentMonth, currentYear);
      })
      .catch(error => {
        console.log(error);
      });
  };

  // list for group tab
  const renderGroupItem = ({item}: {item: any; index: any}) => {
    return (
      <MyGroupsTab items={item} navigation={navigation} title={'MYGROUPS'} />
    );
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
    navigation.navigate('StackNavigation', {
      screen: 'AllOrganizationAppointment',
      params: {
        date: moment(selectDate).format('YYYY-MM-DD'),
      },
    });
  };

  // custom calendar style on date for appointment
  const customDatesStylesCallback = (date: any) => {
    const newArray = Object.keys(monthWiseAppointmentData);

    // Highlight appointments
    for (let i = 0; i < newArray.length; i++) {
      // highlight appointments with weekend styling
      if (
        date.isoWeekday() === 7 &&
        moment(new Date(date)).format('YYYY-MM-DD') ===
          moment(new Date(newArray[i])).format('YYYY-MM-DD')
      ) {
        return {
          textStyle: styles.eventWeekEndText,
          style: styles.eventWeekEndStyle,
        };
      }

      // Highlight only appointments
      if (
        moment(new Date(date)).format('YYYY-MM-DD') ===
        moment(new Date(newArray[i])).format('YYYY-MM-DD')
      ) {
        return {
          textStyle: styles.eventWeekDayText,
          style: styles.eventWeekDayStyle,
        };
      }
      ////////////////////////
      // highlight all seen appointments with weekend styling
      if (
        date.isoWeekday() === 7 &&
        moment(new Date(date)).format('YYYY-MM-DD') ===
          moment(new Date(newArray[i])).format('YYYY-MM-DD')
      ) {
        return {
          textStyle: styles.seenEventWeekEndStyle,
          style: styles.eventWeekEndStyle,
        };
      }

      // highlight all seen appointments
      if (
        date.isoWeekday() === 7 &&
        moment(new Date(date)).format('YYYY-MM-DD') ===
          moment(new Date(newArray[i])).format('YYYY-MM-DD')
      ) {
        return {
          textStyle: styles.seenEventWeekDayStyle,
          style: styles.eventWeekDayStyle,
        };
      }
    }
    /////////////////////////

    // only weekend styling
    if (date.isoWeekday() === 7) {
      return {
        textStyle: styles.onlyWeekEnd,
      };
    }
    return {};
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

  // list for added expenses
  const renderEmployeeItem = ({item}: {item: any; index: any}) => {
    return (
      <OrganizationEmployee
        items={item}
        navigation={navigation}
        onTabClick={handleTabClick}
      />
    );
  };

  // navigation on employee tab click
  const handleTabClick = (data: any) => {
    navigation.navigate('StackNavigation', {
      screen: 'EmployeeDetailsOnOrganization',
      params: {
        data: data,
      },
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
            {/* top logo with icon */}
            <View style={styles.headerContainer}>
              {/* business account image  */}
              {businessDetails?.businessProfile ? (
                <View style={styles.imageContainer}>
                  <Image
                    style={styles.image}
                    resizeMode="cover"
                    source={{uri: `${businessDetails?.businessProfile}`}}
                  />
                </View>
              ) : (
                <View style={styles.imageContainer}>
                  <Image
                    resizeMode="contain"
                    style={styles.image}
                    source={require('../../assets/pngImage/noImage.png')}
                  />
                </View>
              )}

              {/* organization type */}
              <View style={styles.nameContainer}>
                <Text style={styles.businessName}>
                  {businessDetails?.businessName}
                </Text>
                <Text style={styles.businessType}>
                  {businessDetails?.businesstype}
                </Text>
              </View>

              {/* logo for banner */}
              <View style={{}}>
                <Image
                  resizeMode="contain"
                  style={{height: 90, width: 100}}
                  source={require('../../assets/pngImage/organizationCover.png')}
                />
              </View>
            </View>

            {/* employee section  */}
            <View style={styles.textDirection}>
              <Text style={styles.labelText}>Employees</Text>

              <TouchableOpacity
                style={styles.addEmployeeText}
                onPress={() => {
                  navigation.navigate('StackNavigation', {
                    screen: 'AddEmployeeOnOrganization',
                  });
                }}>
                <Image
                  resizeMode="contain"
                  style={styles.icon}
                  source={require('../../assets/pngImage/UserPlus.png')}
                />
              </TouchableOpacity>

              {employees?.length > 0 ? (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('StackNavigation', {
                      screen: 'AllOrganizationEmployee',
                    });
                  }}>
                  <Text style={styles.addEditText}>View All</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            {/* employee tab  */}
            {employees?.length > 0 ? (
              <View style={styles.groupContainer}>
                <FlatList
                  data={employees}
                  showsHorizontalScrollIndicator={false}
                  renderItem={renderEmployeeItem}
                  horizontal
                  keyExtractor={(item: any, index: any) => String(index)}
                />
              </View>
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noExpansesText}>
                  No employee added yet.
                </Text>
              </View>
            )}

            {/* Groups section  */}
            <View style={styles.textDirection}>
              <Text style={styles.labelText}>Groups</Text>

              {businessGroups?.length > 0 ? (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('BottomNavigator', {
                      screen: 'OrganizationGroup',
                    });
                  }}>
                  <Text style={styles.addEditText}>View All</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            {/* groups tab  */}
            {businessGroups?.length > 0 ? (
              <View style={styles.groupContainer}>
                <FlatList
                  data={businessGroups}
                  showsHorizontalScrollIndicator={false}
                  renderItem={renderGroupItem}
                  horizontal
                  keyExtractor={(item: any, index: any) => String(index)}
                />
              </View>
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noExpansesText}>No group added yet.</Text>
              </View>
            )}

            <View style={styles.calendarBox}>
              {/* calendar section */}
              <View style={styles.calendarContainer}>
                <CalendarPicker
                  customDayHeaderStyles={customDayHeaderStylesCallback}
                  customDatesStyles={customDatesStylesCallback}
                  dayLabelsWrapper={styles.days}
                  monthTitleStyle={styles.month}
                  disabledDatesTextStyle={styles.pastDate}
                  nextComponent={
                    <View style={styles.nextBtn}>
                      <Image
                        resizeMode="contain"
                        style={styles.nextImg}
                        tintColor={colors.THEME_ORANGE}
                        source={require('../../assets/pngImage/rightarrow.png')}
                      />
                    </View>
                  }
                  onDateChange={onDateChange}
                  previousComponent={
                    <View style={styles.previousBtn}>
                      <Image
                        resizeMode="contain"
                        style={styles.previousImg}
                        tintColor={colors.THEME_ORANGE}
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
                  onMonthChange={(data: any) => {
                    console.log('Changes', data);
                    setCurrentMonth(
                      Number(moment(new Date(data)).format('MM')),
                    );
                    setCurrentYear(
                      Number(moment(new Date(data)).format('YYYY')),
                    );
                    getData(
                      moment(new Date(data)).format('MM'),
                      moment(new Date(data)).format('YYYY'),
                    );
                  }}
                />
              </View>

              {/* details section below calender */}
              <View style={styles.detailsContainer}>
                <View style={styles.detailsBox}>
                  <View style={styles.orangeDotContainer} />
                  <Text style={styles.orangeText}>New Appointments</Text>
                </View>

                <View style={styles.detailsBox}>
                  <View style={styles.greenDotContainer} />
                  <Text style={styles.greenText}>Booked Appointments</Text>
                </View>
              </View>
            </View>

            {/*all upcoming events */}
            <View style={styles.textDirection}>
              <Text style={styles.labelText}>Events</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('BottomNavigator', {
                    screen: 'OrganizationEventManagement',
                  });
                }}>
                {businessEvent?.length > 0 ? (
                  <Text style={styles.addEditText}>View All</Text>
                ) : null}
              </TouchableOpacity>
            </View>

            <View style={{flex: 1, marginHorizontal: 3}}>
              {businessEvent?.length > 0 ? (
                <View style={styles.eventContainer}>
                  <FlatList
                    data={businessEvent}
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

            {/* all upcoming expense */}
            <View style={styles.textDirection}>
              <Text style={styles.labelText}>Expenses</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('BottomNavigator', {
                    screen: 'OrganizationExpenseManagement',
                  });
                }}>
                {businessExpenses?.length > 0 ? (
                  <Text style={styles.addEditText}>View All</Text>
                ) : null}
              </TouchableOpacity>
            </View>

            <View>
              {businessExpenses?.length > 0 ? (
                <View style={styles.expansesContainer}>
                  <FlatList
                    data={businessExpenses}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderAddedExpenses}
                    keyExtractor={(item: any, index: any) => String(index)}
                  />
                </View>
              ) : (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noExpansesText}>
                    No upcoming expenses added.
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

      {/* toaster message for error response from API */}
      <CommonToast ref={toastRef} />
    </View>
  );
};

export default OrganizationHome;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  loaderContainer: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  groupContainer: {
    paddingHorizontal: 5,
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
  calendarBox: {
    backgroundColor: colors.BLACK3,
    paddingBottom: 15,
    margin: 5,
    borderRadius: 15,
    elevation: 3,
  },
  calendarContainer: {
    backgroundColor: colors.BLACK3,
    borderRadius: 15,
    marginHorizontal: 10,
    marginVertical: 15,
  },
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
    borderColor: colors.THEME_ORANGE,
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
    borderColor: colors.THEME_ORANGE,
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
    color: colors.THEME_ORANGE,
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
    backgroundColor: colors.lightOrange,
    borderColor: colors.THEME_ORANGE,
    borderWidth: 2,
  },
  eventWeekEndText: {
    color: colors.RED,
  },
  seenEventWeekEndStyle: {
    backgroundColor: colors.brightBlue,
    borderColor: colors.BLUE,
    borderWidth: 2,
  },
  eventWeekDayStyle: {
    backgroundColor: colors.lightOrange,
    borderColor: colors.THEME_ORANGE,
    borderWidth: 2,
  },
  eventWeekDayText: {
    color: colors.THEME_BLACK,
  },
  seenEventWeekDayStyle: {
    backgroundColor: colors.brightBlue,
    borderColor: colors.BLUE,
    borderWidth: 2,
  },
  textDirection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  addEditText: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
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
  labelText: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '500',
    paddingVertical: 5,
  },
  imageContainer: {
    borderColor: colors.textGray,
    borderRadius: 100,
    borderWidth: 1,
    height: 60,
    width: 60,
  },
  image: {
    borderRadius: 100,
    height: '100%',
    width: '100%',
  },
  headerContainer: {
    alignItems: 'center',
    backgroundColor: colors.lightYellow,
    flexDirection: 'row',
    height: 'auto',
    marginBottom: 10,
    padding: 5,
  },
  nameContainer: {
    width: '56%',
    padding: 10,
  },
  businessName: {
    color: colors.THEME_ORANGE,
    fontSize: 18,
    fontWeight: '500',
  },
  businessType: {
    color: colors.THEME_BLACK,
    fontSize: 16,
    fontWeight: '400',
  },
  addEmployeeText: {
    position: 'absolute',
    zIndex: 1,
    left: 110,
  },
  detailsContainer: {
    backgroundColor: colors.BLACK2,
    borderRadius: 10,
    flexDirection: 'row',
    height: 'auto',
    marginHorizontal: 10,
  },
  detailsBox: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 5,
    width: '50%',
  },
  orangeDotContainer: {
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 50,
    height: 10,
    marginLeft: 10,
    marginTop: 3,
    width: 10,
  },
  orangeText: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
    paddingHorizontal: 10,
  },
  greenDotContainer: {
    backgroundColor: colors.THEME_GREEN,
    borderRadius: 50,
    height: 10,
    marginLeft: 10,
    marginTop: 3,
    width: 10,
  },
  greenText: {
    color: colors.THEME_GREEN,
    fontSize: 14,
    paddingHorizontal: 10,
  },
  icon: {
    height: 20,
    tintColor: colors.THEME_ORANGE,
    width: 20,
  },
});
