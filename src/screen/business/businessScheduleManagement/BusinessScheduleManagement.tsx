import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import CalendarPicker from 'react-native-calendar-picker';
import CustomHeader from '../../../constants/CustomHeader';
import {colors} from '../../../constants/ColorConstant';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BusinessService from '../../../service/BusinessService';
import CommonToast from '../../../constants/CommonToast';
import AddScheduleManagementButton from './AddScheduleManagementButton';

const BusinessScheduleManagement = ({navigation}: {navigation: any}) => {
  const [pageLoader, setPageLoader] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [date, setDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
  const toastRef = useRef<any>();
  const [businessDetails, setBusinessDetails] = useState({});
  const [monthWiseAppointmentData, setMonthWiseAppointmentData] = useState({});
  const [currentMonth, setCurrentMonth] = useState(moment().month() + 1);
  const [currentYear, setCurrentYear] = useState(moment().year());

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
    const accountId = await AsyncStorage.getItem('accountId');

    const body = {
      accountId: accountId,
      month: currentMonth,
      year: currentYear,
    };

    BusinessService.postAppointmentOnCalendar(body)
      .then((response: any) => {
        setPageLoader(false);
        setBusinessDetails(response?.data?.business);
        setMonthWiseAppointmentData(response?.data?.monthwiseappointmentdata);
      })
      .catch(error => {
        setPageLoader(false);
        console.log(error, 'error');
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
    navigation.navigate('StackNavigation', {
      screen: 'AllBusinessAppointments',
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

  return (
    <View style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Schedule Management'}
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
            {/* business name with logo */}
            <View style={styles.businessNameContainer}>
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
                    source={require('../../../assets/pngImage/noImage.png')}
                  />
                </View>
              )}

              <View
                style={{
                  marginHorizontal: 10,
                  backgroundColor: colors.BLACK3,
                  width: '70%',
                }}>
                <Text style={styles.businessHeading}>Hi,</Text>
                <Text style={styles.businessName}>
                  {businessDetails?.businessName}
                </Text>
              </View>
            </View>

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
                        source={require('../../../assets/pngImage/rightarrow.png')}
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
                        source={require('../../../assets/pngImage/leftarrow.png')}
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
          </ScrollView>
        </SafeAreaView>
      ) : (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.THEME_ORANGE} />
        </View>
      )}

      {/* add schedule management, add service and manage availability */}
      <View style={styles.createIconContainer}>
        <AddScheduleManagementButton navigation={navigation} />
      </View>

      {/* toaster message for error response from API */}
      <CommonToast ref={toastRef} />
    </View>
  );
};

export default BusinessScheduleManagement;

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
  // calendar
  calendarBox: {
    backgroundColor: colors.BLACK3,
    paddingBottom: 15,
    margin: 5,
    borderRadius: 15,
    elevation: 3,
  },
  calendarContainer: {
    marginVertical: 15,
    backgroundColor: colors.BLACK3,
    borderRadius: 15,
    marginHorizontal: 10,
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
    borderWidth: 2,
    borderColor: colors.THEME_ORANGE,
    backgroundColor: colors.lightOrange,
  },
  eventWeekEndText: {
    color: colors.RED,
  },
  seenEventWeekEndStyle: {
    borderWidth: 2,
    borderColor: colors.BLUE,
    backgroundColor: colors.brightBlue,
  },
  eventWeekDayStyle: {
    borderWidth: 2,
    borderColor: colors.THEME_ORANGE,
    backgroundColor: colors.lightOrange,
  },
  eventWeekDayText: {
    color: colors.THEME_BLACK,
  },
  seenEventWeekDayStyle: {
    borderWidth: 2,
    borderColor: colors.BLUE,
    backgroundColor: colors.brightBlue,
  },
  businessNameContainer: {
    backgroundColor: colors.BLACK3,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    elevation: 1,
    flexDirection: 'row',
    height: 'auto',
    marginBottom: 10,
    padding: 15,
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
  businessHeading: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '400',
  },
  businessName: {
    color: colors.THEME_ORANGE,
    fontSize: 20,
    fontWeight: '500',
  },
  createIconContainer: {
    bottom: 30,
    position: 'absolute',
    right: 30,
    zIndex: 1,
  },
  detailsContainer: {
    backgroundColor: colors.BLACK2,
    borderRadius: 10,
    height: 'auto',
    margin: 10,
    flexDirection: 'row',
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
});
