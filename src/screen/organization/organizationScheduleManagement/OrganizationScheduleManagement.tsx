// external imports
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import LinearGradient from 'react-native-linear-gradient';
import React, {useEffect, useRef, useState} from 'react';
import moment from 'moment';
// internal imports
import CommonToast from '../../../constants/CommonToast';
import CustomHeader from '../../../constants/CustomHeader';
import OrganizationService from '../../../service/OrganisationService';
import {colors} from '../../../constants/ColorConstant';

const OrganizationScheduleManagement = ({navigation}: {navigation: any}) => {
  const [businessDetails, setBusinessDetails] = useState({});
  const [currentMonth, setCurrentMonth] = useState(moment().month() + 1);
  const [currentYear, setCurrentYear] = useState(moment().year());
  const [date, setDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
  const [monthWiseAppointmentData, setMonthWiseAppointmentData] = useState({});
  const [pageLoader, setPageLoader] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const toastRef = useRef<any>();
  const crntMonth = useRef(moment().month() + 1);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setPageLoader(true);

      console.log();

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
    console.log('currentMonth', currentMonth);

    setPageLoader(true);
    const body = {
      month: currentMonth,
      year: currentYear,
    };
    OrganizationService.postAppointmentOnCalendar(body)
      .then((response: any) => {
        console.log('RESPONSE', response.data);

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
                    // getData(
                    //   moment(new Date(data)).format('MM'),
                    //   moment(new Date(data)).format('YYYY'),
                    // );
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

      {/* create notes icon  */}
      <View style={styles.createIconContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('StackNavigation', {
              screen: 'AddNewOrganizationAppointment',
            });
          }}>
          <Image
            style={styles.createIconImage}
            resizeMode="contain"
            source={require('../../../assets/pngImage/Plus.png')}
          />
        </TouchableOpacity>
      </View>

      {/* toaster message for error response from API */}
      <CommonToast ref={toastRef} />
    </View>
  );
};

export default OrganizationScheduleManagement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BLACK,
  },
  loaderContainer: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  calendarBox: {
    backgroundColor: colors.BLACK3,
    borderRadius: 15,
    elevation: 3,
    margin: 5,
    paddingBottom: 15,
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
    alignItems: 'center',
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 100,
    bottom: 60,
    height: 60,
    justifyContent: 'center',
    padding: 20,
    position: 'absolute',
    right: 25,
    width: 60,
    zIndex: 1,
  },
  createIconImage: {
    borderRadius: 100,
    height: 25,
    width: 25,
  },
  detailsContainer: {
    backgroundColor: colors.BLACK2,
    borderRadius: 10,
    flexDirection: 'row',
    height: 'auto',
    margin: 10,
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
