//external imports
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
// import DatePicker from 'react-native-date-picker';
import React, {useEffect, useRef, useState} from 'react';
import moment from 'moment';
import {Formik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
//internal imports
// import AllTimeWithCross from '../groups/AllTimeWithCross';
import CommonToast from '../../constants/CommonToast';
import CustomHeader from '../../constants/CustomHeader';
// import CustomModal from '../groups/CustomModal';
// import RepeatCalendarModal from '../groups/RepeatCalendarModal';
// import RepeatGoalModal from './RepeatGoalModal';
import SubmitButton from '../../constants/SubmitButton';
import {colors} from '../../constants/ColorConstant';
import {routineValidation} from '../../constants/SchemaValidation';
import ChangePreferencesOnRoutineModal from '../routine/ChangePreferencesOnRoutineModal';
import GoalTrackerService from '../../service/GoalTrackerService';
import EditGoalTime from './EditGoalTime';

const EditGoalTracker = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const [buttonLoader, setButtonLoader] = useState(false);
  const [calendarModal, setCalendarModal] = useState(false);
  const [calendarEndModal, setCalendarEndModal] = useState(false);
  // const [customModal, setCustomModal] = useState(false);
  const [date, setDate] = useState(new Date());
  const [daysList, setDaysList] = useState<any[]>([]);
  const [errMsg, setErrMsg] = useState(false);
  const [open, setOpen] = useState(false);
  const [repeatModal, setRepeatModal] = useState(false);
  const [repeatValue, setRepeatValue] = useState('D');
  // const [selectedDate, setSelectedDate] = useState('');
  const [showRepeatValue, setShowRepeatValue] = useState('Daily');
  // const [timeChecked, setTimeChecked] = useState(false);
  const [timeList, setTimeList] = useState<any[]>([]);
  const [preferenceModal, setPreferenceModal] = useState(false);
  const [preferences, setPreferences] = useState<any[]>([]);
  const [selectedStartDate, setSelectedStartDate] = useState(
    moment(new Date()).format('YYYY-MM-DD'),
  );
  const [selectedEndDate, setSelectedEndDate] = useState(
    moment(new Date()).format('YYYY-MM-DD'),
  );
  const [selectedStartDateUI, setSelectedStartDateUi] = useState(
    moment(new Date()).format('MM-DD-YYYY'),
  );
  const [selectedEndDateUI, setSelectedEndDateUi] = useState(
    moment(new Date()).format('MM-DD-YYYY'),
  );
  const toastRef = useRef<any>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {});

    // for repeat type
    if (route?.params?.data?.repeattype === 'D') {
      setRepeatValue('D');
      setShowRepeatValue('Daily');
    } else if (route?.params?.data?.repeattype === 'C') {
      setRepeatValue('C');
      setShowRepeatValue('Custom');
      let days = route?.params?.data?.repeatdays?.map((e: any) => e.day);

      setDaysList(days); //for pre selected custom days
    } else {
      setRepeatValue('');
      setShowRepeatValue('');
    }

    // for preferences value
    let result = [];
    var obj = {
      icon: route?.params?.data?.preferenceicon,
      id: route?.params?.data?.preference_id,
      name: route?.params?.data?.preferencename,
    };
    result.push(obj);
    setPreferences(result);

    // for time list
    let time = route?.params?.time?.map((e: any) => e.times);
    setTimeList(time);

    // for start date
    setSelectedStartDate(route?.params?.data?.schedule_startdate);
    setSelectedStartDateUi(
      moment(route?.params?.data?.schedule_startdate).format('MM-DD-YYYY'),
    );

    // for start date
    setSelectedEndDate(route?.params?.data?.schedule_enddate);
    setSelectedEndDateUi(
      moment(route?.params?.data?.schedule_enddate).format('MM-DD-YYYY'),
    );

    return unsubscribe;
  }, [navigation]);

  // list for time with cross button
  const renderAllTimeTab = ({item}: {item: any; index: any}) => {
    return <EditGoalTime items={item} />;
  };

  // list for time with cross button
  // const renderAllTimeTab = ({item}: {item: any; index: any}) => {
  //   return (
  //     <AllTimeWithCross items={item} handleChecked={handleTimeCrossCLick} />
  //   );
  // };

  // function on remove selected time click
  // const handleTimeCrossCLick = (selectedValue: any) => {
  //   setTimeChecked(true);
  //   if (timeList.includes(selectedValue)) {
  //     setTimeList(timeList.filter(ids => ids !== selectedValue));
  //   } else {
  //     setTimeList([...timeList, selectedValue]);
  //   }
  //   setErrMsg(false);
  // };

  // function for close modal after select the repeat data
  // const handleRepeatModalClose = (text: string) => {
  //   setRepeatModal(false);

  //   if (text === '' && repeatValue == '') {
  //     setRepeatValue('D');
  //     setShowRepeatValue('Daily');
  //   } else if (text === 'C') {
  //     setRepeatValue('C');
  //     setShowRepeatValue('Custom');
  //     setCustomModal(true);
  //   }
  // };

  // function for close modal after select the once data
  // const handleCustomModalClose = () => {
  //   setCustomModal(false);
  //   setRepeatValue('D');
  //   setShowRepeatValue('Daily');
  // };

  // function for close modal after select the custom data
  // const handleCustomSubmitClick = (dayList: any) => {
  //   setCustomModal(false);
  //   setDaysList(dayList);
  // };

  // function for close calender modal after select the date
  // const handleCalendarModalClose = () => {
  //   setCalendarModal(false);
  //   setRepeatValue('D');
  //   setShowRepeatValue('Daily');
  // };

  // function for close calender modal after select the date and submit click
  // const handleCalendarSubmitClick = (selectDate: string) => {
  //   setCalendarModal(false);
  //   setSelectedDate(moment(selectDate).format('YYYY-MM-DD'));
  //   setSelectedStartDateUi(moment(selectDate).format('MM-DD-YYYY'));
  // };

  // function for close calender modal after select the date
  // const handleEndCalendarModalClose = () => {
  //   setCalendarEndModal(false);
  //   setRepeatValue('D');
  //   setShowRepeatValue('Daily');
  // };

  // function for close calender modal after select the date and submit click
  // const handleEndCalendarSubmitClick = (selectDate: string) => {
  //   setCalendarEndModal(false);
  //   setSelectedEndDate(moment(selectDate).format('YYYY-MM-DD'));
  //   setSelectedEndDateUi(moment(selectDate).format('MM-DD-YYYY'));
  // };

  // change preference functionality
  const handlePreferenceSubmitClick = (arrayList: any, interest: any) => {
    setPreferenceModal(false);
    setPreferences(interest);
  };

  //  function for routine submit button click api call to create routine
  const onSubmit = (values: any) => {
    if (timeList.length >= 1) {
      setButtonLoader(true);
      setErrMsg(false);

      const feedBackData = new FormData();
      feedBackData.append('id', route?.params?.data?.goalId);
      feedBackData.append('name', values.title);
      // timeList.map((e: number, index: any) => {
      //   feedBackData.append(`schedule_time[${index}]`, e);
      // });
      // feedBackData.append('scheduleStartdate', selectedStartDate);
      // feedBackData.append('scheduleEnddate', selectedEndDate);
      // feedBackData.append('repeat', repeatValue);
      // daysList.map((e: number, index: any) => {
      //   feedBackData.append(`custom[${index}]`, e);
      // });
      feedBackData.append('preference_id', preferences[0].id);
      feedBackData.append('description', values.description);

      GoalTrackerService.postEditGoal(feedBackData)
        .then((response: any) => {
          setButtonLoader(false);
          toastRef.current.getToast(response.data.message, 'success');
          navigation.replace('StackNavigation', {
            screen: 'GoalTrackerDetails',
            params: {
              id: response?.data?.data?.goalId,
            },
          });
        })
        .catch((error: any) => {
          setButtonLoader(false);
          console.log(error);
        });
    } else {
      setErrMsg(true);
    }
  };

  const initialValues = {
    description: route?.params?.data?.description,
    title: route?.params?.data?.name,
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Edit Your Goal'}
        backButton={{
          visible: true,
          onClick: () => {
            navigation.goBack();
          },
        }}
      />

      {/* body section */}
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}>
        <Formik
          validationSchema={routineValidation}
          initialValues={initialValues}
          onSubmit={values => {
            onSubmit(values);
          }}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldTouched,
          }) => (
            <View style={styles.body}>
              {/* title section  */}
              <View>
                <TextInput
                  placeholder="Enter Title"
                  placeholderTextColor={colors.THEME_WHITE}
                  style={styles.textInput}
                  value={values.title}
                  onChangeText={handleChange('title')}
                  onBlur={() => {
                    handleBlur('title');
                    setFieldTouched('title');
                  }}
                />

                <Text style={styles.errorMessage}>
                  {touched.title && errors.title}
                </Text>
              </View>

              {/* change preference section  */}
              <View style={styles.preferencesDirection}>
                <View style={styles.preferenceContainer}>
                  <View style={styles.preferenceIcon}>
                    <Image
                      style={{height: 25, width: 25}}
                      resizeMode="contain"
                      source={{
                        uri: `${preferences[0]?.icon}`,
                      }}
                    />
                  </View>
                  <Text style={styles.preferenceTitle}>
                    {preferences[0]?.name}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => {
                    setPreferenceModal(true);
                  }}>
                  <Text style={styles.addEditText}>Change Preference</Text>
                </TouchableOpacity>
              </View>

              {/* time section  */}
              <View style={styles.timeContainer}>
                <Text style={styles.repeatLabel}>Selected Time</Text>

                <View style={styles.textDirection}>
                  {/* <TouchableOpacity
                    style={styles.createIconContainer}
                    onPress={() => {
                      setOpen(true);
                    }}>
                    <Image
                      style={styles.createIconImage}
                        resizeMode="contain"
                      source={require('../../assets/pngImage/Plus.png')}
                    />
                    <DatePicker
                      modal
                      open={open}
                      date={date}
                      title={'Select Time'}
                      mode={'time'}
                      theme="dark"
                      textColor={colors.THEME_ORANGE}
                      minuteInterval={15}
                      onConfirm={date => {
                        setOpen(false);
                        setDate(date);
                        setErrMsg(false);

                        let selectedTime = moment(date).format('hh:mm A');
                        if (timeList.includes(selectedTime)) {
                        } else {
                          setTimeList([...timeList, selectedTime]);
                        }
                      }}
                      onCancel={() => {
                        setOpen(false);
                      }}
                    />
                  </TouchableOpacity> */}

                  {timeList?.length > 0 ? (
                    <FlatList
                      data={timeList}
                      renderItem={renderAllTimeTab}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={(item: any, index: any) => String(index)}
                    />
                  ) : null}
                </View>
              </View>

              {errMsg ? (
                <Text style={styles.errorMessage}>Please Choose Time</Text>
              ) : (
                <Text style={styles.errorMessage} />
              )}

              {/* start and end date section */}
              <View style={styles.direction}>
                {/* start date section */}
                <View style={styles.dateTab}>
                  <Text style={styles.repeatLabel}>Start Date</Text>
                  <View style={styles.dateContainer}>
                    <Text style={styles.repeatLabel}>
                      {selectedStartDateUI}
                    </Text>
                    <TouchableOpacity
                      onPress={() => setCalendarModal(true)}
                      disabled={true}>
                      <Image
                        resizeMode="contain"
                        style={styles.dateText}
                        source={require('../../assets/pngImage/calenderIcon.png')}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* end date section */}
                <View style={styles.dateTab}>
                  <Text style={styles.repeatLabel}>Target Date</Text>
                  <View style={styles.dateContainer}>
                    <Text style={styles.repeatLabel}>{selectedEndDateUI}</Text>
                    <TouchableOpacity
                      onPress={() => setCalendarEndModal(true)}
                      disabled={true}>
                      <Image
                        resizeMode="contain"
                        style={styles.dateText}
                        source={require('../../assets/pngImage/calenderIcon.png')}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* repeat container  */}
              <TouchableOpacity
                disabled={true}
                onPress={() => setRepeatModal(true)}
                style={styles.repeatContainer}>
                <Text style={styles.repeatLabel}>Select Repeat Option</Text>
                <TouchableOpacity
                  disabled={true}
                  onPress={() => setRepeatModal(true)}
                  style={styles.direction}>
                  <Text style={styles.repeatValue}>{showRepeatValue}</Text>
                  <Image
                    resizeMode="contain"
                    source={require('../../assets/pngImage/repeatArrow.png')}
                  />
                </TouchableOpacity>
              </TouchableOpacity>

              {/* Description section  */}
              <View>
                <TextInput
                  placeholder="Enter Description Here…"
                  placeholderTextColor={colors.THEME_WHITE}
                  style={styles.descriptionInput}
                  value={values.description}
                  numberOfLines={3}
                  multiline={true}
                  textAlignVertical="top"
                  onChangeText={handleChange('description')}
                  onBlur={() => {
                    handleBlur('description');
                    setFieldTouched('description');
                  }}
                />
                <Text style={styles.errorMessage}>
                  {touched.description && errors.description}
                </Text>
              </View>

              {/* save group button  */}
              <View style={styles.buttonContainer}>
                <SubmitButton
                  loader={buttonLoader}
                  buttonText={'Submit'}
                  submitButton={handleSubmit}
                />
              </View>

              {/* repeat modal  */}
              {/* <RepeatGoalModal
                visibleModal={repeatModal}
                onClose={handleRepeatModalClose}
                repeatValue={repeatValue}
              /> */}

              {/* Custom modal  */}
              {/* <CustomModal
                visibleModal={customModal}
                onClose={handleCustomModalClose}
                onSubmitClick={handleCustomSubmitClick}
              /> */}

              {/* Calender modal  */}
              {/* <RepeatCalendarModal
                visibleModal={calendarModal}
                onClose={handleCalendarModalClose}
                onSubmitClick={handleCalendarSubmitClick}
              /> */}

              {/* Calender modal  for end date */}
              {/* <RepeatCalendarModal
                visibleModal={calendarEndModal}
                onClose={handleEndCalendarModalClose}
                onSubmitClick={handleEndCalendarSubmitClick}
              /> */}

              {/* modal for change and add preference list */}
              <ChangePreferencesOnRoutineModal
                visibleModal={preferenceModal}
                onClose={() => {
                  setPreferenceModal(false);
                }}
                onSubmitClick={handlePreferenceSubmitClick}
                preferences={preferences}
              />

              {/* toaster message for error response from API  */}
              <CommonToast ref={toastRef} />
            </View>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditGoalTracker;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {
    flex: 1,
    padding: 10,
    paddingBottom: '20%',
  },
  timeContainer: {
    backgroundColor: colors.BLACK3,
    borderColor: colors.GRAY,
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: 8,
    padding: 5,
    paddingLeft: 15,
    paddingVertical: 10,
  },
  createIconContainer: {
    alignItems: 'center',
    borderRadius: 50,
    height: 25,
    justifyContent: 'center',
    width: 25,
    borderColor: colors.WHITE,
    borderWidth: 1,
    marginRight: 10,
  },
  createIconImage: {
    borderRadius: 50,
    height: 15,
    width: 15,
  },
  dateTab: {
    width: '48%',
  },
  dateContainer: {
    alignItems: 'center',
    backgroundColor: colors.BLACK3,
    borderColor: colors.GRAY,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
    marginTop: 5,
    marginVertical: 15,
  },
  dateText: {
    height: 20,
    marginRight: 20,
    width: 20,
  },
  repeatContainer: {
    alignItems: 'center',
    backgroundColor: colors.BLACK3,
    borderColor: colors.GRAY,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginVertical: 8,
    padding: 5,
    paddingLeft: 15,
    paddingVertical: 10,
  },
  repeatValue: {
    color: colors.THEME_ORANGE,
    fontSize: 16,
    fontWeight: '400',
    marginRight: 5,
  },
  repeatLabel: {
    color: colors.lightGray,
    fontSize: 16,
    fontWeight: '500',
    padding: 5,
  },
  direction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  preferenceText: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 0.5,
    paddingVertical: 8,
  },
  textInput: {
    backgroundColor: colors.BLACK2,
    borderColor: colors.GRAY,
    borderWidth: 1,
    borderRadius: 10,
    color: colors.WHITE,
    fontSize: 16,
    padding: 15,
  },
  descriptionInput: {
    backgroundColor: colors.BLACK2,
    borderColor: colors.GRAY,
    borderWidth: 1,
    borderRadius: 10,
    color: colors.WHITE,
    fontSize: 16,
    height: 100,
    padding: 12,
  },
  errorMessage: {
    color: colors.RED,
    paddingHorizontal: 10,
  },
  routineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  buttonContainer: {paddingVertical: 10},
  textDirection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  addTimeText: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
  },
  noTimeText: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  noTimeTextOrange: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  preferencesDirection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  preferenceContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
    marginVertical: 10,
  },
  preferenceIcon: {
    alignItems: 'center',
    backgroundColor: colors.brightGray,
    borderRadius: 5,
    height: 33,
    justifyContent: 'center',
    width: 33,
  },
  preferenceTitle: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '400',
    paddingHorizontal: 8,
  },
  addEditText: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
    fontWeight: '400',
  },
});
