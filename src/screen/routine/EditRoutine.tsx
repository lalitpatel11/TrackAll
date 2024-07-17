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
import DatePicker from 'react-native-date-picker';
import React, {useEffect, useRef, useState} from 'react';
import moment from 'moment';
import {Formik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
//internal imports
import AllTimeWithCross from '../groups/AllTimeWithCross';
import ChangePreferencesOnRoutineModal from './ChangePreferencesOnRoutineModal';
import CommonToast from '../../constants/CommonToast';
import CustomHeader from '../../constants/CustomHeader';
import CustomModal from '../groups/CustomModal';
import GroupServices from '../../service/GroupServices';
import InviteMemberOnRoutineModal from './InviteMemberOnRoutineModal';
import RecentlyAddedMembersTab from '../groups/RecentlyAddedMembersTab';
import RepeatCalendarModal from '../groups/RepeatCalendarModal';
import RepeatModal from '../groups/RepeatModal';
import SubmitButton from '../../constants/SubmitButton';
import {colors} from '../../constants/ColorConstant';
import {routineValidation} from '../../constants/SchemaValidation';

const EditRoutine = ({navigation, route}: {navigation: any; route: any}) => {
  const [buttonLoader, setButtonLoader] = useState(false);
  const [calendarModal, setCalendarModal] = useState(false);
  const [customModal, setCustomModal] = useState(false);
  const [date, setDate] = useState(new Date());
  const [daysList, setDaysList] = useState<any[]>([]);
  const [errMsg, setErrMsg] = useState(false);
  const [memberIdModal, setMemberIdModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [preferenceModal, setPreferenceModal] = useState(false);
  const [preferences, setPreferences] = useState<any[]>([]);
  const [repeatModal, setRepeatModal] = useState(false);
  const [repeatValue, setRepeatValue] = useState('O');
  const [routineId, setRoutineId] = useState(0);
  const [routineType, setRoutineType] = useState('S');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMembersId, setSelectedMembersId] = useState<number[]>([]);
  const [selectedMembersList, setSelectedMembersList] = useState<number[]>([]);
  const [showRepeatValue, setShowRepeatValue] = useState('Once');
  const [timeChecked, setTimeChecked] = useState(true);
  const [timeList, setTimeList] = useState<any[]>([]);
  const toastRef = useRef<any>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // routine id
      setRoutineId(route?.params?.data?.routineid);

      // for public or private type
      if (route?.params?.data?.routinetype === 'Private Routine') {
        setRoutineType('S');
      } else {
        setRoutineType('P');
      }
      // for repeat type
      if (route?.params?.data?.repeattype === 'Once') {
        setRepeatValue('O');
        setShowRepeatValue('Once');
      } else if (route?.params?.data?.repeattype === 'Daily') {
        setRepeatValue('D');
        setShowRepeatValue('Daily');
      } else if (route?.params?.data?.repeattype === 'Date') {
        setRepeatValue('T');
        setShowRepeatValue('Date');
        setSelectedDate(route?.params?.data?.repeatdate); //for pre selected repeat date
      } else if (route?.params?.data?.repeattype === 'Custom') {
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
        id: route?.params?.data?.preferenceid,
        name: route?.params?.data?.preferencename,
      };
      result.push(obj);
      setPreferences(result);

      // for time list
      let time = route?.params?.data?.time?.map((e: any) => e.times);
      setTimeList(time);

      //pre selected member list
      let memberIdList = route?.params?.data?.allmembers?.map((e: any) => e.id);
      setSelectedMembersId(memberIdList);
      setSelectedMembersList(route?.params?.data?.allmembers);
    });
    return unsubscribe;
  }, [navigation]);

  // list for time with cross button
  const renderAllTimeTab = ({item}: {item: any; index: any}) => {
    return (
      <AllTimeWithCross items={item} handleChecked={handleTimeCrossCLick} />
    );
  };

  // function on selected time cross click
  const handleTimeCrossCLick = (selectedValue: any) => {
    setTimeChecked(true);
    if (timeList.includes(selectedValue)) {
      setTimeList(timeList.filter(ids => ids !== selectedValue));
    } else {
      setTimeList([...timeList, selectedValue]);
    }
    setErrMsg(false);
  };

  // function for close modal after select the repeat data
  const handleRepeatModalClose = (text: string) => {
    setRepeatModal(false);

    if (text === '' && repeatValue == '') {
      setRepeatValue('O');
      setShowRepeatValue('Once');
    } else {
      if (text === 'O') {
        setRepeatValue('O');
        setShowRepeatValue('Once');
        setDaysList([]); //empty felid in case user select different repeat option
        setSelectedDate(''); //empty felid in case user select different repeat option
      } else if (text === 'D') {
        setRepeatValue('D');
        setShowRepeatValue('Daily');
        setDaysList([]); //empty felid in case user select different repeat option
        setSelectedDate(''); //empty felid in case user select different repeat option
      } else if (text === 'T') {
        setRepeatValue('T');
        setShowRepeatValue('Date');
        setCalendarModal(true);
        setDaysList([]); //empty felid in case user select different repeat option
      } else if (text === 'C') {
        setRepeatValue('C');
        setShowRepeatValue('Custom');
        setCustomModal(true);
        setSelectedDate(''); //empty felid in case user select different repeat option
      }
    }
  };

  // function for close modal after select the once data
  const handleCustomModalClose = () => {
    setCustomModal(false);
  };

  // function for close modal after select the custom data
  const handleCustomSubmitClick = (dayList: any) => {
    setCustomModal(false);
    setDaysList(dayList);
  };

  // function for close calender modal after select the date
  const handleCalendarModalClose = () => {
    setCalendarModal(false);
  };

  // function for close calender modal after select the date and submit click
  const handleCalendarSubmitClick = (selectDate: string) => {
    setCalendarModal(false);
    setSelectedDate(moment(selectDate).format('YYYY-MM-DD'));
  };

  // function for member modal close
  const handleMemberIdModalClose = () => {
    setMemberIdModal(false);
  };

  // function for close modal after member add
  const handleMemberIdAddClick = (memberIdList: any[], memberList: any[]) => {
    setMemberIdModal(false);
    setSelectedMembersId(memberIdList);
    setSelectedMembersList(memberList);
  };

  // list for time with cross icon
  const renderAddedMembers = ({item}: {item: any; index: any}) => {
    return <RecentlyAddedMembersTab item={item} />;
  };

  // change preference functionality
  const handlePreferenceSubmitClick = (arrayList: any, interest: any) => {
    setPreferenceModal(false);
    setPreferences(interest);
  };

  //  function for routine submit button click api call to edit routine
  const onSubmit = (values: any) => {
    if (timeList.length >= 1) {
      setButtonLoader(true);
      setErrMsg(false);
      const feedBackData = new FormData();
      feedBackData.append('businessid', route?.params?.data?.businessid);
      feedBackData.append('taskid', routineId);
      feedBackData.append('name', values.title);
      feedBackData.append('subtitle', values.subTitle);
      feedBackData.append('description', values.description);
      timeList?.map((e: number, index: any) => {
        feedBackData.append(`schedule_time[${index}]`, e);
      });
      feedBackData.append('repeat', repeatValue);
      daysList?.map((e: number, index: any) => {
        feedBackData.append(`custom[${index}]`, e);
      });
      feedBackData.append('date', selectedDate);
      feedBackData.append('repeat_time', 0);
      feedBackData.append('privacy', routineType);
      feedBackData.append('preference_id', preferences[0].id);
      if (selectedMembersId !== null) {
        selectedMembersId?.map((e: number, index: any) => {
          feedBackData.append(`member[${index}]`, e);
        });
      }

      GroupServices.postEditTask(feedBackData)
        .then((response: any) => {
          setButtonLoader(false);
          toastRef.current.getToast(response.data.message, 'success');
          navigation.replace('StackNavigation', {
            screen: 'RoutineDetails',
            params: {
              id: routineId,
            },
          });
        })
        .catch((error: any) => {
          setButtonLoader(false);
          console.log('error--', error);
        });
    } else {
      setErrMsg(true);
    }
  };

  const initialValues = {
    description: route?.params?.data?.description,
    subTitle: route?.params?.data?.subtitle,
    title: route?.params?.data?.title,
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Edit Routine'}
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
              {/* public and private section  */}
              <View style={styles.routineContainer}>
                <TouchableOpacity
                  style={
                    routineType === 'S'
                      ? styles.selectedPublicContainer
                      : styles.publicContainer
                  }
                  onPress={() => {
                    setRoutineType('S');
                  }}>
                  <Image
                    resizeMode="contain"
                    tintColor={routineType === 'S' ? colors.WHITE : colors.GRAY}
                    source={require('../../assets/pngImage/Lock.png')}
                  />
                  <Text
                    style={
                      routineType === 'S'
                        ? styles.selectedPublicText
                        : styles.publicText
                    }>
                    Private Routine
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={
                    routineType === 'P'
                      ? styles.selectedPublicContainer
                      : styles.publicContainer
                  }
                  onPress={() => {
                    setRoutineType('P');
                  }}>
                  <Image
                    resizeMode="contain"
                    tintColor={routineType === 'P' ? colors.WHITE : colors.GRAY}
                    source={require('../../assets/pngImage/Globe.png')}
                  />
                  <Text
                    style={
                      routineType === 'P'
                        ? styles.selectedPublicText
                        : styles.publicText
                    }>
                    Public Routine
                  </Text>
                </TouchableOpacity>
              </View>

              {/* text according to public and private routine type  */}
              {routineType === 'P' ? (
                <Text style={styles.noteText}>
                  Public Routine:- Routine will be shared in the public
                  community.
                </Text>
              ) : routineType === 'S' ? (
                <Text style={styles.noteText}>
                  Private Routine:- Routine can be shared with the group only.
                </Text>
              ) : null}

              {/* date time section  */}
              <View style={styles.textDirection}>
                <Text style={styles.preferenceText}>Time</Text>
                <TouchableOpacity
                  onPress={() => {
                    setOpen(true);
                  }}>
                  <Text style={styles.addEditText}>Add Time</Text>
                </TouchableOpacity>

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
              </View>
              <FlatList
                data={timeList}
                renderItem={renderAllTimeTab}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item: any, index: any) => String(index)}
              />

              {errMsg ? (
                <Text style={styles.errorMessage}>
                  Please choose repeat time
                </Text>
              ) : (
                <Text style={styles.errorMessage} />
              )}

              {/* repeat container  */}
              <TouchableOpacity
                onPress={() => setRepeatModal(true)}
                style={styles.repeatContainer}>
                <Text style={styles.repeatLabel}>Select Repeat Option</Text>
                <TouchableOpacity
                  onPress={() => setRepeatModal(true)}
                  style={styles.direction}>
                  <Text style={styles.repeatValue}>{showRepeatValue}</Text>
                  <Image
                    resizeMode="contain"
                    source={require('../../assets/pngImage/repeatArrow.png')}
                  />
                </TouchableOpacity>
              </TouchableOpacity>

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
                  <Text style={styles.addEditText}>Change preference</Text>
                </TouchableOpacity>
              </View>

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

              {/*Sub title section  */}
              <View>
                <TextInput
                  placeholder="Enter Sub Title (Optional)"
                  placeholderTextColor={colors.THEME_WHITE}
                  style={styles.textInput}
                  value={values.subTitle}
                  onChangeText={handleChange('subTitle')}
                  onBlur={() => {
                    handleBlur('subTitle');
                    setFieldTouched('subTitle');
                  }}
                />

                <Text style={styles.errorMessage}>
                  {touched.subTitle && errors.subTitle}
                </Text>
              </View>

              {/*Description section  */}
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

              <TouchableOpacity
                style={styles.inviteMemberContainer}
                onPress={() => {
                  setMemberIdModal(true);
                }}>
                <Image
                  resizeMode="contain"
                  style={{height: 20, width: 20}}
                  source={require('../../assets/pngImage/UserPlus.png')}
                />
                <Text style={styles.inviteMemberText}>Invite new user</Text>
              </TouchableOpacity>

              {selectedMembersList?.length > 0 ? (
                <FlatList
                  data={selectedMembersList}
                  renderItem={renderAddedMembers}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item: any, index: any) => String(index)}
                />
              ) : null}

              {/* save group button  */}
              <View style={{paddingVertical: 10}}>
                <SubmitButton
                  loader={buttonLoader}
                  buttonText={'Update Routine'}
                  submitButton={handleSubmit}
                />
              </View>

              {/* repeat modal  */}
              <RepeatModal
                visibleModal={repeatModal}
                onClose={handleRepeatModalClose}
                repeatValue={repeatValue}
              />

              {/* Custom modal  */}
              <CustomModal
                visibleModal={customModal}
                onClose={handleCustomModalClose}
                onSubmitClick={handleCustomSubmitClick}
                daysList={daysList}
              />

              {/* Calender modal  */}
              <RepeatCalendarModal
                visibleModal={calendarModal}
                onClose={handleCalendarModalClose}
                onSubmitClick={handleCalendarSubmitClick}
              />

              {/* Member Email Id modal  */}
              <InviteMemberOnRoutineModal
                visibleModal={memberIdModal}
                onClose={handleMemberIdModalClose}
                onSubmitClick={handleMemberIdAddClick}
                navigation={navigation}
                selectedMembersId={selectedMembersId}
                selectedMembersList={selectedMembersList}
              />

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

export default EditRoutine;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {
    flex: 1,
    padding: 10,
    paddingBottom: '10%',
  },
  repeatContainer: {
    alignItems: 'center',
    backgroundColor: colors.BLACK3,
    borderColor: colors.GRAY,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
    padding: 5,
  },
  direction: {flexDirection: 'row'},
  preferencesDirection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateTimeLabel: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '500',
    padding: 5,
  },
  noteText: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '400',
    padding: 5,
  },
  preferenceText: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 0.5,
    paddingVertical: 8,
  },
  textInput: {
    backgroundColor: colors.BLACK3,
    borderColor: colors.GRAY,
    borderRadius: 10,
    borderWidth: 1,
    color: colors.WHITE,
    fontSize: 16,
    padding: 12,
  },
  descriptionInput: {
    backgroundColor: colors.BLACK3,
    borderColor: colors.GRAY,
    borderRadius: 10,
    borderWidth: 1,
    color: colors.WHITE,
    fontSize: 16,
    height: 100,
    padding: 12,
  },
  errorMessage: {
    color: colors.RED,
    paddingHorizontal: 10,
  },
  inviteMemberContainer: {
    alignItems: 'center',
    backgroundColor: colors.GRAY,
    borderColor: colors.THEME_ORANGE,
    borderRadius: 30,
    borderStyle: 'dotted',
    borderWidth: 2,
    flexDirection: 'row',
    height: 45,
    justifyContent: 'center',
    marginBottom: 10,
    width: '48%',
  },
  inviteMemberText: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '500',
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  routineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  publicContainer: {
    alignItems: 'center',
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '45%',
  },
  publicText: {
    color: colors.GRAY,
    fontSize: 16,
    fontWeight: '500',
    paddingHorizontal: 5,
    paddingVertical: 15,
  },
  selectedPublicContainer: {
    alignItems: 'center',
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '45%',
  },
  selectedPublicText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
    paddingHorizontal: 5,
    paddingVertical: 15,
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
  textDirection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
});
