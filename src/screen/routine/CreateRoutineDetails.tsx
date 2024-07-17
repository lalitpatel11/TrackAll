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

const CreateRoutineDetails = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const [buttonLoader, setButtonLoader] = useState(false);
  const [calendarModal, setCalendarModal] = useState(false);
  const [customModal, setCustomModal] = useState(false);
  const [date, setDate] = useState(new Date());
  const [daysList, setDaysList] = useState<any[]>([]);
  const [errMsg, setErrMsg] = useState(false);
  const [memberIdModal, setMemberIdModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [repeatModal, setRepeatModal] = useState(false);
  const [repeatValue, setRepeatValue] = useState('O');
  const [routineType, setRoutineType] = useState('S');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMembersId, setSelectedMembersId] = useState<number[]>([]);
  const [selectedMembersList, setSelectedMembersList] = useState<any[]>([]);
  const [showRepeatValue, setShowRepeatValue] = useState('Once');
  const [timeChecked, setTimeChecked] = useState(false);
  const [timeList, setTimeList] = useState<any[]>([]);
  const [scheduleStartDate] = useState<any[]>([
    moment(new Date()).format('YYYY-MM-DD'),
  ]);
  const toastRef = useRef<any>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (route?.params?.screenName === 'COMMUNITY') {
        setRoutineType('P');
      } else {
        setRoutineType('S');
      }
    });
    return unsubscribe;
  }, [navigation]);

  // list for time with cross button
  const renderAllTimeTab = ({item}: {item: any; index: any}) => {
    return (
      <AllTimeWithCross items={item} handleChecked={handleTimeCrossCLick} />
    );
  };

  // function on remove selected time click
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
      } else if (text === 'D') {
        setRepeatValue('D');
        setShowRepeatValue('Daily');
      } else if (text === 'T') {
        setRepeatValue('T');
        setShowRepeatValue('Date');
        setCalendarModal(true);
      } else if (text === 'C') {
        setRepeatValue('C');
        setShowRepeatValue('Custom');
        setCustomModal(true);
      }
    }
  };

  // function for close modal after select the once data
  const handleCustomModalClose = () => {
    setCustomModal(false);
    setRepeatValue('O');
    setShowRepeatValue('Once');
  };

  // function for close modal after select the custom data
  const handleCustomSubmitClick = (dayList: any) => {
    setCustomModal(false);
    setDaysList(dayList);
  };

  // function for close calender modal after select the date
  const handleCalendarModalClose = () => {
    setCalendarModal(false);
    setRepeatValue('O');
    setShowRepeatValue('Once');
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
  const handleMemberIdAddClick = (memberList: any[], userList: any[]) => {
    setMemberIdModal(false);
    setSelectedMembersId(memberList);
    setSelectedMembersList(userList);
  };

  // list for time with cross icon
  const renderAddedMembers = ({item}: {item: any; index: any}) => {
    return <RecentlyAddedMembersTab item={item} />;
  };

  //  function for routine submit button click api call to create routine
  const onSubmit = (values: any) => {
    if (timeList.length >= 1) {
      setButtonLoader(true);
      setErrMsg(false);

      const feedBackData = new FormData();
      feedBackData.append('businessid', route?.params?.businessId);
      feedBackData.append('name', values.title);
      feedBackData.append('subtitle', values.subTitle);
      feedBackData.append('description', values.description);
      timeList.map((e: number, index: any) => {
        feedBackData.append(`schedule_time[${index}]`, e);
      });
      feedBackData.append('repeat', repeatValue);
      daysList.map((e: number, index: any) => {
        feedBackData.append(`custom[${index}]`, e);
      });
      feedBackData.append('date', selectedDate);
      feedBackData.append('task_type', 'R');
      feedBackData.append('repeat_time', 0);
      feedBackData.append('privacy', routineType);
      feedBackData.append('schedule_startdate', scheduleStartDate);
      feedBackData.append('preference_id', route?.params?.preferenceId[0]);
      selectedMembersId.map((e: number, index: any) => {
        feedBackData.append(`member[${index}]`, e);
      });
      GroupServices.postCreateTask(feedBackData)
        .then((response: any) => {
          setButtonLoader(false);
          navigation.replace('StackNavigation', {
            screen: 'RoutineDetails',
            params: {
              id: response?.data?.data?.routineid,
              screen: 'ROUTINE',
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
    description: '',
    subTitle: '',
    title: '',
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Create Your Routine'}
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

              {/* text according to routine type  */}
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
                  <Text style={styles.addTimeText}>Add Time</Text>
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

              {timeList?.length > 0 ? (
                <FlatList
                  data={timeList}
                  renderItem={renderAllTimeTab}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item: any, index: any) => String(index)}
                />
              ) : (
                <Text style={styles.noTimeText}>
                  No Time Selected. Click on
                  <Text style={styles.noTimeTextOrange}> “Add Time” </Text>
                  to add time.
                </Text>
              )}

              {errMsg ? (
                <Text style={styles.errorMessage}>
                  Please Choose Repeat Time
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
                  placeholder="Enter Sub Title"
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

              <View>
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
                  <Text style={styles.inviteMemberText}>Invite New User</Text>
                </TouchableOpacity>
              </View>

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
              <View style={styles.buttonContainer}>
                <SubmitButton
                  loader={buttonLoader}
                  buttonText={'Publish Routine'}
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
              {/* toaster message for error response from API  */}
              <CommonToast ref={toastRef} />
            </View>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateRoutineDetails;

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
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
    padding: 5,
  },
  direction: {flexDirection: 'row'},
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
    borderWidth: 1,
    borderRadius: 10,
    color: colors.WHITE,
    fontSize: 16,
    padding: 15,
  },
  descriptionInput: {
    backgroundColor: colors.BLACK3,
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
});
