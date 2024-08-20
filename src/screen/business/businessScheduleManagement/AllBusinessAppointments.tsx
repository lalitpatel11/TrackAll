import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import CustomHeader from '../../../constants/CustomHeader';
import {colors} from '../../../constants/ColorConstant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BusinessService from '../../../service/BusinessService';
import EventCalendar from 'react-native-events-calendar';
import CalendarModal from '../../expenseManagement/CalendarModal';
import moment from 'moment';

export const {width, height} = Dimensions.get('screen');

const AllBusinessAppointments = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  //variables
  const filterDate = useRef<any>(
    moment(route?.params?.date).format('YYYY-MM-DD'),
  );

  //hook : states
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
    const accountId = await AsyncStorage.getItem('accountId');

    const body = {
      businessid: accountId,
      date: filterDate.current,
    };
    console.log('Data', body);

    BusinessService.postAllAppointmentOnDate(body)
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
    filterDate.current = moment(selectDate).format('YYYY-MM-DD');
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
        <>
          {/* package */}
          <View style={styles.body}>
            <View style={styles.appointmentContainer} />
            <EventCalendar
              scrollEnabled={true}
              eventTapped={appointmentClicked} // Function on event press
              events={allAppointments} // Passing the Array of event
              width={width} // Container width
              size={60}
              renderEvent={(data: any) => {
                return (
                  <View style={styles.appointmentBox}>
                    <TouchableOpacity
                      style={{alignSelf: 'center'}}
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
              scrollToFirst={false}
            />
          </View>

          {/* Calender modal */}
          <CalendarModal
            visibleModal={calendarModal}
            onClose={() => {
              setCalendarModal(false);
            }}
            addedDate={route?.params?.date}
            onSubmitClick={handleCalendarSubmitClick}
          />
        </>
      ) : (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.THEME_ORANGE} />
        </View>
      )}
    </View>
  );
};

export default AllBusinessAppointments;

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '95%',
    alignSelf: 'center',
  },
  calenderBox: {
    width: '100%',
    height: 50,
    backgroundColor: colors.BLACK3,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  dateLabel: {
    color: colors.WHITE,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  calendarIcon: {
    height: 18,
    width: 18,
    resizeMode: 'stretch',
    alignSelf: 'center',
    tintColor: colors.THEME_ORANGE,
  },
  clearContainer: {
    width: 60,
    height: 50,
    backgroundColor: colors.THEME_ORANGE,
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 15,
  },
  body: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  appointmentContainer: {
    width: '100%',
    height: 45,
    position: 'absolute',
    backgroundColor: colors.WHITE,
    zIndex: 999,
    top: 4,
  },
  appointmentBox: {
    width: '98%',
    borderRadius: 4,
    alignSelf: 'center',
    backgroundColor: colors.brightOrange,
    shadowColor: '#000',
    shadowRadius: 2,
    shadowOpacity: 0.2,
    elevation: 3,
    padding: 10,
    marginTop: 10,
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
