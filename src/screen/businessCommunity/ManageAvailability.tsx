import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import CustomHeader from '../../constants/CustomHeader';
import CalendarPicker from 'react-native-calendar-picker';
import {colors} from '../../constants/ColorConstant';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import SubmitButton from '../../constants/SubmitButton';
import BusinessService from '../../service/BusinessService';
import CommonToast from '../../constants/CommonToast';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ManageAvailability = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const [pageLoader, setPageLoader] = useState(false);
  const [startTimeList, setStartTimeList] = useState('');
  const [endDate, setEndDate] = useState(new Date());
  const [endOpen, setEndOpen] = useState(false);
  const [endTimeList, setEndTimeList] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [startOpen, setStartOpen] = useState(false);
  const [timeDifference, setTimeDifference] = useState('5');
  const [popUpValue, setPopUpValue] = useState(false);
  const [errMsg, setErrMsg] = useState(false);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [loader, setLoader] = useState(false);
  const [dates, setDates] = useState<any[]>([]);
  const toastRef = useRef<any>();

  useEffect(() => {
    setPageLoader(true);
    // setBusinessId(route?.params?.id);
    getServiceData();
    getBusinessHours();
  }, []);

  // function for get unavailable dates for calender
  const getServiceData = async () => {
    const accountId: any = await AsyncStorage.getItem('accountId');

    const data = {
      businessid: accountId,
    };

    BusinessService.postUnAvailabilityService(data)
      .then((response: any) => {
        setPageLoader(false);
        setDates(response?.data?.dates);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  // function for update dates on calender
  const handleUpdateDates = async () => {
    setButtonLoader(true);
    const accountId: any = await AsyncStorage.getItem('accountId');

    const data = new FormData();
    data.append('accountId', accountId);

    dates?.map((e: any, index: any) => {
      data.append(`dates[${index}]`, e);
    });

    BusinessService.postUManageUnAvailabilityService(data)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        setButtonLoader(false);
        getServiceData();
      })
      .catch((error: any) => {
        setButtonLoader(false);

        console.log(error);
      });
  };

  // function for get time  and hours for calender
  const getBusinessHours = async () => {
    const accountId: any = await AsyncStorage.getItem('accountId');

    const data = {
      accountId: accountId,
    };

    BusinessService.postBusinessHours(data)
      .then((response: any) => {
        //  for start time
        setStartTimeList(response?.data?.businesshours?.starttime);

        //  for end time
        setEndTimeList(response?.data?.businesshours?.endtime);

        // for time interval
        setTimeDifference(response?.data?.businesshours?.timedifference);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  // function for update hours
  const handleUpdateBusinessHours = async () => {
    const accountId: any = await AsyncStorage.getItem('accountId');

    setLoader(true);
    const data = {
      accountId: accountId,
      starttime: startTimeList,
      endtime: moment(endDate).format('HH:mm:ss'),
      timedifference: timeDifference,
    };
    console.log('DATA', data);

    BusinessService.postUpdateBusinessHours(data)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        setLoader(false);
      })
      .catch((error: any) => {
        setLoader(false);
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

  // on date select
  const onDateChange = (selectDate: any) => {
    let date = moment(selectDate).format('YYYY-MM-DD');
    if (dates.includes(date)) {
      setDates(dates.filter(ids => ids !== date));
    } else {
      setDates([...dates, date]);
    }
  };

  const customDatesStylesCallback = (date: any) => {
    // Highlight selected dates
    for (let i = 0; i < dates.length; i++) {
      // highlight selected dates with weekend styling
      if (
        date.isoWeekday() === 7 &&
        moment(new Date(date)).format('YYYY-MM-DD') ===
          moment(new Date(dates[i])).format('YYYY-MM-DD')
      ) {
        return {
          textStyle: styles.eventWeekEndText,
          style: styles.eventWeekEndStyle,
        };
      }

      // Highlight only selected dates
      if (
        moment(new Date(date)).format('YYYY-MM-DD') ===
        moment(new Date(dates[i])).format('YYYY-MM-DD')
      ) {
        return {
          textStyle: styles.eventWeekDayText,
          style: styles.eventWeekDayStyle,
        };
      }
    }

    // only weekend styling
    if (date.isoWeekday() === 7) {
      return {
        textStyle: styles.onlyWeekEnd,
      };
    }
    return {};
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Manage Availability'}
        backButton={{
          visible: true,
          onClick: () => {
            navigation.goBack();
          },
        }}
      />

      {/* body section */}
      {!pageLoader ? (
        <SafeAreaView style={styles.container}>
          <ScrollView nestedScrollEnabled={true}>
            <View style={styles.body}>
              {/* calendar section */}
              <View>
                <Text style={styles.title}>
                  Select unavailable dates from calendar
                </Text>
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
                          tintColor={colors.THEME_ORANGE}
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
                    onMonthChange={data => {
                      console.log('Changes', data);
                    }}
                  />
                </View>

                <SubmitButton
                  buttonText={'Submit'}
                  submitButton={handleUpdateDates}
                  loader={buttonLoader}
                />
              </View>

              {/* Update business details section */}
              <View style={{marginTop: 20}}>
                <Text style={styles.title}>Update Business Hours</Text>
                {/* start and end time section */}
                <View style={styles.direction}>
                  {/* start time section */}
                  <View style={styles.timeTab}>
                    <Text style={styles.heading}>Start Time</Text>
                    <View style={styles.timeContainer}>
                      <Text style={styles.timeText}>
                        {startTimeList != '' ? startTimeList : '00:00'}
                      </Text>
                      <TouchableOpacity onPress={() => setStartOpen(true)}>
                        <Image
                          resizeMode="contain"
                          style={styles.timeIcon}
                          source={require('../../assets/pngImage/Clock.png')}
                        />
                      </TouchableOpacity>

                      <DatePicker
                        modal
                        open={startOpen}
                        date={startTime}
                        title={'Select Time'}
                        mode={'time'}
                        theme="dark"
                        buttonColor={colors.THEME_ORANGE}
                        dividerColor={colors.THEME_ORANGE}
                        textColor={colors.THEME_ORANGE}
                        minuteInterval={15}
                        onConfirm={date => {
                          setStartOpen(false);
                          setStartTime(startTime);
                          setErrMsg(false);

                          let selectedTime = moment(date).format('hh:mm A');
                          setStartTimeList(selectedTime);
                        }}
                        onCancel={() => {
                          setStartOpen(false);
                        }}
                      />
                    </View>
                  </View>

                  {/* end time section */}
                  <View style={styles.timeTab}>
                    <Text style={styles.heading}>End Time</Text>
                    <View style={styles.timeContainer}>
                      <Text style={styles.timeText}>
                        {endTimeList != '' ? endTimeList : '00:00'}
                      </Text>
                      <TouchableOpacity onPress={() => setEndOpen(true)}>
                        <Image
                          resizeMode="contain"
                          style={styles.timeIcon}
                          source={require('../../assets/pngImage/Clock.png')}
                        />
                      </TouchableOpacity>

                      <DatePicker
                        modal
                        open={endOpen}
                        date={endDate}
                        title={'Select Time'}
                        mode={'time'}
                        theme="dark"
                        buttonColor={colors.THEME_ORANGE}
                        dividerColor={colors.THEME_ORANGE}
                        textColor={colors.THEME_ORANGE}
                        minuteInterval={15}
                        onConfirm={date => {
                          setEndOpen(false);
                          setEndDate(date);
                          setErrMsg(false);

                          let selectedTime = moment(date).format('hh:mm A');
                          setEndTimeList(selectedTime);
                        }}
                        onCancel={() => {
                          setEndOpen(false);
                        }}
                      />
                    </View>
                  </View>
                </View>

                {/* time difference section */}
                <View>
                  <Text style={styles.heading}>Time Difference</Text>
                  <TextInput
                    editable={false}
                    placeholder="Total time in minute"
                    placeholderTextColor={colors.WHITE}
                    style={styles.textInput}
                    value={timeDifference}
                    onChangeText={() => {}}
                  />

                  {/* arrow based on true false value for popup */}
                  {!popUpValue ? (
                    <TouchableOpacity
                      style={styles.popUpIconContainer}
                      onPress={() => {
                        setPopUpValue(true);
                      }}>
                      <Image
                        resizeMode="contain"
                        style={styles.previousImg}
                        source={require('../../assets/pngImage/downarrow.png')}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.popUpIconContainer}
                      onPress={() => {
                        setPopUpValue(false);
                      }}>
                      <Image
                        resizeMode="contain"
                        style={styles.previousImg}
                        source={require('../../assets/pngImage/uparrow.png')}
                      />
                    </TouchableOpacity>
                  )}

                  {/* time difference value and popup based on arrow */}
                  {popUpValue ? (
                    <View style={styles.timeListContainer}>
                      <TouchableOpacity
                        style={styles.timeList}
                        onPress={() => {
                          setTimeDifference('5');
                          setPopUpValue(false);
                        }}>
                        <Text style={styles.timeListText}>5 Minutes </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.timeList}
                        onPress={() => {
                          setTimeDifference('10');
                          setPopUpValue(false);
                        }}>
                        <Text style={styles.timeListText}>10 Minutes </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.timeList}
                        onPress={() => {
                          setTimeDifference('15');
                          setPopUpValue(false);
                        }}>
                        <Text style={styles.timeListText}>15 Minutes </Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}

                  <SubmitButton
                    buttonText={'Submit'}
                    submitButton={handleUpdateBusinessHours}
                    loader={loader}
                  />
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
      {/* toaster message for error response from API  */}
      <CommonToast ref={toastRef} />
    </KeyboardAvoidingView>
  );
};

export default ManageAvailability;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {
    padding: 10,
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
  direction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeTab: {
    width: '48%',
  },
  timeText: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '500',
    padding: 5,
    textAlign: 'center',
    width: '70%',
  },
  timeContainer: {
    alignItems: 'center',
    backgroundColor: colors.BLACK3,
    borderRadius: 10,
    elevation: 1,
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
    marginTop: 5,
    marginVertical: 15,
  },
  timeIcon: {
    height: 20,
    marginRight: 20,
    width: 20,
    tintColor: colors.THEME_ORANGE,
  },
  heading: {
    color: colors.WHITE,
    fontSize: 14,
    marginTop: 10,
    paddingBottom: 5,
    paddingHorizontal: 10,
  },
  title: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '500',
    marginTop: 10,
    paddingBottom: 5,
    paddingHorizontal: 10,
  },
  textInput: {
    backgroundColor: colors.BLACK3,
    borderRadius: 10,
    color: colors.WHITE,
    fontSize: 16,
    padding: 15,
    marginBottom: 10,
  },
  buttonContainer: {
    marginBottom: 30,
  },
  popUpIconContainer: {
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    top: 45,
    height: 25,
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
    width: 25,
    zIndex: 1,
  },
  loaderContainer: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  timeListContainer: {
    backgroundColor: colors.lightYellow,
    borderColor: colors.brightGray,
    borderRadius: 15,
    borderWidth: 1,
    height: 'auto',
    paddingVertical: 5,
    position: 'absolute',
    right: 35,
    top: 45,
    width: 110,
    zIndex: 3,
  },
  timeList: {
    alignSelf: 'center',
    height: 30,
    justifyContent: 'center',
  },
  timeListText: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
    fontWeight: '500',
  },
});
