import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  TextInput,
  Keyboard,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Formik} from 'formik';
import CustomHeader from '../../../constants/CustomHeader';
import {addNewBusinessAppointmentValidation} from '../../../constants/SchemaValidation';
import {colors} from '../../../constants/ColorConstant';
import SubmitButton from '../../../constants/SubmitButton';
import CommonToast from '../../../constants/CommonToast';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import BusinessService from '../../../service/BusinessService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RepeatCalendarModal from '../../groups/RepeatCalendarModal';
import GroupTabOnAppointmentCreate from './GroupTabOnAppointmentCreate';
import OrganizationService from '../../../service/OrganisationService';

const AddNewBusinessAppointment = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const [loader, setLoader] = useState(false);
  const toastRef = useRef<any>();
  const [startTime, setStartTime] = useState(new Date());
  const [startOpen, setStartOpen] = useState(false);
  const [errMsg, setErrMsg] = useState(false);
  const [startTimeList, setStartTimeList] = useState('');
  const [endDate, setEndDate] = useState(new Date());
  const [endOpen, setEndOpen] = useState(false);
  const [endTimeList, setEndTimeList] = useState('');
  const [calendarModal, setCalendarModal] = useState(false);
  const [groupType, setGroupType] = useState('P');
  const [selectedDate, setSelectedDate] = useState(
    moment(new Date()).format('YYYY-MM-DD'),
  );
  const [myGroupList, setMyGroupList] = useState([]);
  const [groupArrayList, setGroupArrayList] = useState<any[]>([]);
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // for preselected group
      setGroupArrayList([...groupArrayList, route?.params?.data?.groupid]);

      // for select type
      setGroupType(route?.params?.data?.selecttype);

      // for select date
      setSelectedDate(route?.params?.data?.date);

      // for start time
      setSelectedStartTime(route?.params?.data?.start);
      setStartTimeList(route?.params?.data?.start);

      // for end time
      setSelectedEndTime(route?.params?.data?.end);
      setEndTimeList(route?.params?.data?.end);

      getAllGroups();
    });
    return unsubscribe;
  }, [navigation]);

  // function for get all my group data on api call
  const getAllGroups = async () => {
    const accountId = await AsyncStorage.getItem('accountId');
    const userType = await AsyncStorage.getItem('userType');

    {
      userType == '2'
        ? BusinessService.getMyBusinessGroups(accountId)
            .then((response: any) => {
              setMyGroupList(response?.data?.mygroups);
            })
            .catch((error: any) => {
              console.log(error);
            })
        : OrganizationService.getMyOrganizationGroups()
            .then((response: any) => {
              setMyGroupList(response?.data?.mygroups);
            })
            .catch((error: any) => {
              console.log(error);
            });
    }
  };

  // function for calender submit click after select date
  const handleCalendarSubmitClick = (selectDate: string) => {
    setCalendarModal(false);
    setSelectedDate(moment(selectDate).format('YYYY-MM-DD'));
  };

  // list for group tab
  const renderGroupItem = ({item}: {item: any; index: any}) => {
    return (
      <GroupTabOnAppointmentCreate
        items={item}
        checkedList={groupArrayList}
        handleChecked={handleChecked}
      />
    );
  };

  // function on select group click
  const handleChecked = (selectedId: number) => {
    setGroupArrayList([selectedId]);
  };

  // function for submit button click for api call to edit the appointment
  const onSubmit = async (values: any) => {
    const accountId = await AsyncStorage.getItem('accountId');
    Keyboard.dismiss();
    setLoader(true);

    const data = new FormData();
    data.append('date', selectedDate);
    data.append('starttime', selectedStartTime);
    data.append('endtime', selectedEndTime);
    data.append('title', values.appointmentTitle);
    data.append('description', values.appointmentDescription);
    data.append('businessid', accountId);
    data.append('selecttype', groupType);
    data.append('id', route?.params?.data?.id);

    if (groupType == 'G') {
      data.append('groupid', groupArrayList[0]);
    }

    BusinessService.postEditBusinessAppointment(data)
      .then((response: any) => {
        setLoader(false);
        toastRef.current.getToast(response?.data?.message, 'success');
        navigation.replace('StackNavigation', {
          screen: 'AppointmentDetail',
          params: {
            data: route?.params?.data?.id,
          },
        });
      })
      .catch((error: any) => {
        setLoader(false);
        console.log(error, 'error');
      });
  };

  const initialValues = {
    appointmentDescription: route?.params?.data?.description,
    appointmentTitle: route?.params?.data?.title,
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Edit Appointment'}
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
          validationSchema={addNewBusinessAppointmentValidation}
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
              <View>
                {/* select type section */}
                <Text style={styles.heading}>Select Type</Text>
                <View style={styles.typeDirection}>
                  <TouchableOpacity
                    style={styles.radioDirection}
                    onPress={() => {
                      setGroupType('P');
                    }}>
                    <View
                      style={
                        groupType === 'P'
                          ? styles.selectedRadio
                          : styles.unSelectedRadio
                      }>
                      <View
                        style={
                          groupType === 'P' ? styles.selectedRadioFill : null
                        }
                      />
                    </View>
                    <Text style={styles.cardName}>Personal</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.radioDirection}
                    onPress={() => {
                      setGroupType('G');
                      getAllGroups();
                    }}>
                    <View
                      style={
                        groupType === 'G'
                          ? styles.selectedRadio
                          : styles.unSelectedRadio
                      }>
                      <View
                        style={
                          groupType === 'G' ? styles.selectedRadioFill : null
                        }
                      />
                    </View>
                    <Text style={styles.cardName}>Select Group</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {groupType == 'G' ? (
                <View>
                  {/* group list on the basis of select group */}
                  {myGroupList?.length > 0 ? (
                    <View style={styles.groupContainer}>
                      <FlatList
                        data={myGroupList}
                        showsHorizontalScrollIndicator={false}
                        renderItem={renderGroupItem}
                        horizontal
                        keyExtractor={(item: any, index: any) => String(index)}
                      />
                    </View>
                  ) : null}
                </View>
              ) : null}

              {/* date section */}
              <View style={{marginBottom: 5}}>
                <Text style={styles.heading}>Select Date</Text>
                <View style={styles.calendarDateContainer}>
                  <TextInput
                    editable={false}
                    placeholder={'MM-DD-YYYY'}
                    placeholderTextColor={colors.GRAY}
                    value={selectedDate}
                    style={{
                      color: colors.WHITE,
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setCalendarModal(!calendarModal);
                    }}
                    style={styles.calendarIcon}>
                    <Image
                      resizeMode="contain"
                      tintColor={colors.THEME_ORANGE}
                      style={styles.timeIcon}
                      source={require('../../../assets/pngImage/CalendarBlank1.png')}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* start and end time section */}
              <View style={styles.direction}>
                {/* start time section */}
                <View style={styles.timeTab}>
                  <Text style={styles.heading}>Start Time</Text>
                  <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>
                      {selectedStartTime != '' ? selectedStartTime : '00:00'}
                    </Text>
                    <TouchableOpacity onPress={() => setStartOpen(true)}>
                      <Image
                        resizeMode="contain"
                        style={styles.timeIcon}
                        source={require('../../../assets/pngImage/Clock.png')}
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
                        setStartTimeList(moment(date).format('HH:mm'));
                        let selectedTime = moment(date).format('hh:mm A');
                        setSelectedStartTime(selectedTime);
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
                      {selectedEndTime != '' ? selectedEndTime : '00:00'}
                    </Text>
                    <TouchableOpacity onPress={() => setEndOpen(true)}>
                      <Image
                        resizeMode="contain"
                        style={styles.timeIcon}
                        source={require('../../../assets/pngImage/Clock.png')}
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
                        setEndTimeList(moment(date).format('HH:mm'));
                        let selectedTime = moment(date).format('hh:mm A');
                        setSelectedEndTime(selectedTime);
                      }}
                      onCancel={() => {
                        setEndOpen(false);
                      }}
                    />
                  </View>
                </View>
              </View>

              {/* title section */}
              <View>
                <Text style={styles.heading}>Appointment Title</Text>
                <TextInput
                  placeholder="Appointment Title"
                  placeholderTextColor={colors.GRAY}
                  style={styles.textInput}
                  value={values.appointmentTitle}
                  onChangeText={handleChange('appointmentTitle')}
                  onBlur={() => {
                    handleBlur('appointmentTitle');
                    setFieldTouched('appointmentTitle');
                  }}
                />
                <Text style={styles.errorMessage}>
                  {touched.appointmentTitle && errors.appointmentTitle}
                </Text>
              </View>

              {/* description section */}
              <View>
                <Text style={styles.heading}>Appointment Description</Text>
                <TextInput
                  placeholder="Appointment Description"
                  placeholderTextColor={colors.GRAY}
                  style={styles.textInput}
                  value={values.appointmentDescription}
                  onChangeText={handleChange('appointmentDescription')}
                  onBlur={() => {
                    handleBlur('appointmentDescription');
                    setFieldTouched('appointmentDescription');
                  }}
                />
                <Text style={styles.errorMessage}>
                  {touched.appointmentDescription &&
                    errors.appointmentDescription}
                </Text>
              </View>

              {/* submit button */}
              <SubmitButton
                loader={loader}
                buttonText={'Save'}
                submitButton={handleSubmit}
              />

              {/* Calender modal */}
              <RepeatCalendarModal
                visibleModal={calendarModal}
                onClose={() => {
                  setCalendarModal(false);
                }}
                onSubmitClick={handleCalendarSubmitClick}
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

export default AddNewBusinessAppointment;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {
    flex: 1,
    padding: 10,
    paddingBottom: 40,
  },
  textInput: {
    backgroundColor: colors.BLACK3,
    borderRadius: 8,
    color: colors.WHITE,
    fontSize: 16,
    padding: 12,
    paddingLeft: 22,
  },
  errorMessage: {
    color: colors.RED,
    fontSize: 14,
    paddingHorizontal: 10,
  },
  calendarDateContainer: {
    backgroundColor: colors.BLACK3,
    borderRadius: 8,
    flexDirection: 'row',
    height: 60,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 2,
  },
  calendarIcon: {
    alignItems: 'center',
    alignSelf: 'center',
    height: 25,
    justifyContent: 'center',
    width: 25,
  },
  image: {
    borderRadius: 50,
    height: '100%',
    width: '100%',
  },
  heading: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
    marginTop: 10,
    paddingBottom: 5,
    paddingHorizontal: 10,
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
  addTimeContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 16,
    height: 30,
    justifyContent: 'center',
    marginTop: 8,
    width: 89,
  },
  addTimeText: {
    color: colors.WHITE,
    fontSize: 12,
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
    tintColor: colors.THEME_ORANGE,
    width: 20,
  },
  typeDirection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '70%',
  },
  buttonContainer: {marginVertical: 20},
  radioDirection: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  unSelectedRadio: {
    alignItems: 'center',
    borderColor: colors.WHITE,
    borderRadius: 12,
    borderWidth: 2,
    height: 24,
    justifyContent: 'center',
    marginHorizontal: 3,
    width: 24,
  },
  selectedRadio: {
    alignItems: 'center',
    borderColor: colors.THEME_ORANGE,
    borderRadius: 12,
    borderWidth: 2,
    height: 24,
    justifyContent: 'center',
    marginHorizontal: 3,
    width: 24,
  },
  selectedRadioFill: {
    alignItems: 'center',
    backgroundColor: colors.THEME_ORANGE,
    borderColor: colors.BLACK,
    borderRadius: 12,
    borderWidth: 2,
    height: 20,
    justifyContent: 'center',
    marginHorizontal: 3,
    width: 20,
  },
  cardName: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '400',
    marginHorizontal: 5,
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
});
