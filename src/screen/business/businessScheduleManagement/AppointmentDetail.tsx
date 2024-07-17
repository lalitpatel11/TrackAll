import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  Image,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CustomHeader from '../../../constants/CustomHeader';
import {colors} from '../../../constants/ColorConstant';
import CommonToast from '../../../constants/CommonToast';
import BusinessService from '../../../service/BusinessService';
import moment from 'moment';
import CommentImagesTab from '../../groups/CommentImagesTab';
import DeleteAlertModal from '../../groups/DeleteAlertModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RejectAppointmentModal from './RejectAppointmentModal';

const AppointmentDetail = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const [appointmentId, setAppointmentId] = useState(route?.params?.data);
  const [appointmentDetails, setAppointmentDetails] = useState();
  const [pageLoader, setPageLoader] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [userType, setUserType] = useState<any>('1');
  const [accountId, setAccountId] = useState<any>('1');
  const [myUserId, setMyUserId] = useState<any>();
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const toastRef = useRef<any>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setPageLoader(true);
      setAppointmentId(route?.params?.data);
      getData();
    });
    return unsubscribe;
  }, [navigation]);

  const getData = async () => {
    const userType = await AsyncStorage.getItem('userType');
    setUserType(userType);
    const accountId = await AsyncStorage.getItem('accountId');
    setAccountId(accountId);
    const token = await AsyncStorage.getItem('userId');
    setMyUserId(token);

    setPageLoader(true);

    BusinessService.getAppointmentData(route?.params?.data)
      .then((response: any) => {
        setAppointmentDetails(response?.data?.appointmentdetail);
        setPageLoader(false);
      })
      .catch(error => {
        setPageLoader(false);
        console.log(error, 'error');
      });
  };

  // function for api call for accept appointment
  const handleAcceptAppointment = () => {
    const body = {
      appointmentid: route?.params?.data,
    };

    setPageLoader(true);
    BusinessService.postAcceptAppointment(body)
      .then((response: any) => {
        setPageLoader(false);
        toastRef.current.getToast(response.data.message, 'success');
        navigation.replace('DrawerNavigator', {
          screen: 'BottomNavigator',
          params: {
            screen: 'OrganizationHome',
          },
        });
      })
      .catch(error => {
        setPageLoader(false);
        console.log(error, 'error');
      });
  };

  // function for api call for reject appointment
  const handleRejectAppointment = () => {
    setRejectModalVisible(false);
    const body = {
      appointmentid: route?.params?.data,
    };
    setPageLoader(true);
    BusinessService.postRejectAppointment(body)
      .then((response: any) => {
        setPageLoader(false);
        toastRef.current.getToast(response.data.message, 'success');
        navigation.replace('DrawerNavigator', {
          screen: 'BottomNavigator',
          params: {
            screen: 'OrganizationHome',
          },
        });
      })
      .catch(error => {
        setPageLoader(false);
        console.log(error, 'error');
      });
  };

  // list for comments images
  const renderAddedImages = ({item}: {item: any; index: any}) => {
    return <CommentImagesTab commentImages={item} />;
  };

  // function for delete button click on api call to delete task
  const handleDelete = () => {
    setDeleteModal(false);
    BusinessService.getDeleteAppointment(appointmentId)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        navigation.goBack();
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Appointment Detail'}
        backButton={{
          visible: true,
          onClick: () => {
            navigation.goBack();
          },
        }}
      />

      {/* body section */}

      {!pageLoader ? (
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          style={styles.container}>
          <View style={styles.body}>
            {/* display edit and delete icon basis of customer id match  */}
            <View style={styles.iconsContainer}>
              {myUserId == appointmentDetails?.created_by ? (
                <View style={styles.direction}>
                  {/* edit icon  */}
                  <TouchableOpacity
                    style={styles.editContainer}
                    onPress={() => {
                      navigation.navigate('StackNavigation', {
                        screen: 'EditAppointment',
                        params: {
                          data: appointmentDetails,
                        },
                      });
                    }}>
                    <Image
                      resizeMode="contain"
                      style={styles.icon}
                      source={require('../../../assets/pngImage/editIcon.png')}
                    />
                  </TouchableOpacity>

                  {/* delete icon  */}
                  <TouchableOpacity
                    style={styles.editContainer}
                    onPress={() => {
                      setDeleteModal(true);
                    }}>
                    <Image
                      resizeMode="contain"
                      style={styles.icon}
                      source={require('../../../assets/pngImage/Trash.png')}
                    />
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>

            {/* Requested by section */}
            {appointmentDetails?.requestedby != '' ? (
              <View>
                <Text style={styles.heading}>Requested By</Text>
                <TextInput
                  editable={false}
                  placeholder="Requested By"
                  placeholderTextColor={colors.GRAY}
                  style={styles.textInput}
                  value={appointmentDetails?.requestedby}
                />
              </View>
            ) : null}

            {/* title section */}
            <View>
              <Text style={styles.heading}>Appointment Title</Text>
              <TextInput
                editable={false}
                placeholder="Appointment Title"
                placeholderTextColor={colors.GRAY}
                style={styles.textInput}
                value={appointmentDetails?.title}
              />
            </View>

            {/* description section */}
            <View>
              <Text style={styles.heading}>Appointment Description</Text>
              <TextInput
                editable={false}
                placeholder="Appointment Description"
                placeholderTextColor={colors.GRAY}
                style={styles.textInput}
                value={appointmentDetails?.description}
              />
            </View>

            {/* appointment group details */}
            {appointmentDetails?.groupname != null ? (
              <View>
                <Text style={styles.heading}>Appointment Group</Text>
                <TextInput
                  editable={false}
                  placeholder="Appointment Group"
                  placeholderTextColor={colors.GRAY}
                  style={styles.textInput}
                  value={appointmentDetails?.groupname}
                />
                {appointmentDetails?.groupimage != null ? (
                  <View style={styles.feedbackImageContainer}>
                    <Image
                      style={styles.image}
                      resizeMode="contain"
                      source={{
                        uri: `${appointmentDetails?.groupimage}`,
                      }}
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
                  value={moment(appointmentDetails?.date).format('MM-DD-YYYY')}
                  style={{
                    color: colors.WHITE,
                  }}
                />
                <View style={styles.calendarIcon}>
                  <Image
                    resizeMode="contain"
                    style={styles.timeIcon}
                    source={require('../../../assets/pngImage/CalendarBlank1.png')}
                  />
                </View>
              </View>
            </View>

            {/* start and end time section */}
            <View style={styles.direction}>
              {/* start time section */}
              <View style={styles.timeTab}>
                <Text style={styles.heading}>Start Time</Text>
                <View style={styles.timeContainer}>
                  <Text style={styles.timeText}>
                    {appointmentDetails?.start}
                  </Text>
                  <View>
                    <Image
                      resizeMode="contain"
                      style={styles.timeIcon}
                      source={require('../../../assets/pngImage/Clock.png')}
                    />
                  </View>
                </View>
              </View>

              {/* end time section */}
              <View style={styles.timeTab}>
                <Text style={styles.heading}>End Time</Text>
                <View style={styles.timeContainer}>
                  <Text style={styles.timeText}>{appointmentDetails?.end}</Text>
                  <View>
                    <Image
                      resizeMode="contain"
                      style={styles.timeIcon}
                      source={require('../../../assets/pngImage/Clock.png')}
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* uploaded images */}
            <View style={{marginBottom: 10}}>
              {appointmentDetails?.appointmentimages?.length >= 0 ? (
                <View style={{marginTop: 10}}>
                  <Text style={styles.heading}>Images</Text>
                  <FlatList
                    data={appointmentDetails?.appointmentimages}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderAddedImages}
                    keyExtractor={(item: any, index: any) => String(index)}
                  />
                </View>
              ) : null}
            </View>

            {/* accept, accepted, reject and rejected button */}
            {userType == '2' ? (
              <>
                {accountId == appointmentDetails?.businessid &&
                myUserId != appointmentDetails?.created_by ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                    }}>
                    {appointmentDetails?.status == '2' ? (
                      <View style={styles.appointmentAcceptContainer}>
                        <Text style={styles.appointmentText}>Accepted</Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.appointmentContainer}
                        onPress={() => {
                          handleAcceptAppointment();
                        }}>
                        <Text style={styles.appointmentText}>Accept</Text>
                      </TouchableOpacity>
                    )}

                    {appointmentDetails?.status == '3' ? (
                      <View style={styles.appointmentAcceptContainer}>
                        <Text style={styles.appointmentText}>Rejected</Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.appointmentContainer}
                        onPress={() => {
                          setRejectModalVisible(true);
                        }}>
                        <Text style={styles.appointmentText}>Reject</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ) : null}
              </>
            ) : null}

            {/* Delete alert modal for delete appointment */}
            <DeleteAlertModal
              visibleModal={deleteModal}
              onRequestClosed={() => {
                setDeleteModal(false);
              }}
              onPressRightButton={() => {
                handleDelete();
              }}
              subHeading={'Are you sure you want to delete this appointment ?'}
            />

            <RejectAppointmentModal
              visibleModal={rejectModalVisible}
              onClose={() => {
                setRejectModalVisible(false);
              }}
              onCreateClick={() => handleRejectAppointment()}
            />

            {/* toaster message for error response from API  */}
            <CommonToast ref={toastRef} />
          </View>
        </KeyboardAwareScrollView>
      ) : (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.THEME_ORANGE} />
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default AppointmentDetail;

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
  iconsContainer: {
    height: 30,
    position: 'absolute',
    right: 10,
    top: 10,
    width: '20%',
    zIndex: 1,
  },
  editContainer: {
    alignItems: 'center',
    borderRadius: 50,
    justifyContent: 'center',
    marginHorizontal: 3,
    padding: 3,
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
  numberInput: {
    backgroundColor: colors.BLACK3,
    borderColor: colors.brightGray,
    borderRadius: 8,
    color: colors.WHITE,
    fontSize: 16,
    padding: 15,
    paddingLeft: 30,
  },
  codeText: {
    color: colors.WHITE,
    fontSize: 16,
    left: 5,
    paddingHorizontal: 5,
    position: 'absolute',
    padding: 15,
    zIndex: 1,
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
    width: 20,
    tintColor: colors.THEME_ORANGE,
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
  loaderContainer: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  icon: {
    height: 18,
    width: 18,
  },
  appointmentContainer: {
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 50,
    justifyContent: 'center',
    width: '35%',
    marginTop: 10,
    height: 40,
  },
  appointmentAcceptContainer: {
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.GRAY,
    borderRadius: 50,
    justifyContent: 'center',
    width: '35%',
    marginTop: 10,
    height: 40,
  },
  appointmentText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  feedbackImageContainer: {
    borderRadius: 15,
    height: 42,
    marginHorizontal: 3,
    position: 'absolute',
    right: 10,
    top: 40,
    width: 42,
    zIndex: 1,
  },
});
