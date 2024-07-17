// external imports
import {
  ActivityIndicator,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import EventCalendar from 'react-native-events-calendar';
import React, {useEffect, useState} from 'react';
import moment from 'moment';
// internal imports
import CalendarModal from '../../expenseManagement/CalendarModal';
import CustomHeader from '../../../constants/CustomHeader';
import OrganizationService from '../../../service/OrganisationService';
import {colors} from '../../../constants/ColorConstant';

export const {width, height} = Dimensions.get('screen');

const AllOrganizationAppointment = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const [pageLoader, setPageLoader] = useState(false);
  const [calendarModal, setCalendarModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    moment(route?.params?.date).format('YYYY-MM-DD'),
  );
  const [date, setDate] = useState(
    moment(route?.params?.date).format('MM-DD-YYYY'),
  );
  const [allAppointments, setAllAppointments] = useState([
    // {
    // start: '2024-02-23 02:00:00', // yyyy/mm/dd
    // end: '2024-02-23 04:00:00',
    // title: 'New Year Party',
    // summary: 'xyz Location',
    // name: 'Remindably',
    // description: 'remindably',
    // },
  ]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setPageLoader(true);
      setSelectedDate(moment(route?.params?.date).format('YYYY-MM-DD'));
      setDate(moment(route?.params?.date).format('MM-DD-YYYY'));
      getData();
    });
    return unsubscribe;
  }, [navigation]);

  // function for get all appointment data according to date click on api call
  const getData = async () => {
    const body = {
      date: selectedDate,
    };

    OrganizationService.postAllAppointmentOnDate(body)
      .then((response: any) => {
        setPageLoader(false);

        //loop for add key for start and end time with date
        let newArray: any = [];
        for (
          let index = 0;
          index < response?.data?.allappointments.length;
          index++
        ) {
          var newObject = {
            ...response?.data?.allappointments[index],
            start:
              moment(new Date()).format('YYYY-MM-DD') +
              ' ' +
              response?.data?.allappointments[index].starttime,
            end:
              moment(new Date()).format('YYYY-MM-DD') +
              ' ' +
              response?.data?.allappointments[index].endtime,
          };

          newArray.push(newObject);
        }
        setAllAppointments(newArray);
      })
      .catch(error => {
        setPageLoader(false);
        console.log(error, 'error');
      });
  };

  // function for calender submit click after select date
  const handleCalendarSubmitClick = (selectDate: string) => {
    setCalendarModal(false);
    setSelectedDate(moment(selectDate).format('YYYY-MM-DD'));
    setDate(moment(selectDate).format('MM-DD-YYYY'));
    getData();
  };

  // function for appointment click
  const appointmentClicked = () => {};

  // function for appointment click
  const handleAppointmentClicked = (appointmentId: any) => {
    navigation.navigate('StackNavigation', {
      screen: 'AppointmentDetail',
      params: {
        data: appointmentId,
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'All Appointments'}
        backButton={{
          visible: true,
          onClick: () => {
            navigation.goBack();
          },
        }}
      />

      {/* calendar header part */}
      <View style={styles.calenderContainer}>
        <View style={styles.calenderBox}>
          <Text style={styles.dateLabel}>Choose Date</Text>
          <TextInput
            editable={false}
            placeholder={'MM-DD-YYYY'}
            placeholderTextColor={colors.GRAY}
            value={date}
            style={styles.dateLabel}
          />
          <TouchableOpacity
            onPress={() => {
              setCalendarModal(true);
            }}>
            <Image
              source={require('../../../assets/pngImage/CalendarBlank1.png')}
              style={styles.calendarIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* body section */}
      {!pageLoader ? (
        <SafeAreaView style={styles.container}>
          <ScrollView nestedScrollEnabled={true}>
            {/* package */}
            <View style={styles.body}>
              <View style={styles.appointmentContainer} />
              <EventCalendar
                eventTapped={appointmentClicked} // Function on event press
                events={allAppointments} // Passing the Array of event
                width={width} // Container width
                size={60}
                renderEvent={(data: any) => {
                  return (
                    <View style={styles.appointmentBox}>
                      <TouchableOpacity
                        style={{width: '100%', alignSelf: 'center'}}
                        onPress={() => {
                          handleAppointmentClicked(data?.id);
                        }}>
                        {/* group name */}
                        {data?.groupname ? (
                          <View style={styles.direction}>
                            <Text style={styles.titleText}>Group Name: </Text>
                            <Text style={styles.descriptionText}>
                              {data?.groupname}
                            </Text>
                          </View>
                        ) : null}

                        {/* requested by name */}
                        {data?.requestedby ? (
                          <View style={styles.direction}>
                            <Text style={styles.titleText}>Requested By: </Text>
                            <Text style={styles.descriptionText}>
                              {data?.requestedby}
                            </Text>
                          </View>
                        ) : null}

                        {/* group title */}
                        <View style={styles.direction}>
                          <Text style={styles.titleText}>Title: </Text>
                          <Text style={styles.descriptionText}>
                            {data?.title}
                          </Text>
                        </View>

                        {/* group description */}
                        <View style={styles.direction}>
                          <Text style={styles.titleText}>Description: </Text>
                          <Text style={styles.descriptionText}>
                            {data?.description}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                }}
                scrollToFirst
              />
            </View>

            {/* Calender modal */}
            <CalendarModal
              visibleModal={calendarModal}
              onClose={() => {
                setCalendarModal(false);
              }}
              onSubmitClick={handleCalendarSubmitClick}
            />
          </ScrollView>
        </SafeAreaView>
      ) : (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.THEME_ORANGE} />
        </View>
      )}
    </View>
  );
};

export default AllOrganizationAppointment;

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
  calenderContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
  },
  calenderBox: {
    alignItems: 'center',
    backgroundColor: colors.BLACK3,
    borderRadius: 10,
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 10,
    width: '100%',
  },
  dateLabel: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  calendarIcon: {
    alignSelf: 'center',
    height: 18,
    resizeMode: 'stretch',
    tintColor: colors.THEME_ORANGE,
    width: 18,
  },
  body: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  appointmentContainer: {
    backgroundColor: colors.WHITE,
    height: 45,
    position: 'absolute',
    top: 4,
    width: '100%',
    zIndex: 999,
  },
  appointmentBox: {
    alignSelf: 'center',
    backgroundColor: colors.brightOrange,
    borderRadius: 4,
    elevation: 3,
    marginTop: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    width: '98%',
  },
  direction: {
    flexDirection: 'row',
  },
  titleText: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
    fontWeight: '500',
  },
  descriptionText: {
    color: colors.THEME_BLACK,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'justify',
    width: '75%',
  },
});
