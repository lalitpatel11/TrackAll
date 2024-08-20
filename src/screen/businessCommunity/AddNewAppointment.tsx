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
  ScrollView,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Formik} from 'formik';
import moment from 'moment';
import CustomHeader from '../../constants/CustomHeader';
import {addNewBusinessAppointmentValidation} from '../../constants/SchemaValidation';
import {colors} from '../../constants/ColorConstant';
import SubmitButton from '../../constants/SubmitButton';
import RepeatCalendarModal from '../groups/RepeatCalendarModal';
import CommonToast from '../../constants/CommonToast';
import BusinessService from '../../service/BusinessService';
import AllServiceTab from './AllServiceTab';
import AllTimeSlotTab from './AllTimeSlotTab';

const AddNewAppointment = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const [businessId, setBusinessId] = useState<number>(
    route?.params?.businessId,
  );
  const [loader, setLoader] = useState(false);
  const toastRef = useRef<any>();
  const [errMsg, setErrMsg] = useState(false);
  const [calendarModal, setCalendarModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    moment(new Date()).format('YYYY-MM-DD'),
  );
  const [servicePopUp, setServicePopUp] = useState(false);
  const [allServices, setAllServices] = useState([]);
  const [appointmentService, setAppointmentService] = useState();
  const [timeSlotPopUp, setTimeSlotPopUp] = useState(false);
  const [allTimeSLots, setAllTimeSLots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState({});
  const [dates, setDates] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setBusinessId(route?.params?.businessId);
      getAllService();
      getUnavailableDates();
    });
    return unsubscribe;
  }, [navigation]);

  // navigation for back arrow click
  const handleBackClick = () => {
    navigation.goBack();
  };

  // function for api call to get all the services
  const getAllService = () => {
    const body = {
      businessid: businessId,
    };

    BusinessService.postAllBusinessOnService(body)
      .then((response: any) => {
        setAllServices(response?.data?.allservicelist);
      })
      .catch(error => {
        console.log(error);
      });
  };

  // list for service tab
  // const renderServiceList = ({item}: {item: any; index: any}) => {
  //   return <AllServiceTab items={item} selectService={handleSelectService} />;
  // };

  // function for select service click
  const handleSelectService = (data: any) => {
    setErrMsg(false);
    setServicePopUp(false);
    setAppointmentService(data);
    getAllTimeSlot(data?.serviceid, selectedDate);
    setTimeSlotPopUp(false);
    setSelectedTimeSlot({});
  };

  // function for api call to get all time on services
  const getAllTimeSlot = (serviceid?: any, date?: any) => {
    const body = {
      businessid: businessId,
      date: date ? date : selectedDate,
      serviceid: serviceid ? serviceid : appointmentService?.serviceid,
    };
    BusinessService.postAllTimeSLot(body)
      .then((response: any) => {
        setAllTimeSLots(response?.data?.timeslotslisting);
      })
      .catch(error => {
        console.log(error);
      });
  };

  // list for time slot tab
  // const renderTimeList = ({item}: {item: any; index: any}) => {
  //   return (
  //     <AllTimeSlotTab items={item} selectTimeSLot={handleSelectTimeSLot} />
  //   );
  // };

  // function for select service click
  const handleSelectTimeSLot = (data: any) => {
    setErrMsg(false);
    setTimeSlotPopUp(false);
    setSelectedTimeSlot(data);
  };

  // function for calender submit click after select date
  const handleCalendarSubmitClick = (selectDate: string) => {
    setCalendarModal(false);
    setSelectedDate(moment(selectDate).format('YYYY-MM-DD'));
    setTimeSlotPopUp(false);
    setSelectedTimeSlot({});
    getAllTimeSlot(
      appointmentService?.serviceid,
      moment(selectDate).format('YYYY-MM-DD'),
    );
  };

  // function for submit button click for api call to create the appointment
  const onSubmit = async (values: any) => {
    Keyboard.dismiss();
    if (
      appointmentService?.servicename &&
      selectedTimeSlot?.slot_start_time != null
    ) {
      setLoader(true);
      setErrMsg(false);

      const data = new FormData();
      data.append('date', selectedDate);
      data.append('starttime', selectedTimeSlot?.slot_start_time);
      data.append('endtime', selectedTimeSlot?.slot_end_time);
      data.append('title', values.appointmentTitle);
      data.append('description', values.appointmentDescription);
      data.append('businessid', businessId);
      data.append('serviceid', appointmentService?.serviceid);

      BusinessService.postRequestForAppointments(data)
        .then((response: any) => {
          setLoader(false);
          toastRef.current.getToast(response?.data?.message, 'success');
          navigation.goBack();
        })
        .catch((error: any) => {
          setLoader(false);
          console.log(error, 'error');
        });
    } else {
      setErrMsg(true);
    }
  };

  // function for get unavailable dates for calender
  const getUnavailableDates = async () => {
    const data = {
      businessid: businessId,
    };

    BusinessService.postUnAvailabilityService(data)
      .then((response: any) => {
        setDates(response?.data?.dates);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const initialValues = {
    appointmentDescription: '',
    appointmentTitle: '',
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Add Appointment'}
        backButton={{
          visible: true,
          onClick: () => {
            handleBackClick();
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
              {/* business name  section */}
              <View style={{marginBottom: 10}}>
                <Text style={styles.heading}>Business Name</Text>
                <TextInput
                  editable={false}
                  placeholder="Business Name"
                  placeholderTextColor={colors.WHITE}
                  style={styles.textInput}
                  value={route?.params?.businessName}
                />
              </View>

              {/* select service section */}
              <View>
                <Text style={styles.heading}>Select Service</Text>
                <TextInput
                  placeholder="Select Service"
                  placeholderTextColor={colors.WHITE}
                  style={styles.textInput}
                  value={appointmentService?.servicename}
                  editable={false}
                />

                {/* arrow based on true false value for popup */}
                {!servicePopUp ? (
                  <TouchableOpacity
                    style={styles.popUpIconContainer}
                    onPress={() => {
                      setServicePopUp(true);
                    }}>
                    <Image
                      resizeMode="contain"
                      style={styles.icon}
                      source={require('../../assets/pngImage/downarrow.png')}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.popUpIconContainer}
                    onPress={() => {
                      setServicePopUp(false);
                    }}>
                    <Image
                      resizeMode="contain"
                      style={styles.icon}
                      source={require('../../assets/pngImage/uparrow.png')}
                    />
                  </TouchableOpacity>
                )}

                {/* error msg for select service */}
                {errMsg ? (
                  <Text style={styles.errorMessage}>
                    *Please select service.
                  </Text>
                ) : null}

                {/* popup and value based on arrow click */}
                {servicePopUp ? (
                  <View style={styles.serviceListContainer}>
                    {/* <FlatList
                      data={allServices}
                      renderItem={renderServiceList}
                      keyExtractor={(item: any, index: any) => String(index)}
                    /> */}
                    {allServices?.length > 0 ? (
                      <ScrollView nestedScrollEnabled={true}>
                        {allServices.map(item => {
                          return (
                            <AllServiceTab
                              items={item}
                              selectService={handleSelectService}
                            />
                          );
                        })}
                      </ScrollView>
                    ) : (
                      <Text style={styles.noDataText}>
                        No Service Available.
                      </Text>
                    )}
                  </View>
                ) : null}
              </View>

              {/* date section */}
              <View style={{marginBottom: 5}}>
                <Text style={styles.heading}>Select Date</Text>
                <View style={styles.calendarDateContainer}>
                  <TextInput
                    editable={false}
                    placeholder={'MM-DD-YYYY'}
                    placeholderTextColor={colors.WHITE}
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
                      style={styles.timeIcon}
                      source={require('../../assets/pngImage/CalendarBlank1.png')}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* select time slot section */}
              <View>
                <Text style={styles.heading}>Select Time Slot</Text>
                <Text style={styles.textInput}>
                  {selectedTimeSlot?.slot_start_time != null ? (
                    <>
                      {selectedTimeSlot?.slot_start_time} -
                      {selectedTimeSlot?.slot_end_time}
                    </>
                  ) : (
                    'Select Time Slot'
                  )}
                </Text>

                {/* arrow based on true false value for popup */}
                {!timeSlotPopUp ? (
                  <TouchableOpacity
                    style={styles.popUpIconContainer}
                    onPress={() => {
                      setTimeSlotPopUp(true);
                    }}>
                    <Image
                      resizeMode="contain"
                      style={styles.icon}
                      source={require('../../assets/pngImage/downarrow.png')}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.popUpIconContainer}
                    onPress={() => {
                      setTimeSlotPopUp(false);
                    }}>
                    <Image
                      resizeMode="contain"
                      style={styles.icon}
                      source={require('../../assets/pngImage/uparrow.png')}
                    />
                  </TouchableOpacity>
                )}

                {/* popup and value based on arrow click */}
                {timeSlotPopUp ? (
                  <View style={styles.serviceListContainer}>
                    {allTimeSLots?.length > 0 ? (
                      //    <FlatList
                      //    data={allTimeSLots}
                      //    renderItem={renderTimeList}
                      //    keyExtractor={(item: any, index: any) => String(index)}
                      //  />
                      <ScrollView nestedScrollEnabled={true}>
                        {allTimeSLots.map(item => {
                          return (
                            <AllTimeSlotTab
                              items={item}
                              selectTimeSLot={handleSelectTimeSLot}
                            />
                          );
                        })}
                      </ScrollView>
                    ) : (
                      <Text style={styles.noDataText}>
                        No Time Slots Available.
                      </Text>
                    )}
                  </View>
                ) : null}
              </View>

              {/* error msg for select time slot */}
              {errMsg ? (
                <Text style={styles.errorMessage}>
                  *Please select time slot.
                </Text>
              ) : null}

              {/* title section */}
              <View>
                <Text style={styles.heading}>Appointment Title</Text>
                <TextInput
                  placeholder="Appointment Title"
                  placeholderTextColor={colors.WHITE}
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
                  placeholderTextColor={colors.WHITE}
                  style={styles.descriptionInput}
                  numberOfLines={3}
                  multiline={true}
                  textAlignVertical="top"
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
                unAvailableDates={dates}
                onSubmitClick={handleCalendarSubmitClick}
              />

              {/* toaster message for error response from API */}
              <CommonToast ref={toastRef} />
            </View>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddNewAppointment;

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
    height: 50,
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
    height: 50,
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
  descriptionInput: {
    backgroundColor: colors.BLACK3,
    borderRadius: 10,
    color: colors.WHITE,
    fontSize: 16,
    height: 100,
    padding: 12,
  },
  heading: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
    marginTop: 10,
    paddingBottom: 5,
    paddingHorizontal: 10,
  },
  timeIcon: {
    height: 20,
    marginRight: 20,
    width: 20,
    tintColor: colors.THEME_ORANGE,
  },
  noDataText: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.BLACK,
    textAlign: 'center',
    alignItems: 'center',
    marginTop: 8,
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
  icon: {
    height: 20,
    width: 20,
  },
  serviceListContainer: {
    backgroundColor: colors.lightYellow,
    borderColor: colors.brightGray,
    borderRadius: 8,
    borderWidth: 1,
    height: 'auto',
    maxHeight: 230,
    minHeight: 50,
    paddingVertical: 5,
    width: 'auto',
  },
});
