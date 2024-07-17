// external imports
import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
import React, {useEffect, useRef, useState} from 'react';
import ToggleSwitch from 'toggle-switch-react-native';
import moment from 'moment';
import {Formik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// internal imports
import CameraGalleryModal from '../groups/CameraGalleryModal';
import CommonToast from '../../constants/CommonToast';
import CustomHeader from '../../constants/CustomHeader';
import EventService from '../../service/EventService';
import InviteMemberOnCreateEventModal from './InviteMemberOnCreateEventModal';
import RecentlyAddedMembersTab from '../groups/RecentlyAddedMembersTab';
import SubmitButton from '../../constants/SubmitButton';
import UploadedEventImageTab from './UploadedEventImageTab';
import {colors} from '../../constants/ColorConstant';
import {eventDetailsValidation} from '../../constants/SchemaValidation';

const CreateEventDetail = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const [cameraGalleryModal, setCameraGalleryModal] = useState(false);
  const [detailsFillEnable, setDetailsFillEnable] = useState<boolean>(true);
  const [eventImage, setEventImage] = useState<any[]>([]);
  const [loader, setLoader] = useState(false);
  const [memberIdModal, setMemberIdModal] = useState(false);
  const [selectedMembersId, setSelectedMembersId] = useState<number[]>([]);
  const [selectedMembersList, setSelectedMembersList] = useState<any[]>([]);
  const [userEmail, setUserEmail] = useState<any>();
  const [userEmailState, setUserEmailState] = useState<boolean>(false);
  const [userName, setUserName] = useState<any>();
  const [userNameState, setUserNameState] = useState<boolean>(false);
  const toastRef = useRef<any>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setEventImage([]);
      getUserDetails();
    });
    return unsubscribe;
  }, [navigation]);

  // function for get user name and email for auto fill
  const getUserDetails = async () => {
    const name = await AsyncStorage.getItem('userName');
    setUserName(name);
    const email = await AsyncStorage.getItem('userEmail');
    setUserEmail(email);
  };

  // function for open camera
  const openCamera = async () => {
    try {
      let value = await ImagePicker.openCamera({
        width: 1080,
        height: 1080,
        cropping: true,
        mediaType: 'photo',
        compressImageQuality: 1,
        compressImageMaxHeight: 1080 / 2,
        compressImageMaxWidth: 1080 / 2,
      }).then((image: any) => {
        const img = {
          name: image.path.slice(
            image.path.lastIndexOf('/'),
            image.path.length,
          ),
          uri: image.path,
          type: image.mime,
        };
        setEventImage([img]);
        setCameraGalleryModal(false);
      });
    } catch (error) {
      setCameraGalleryModal(false);
      console.log('error in openLibrary', error);
    }
  };

  // function for open gallery
  const openLibrary = async () => {
    try {
      let imageList: any = [];
      let value = await ImagePicker.openPicker({
        width: 1080,
        height: 1080,
        cropping: true,
        multiple: true,
        mediaType: 'photo',
        compressImageQuality: 1,
        compressImageMaxHeight: 1080 / 2,
        compressImageMaxWidth: 1080 / 2,
      }).then((image: any) => {
        image.map((e: any) => {
          imageList.push({
            name: e.path.slice(e.path.lastIndexOf('/'), e.path.length),
            uri: e.path,
            type: e.mime,
          });
        });
        setEventImage(imageList);
        setCameraGalleryModal(false);
      });
    } catch (error) {
      setCameraGalleryModal(false);
      console.log('error in openLibrary', error);
    }
  };

  // list for images
  const renderAddedSubCommentsImages = ({item}: {item: any; index: any}) => {
    return <UploadedEventImageTab eventImage={item} />;
  };

  // function for add button click after select the members
  const handleMemberIdAddClick = (memberList: any[], userList: any[]) => {
    setMemberIdModal(false);
    setSelectedMembersId(memberList);
    setSelectedMembersList(userList);
  };

  // list for recently added member
  const renderAddedMembers = ({item}: {item: any; index: any}) => {
    return <RecentlyAddedMembersTab item={item} />;
  };

  // function for submit button click for api call to create the event
  const onSubmit = async (values: any) => {
    const accountId = await AsyncStorage.getItem('accountId');
    const userType = await AsyncStorage.getItem('userType');

    Keyboard.dismiss();
    setLoader(true);
    const feedBackData = new FormData();

    if (eventImage !== null) {
      eventImage.map((e: any, index: any) => {
        feedBackData.append(`images[${index}]`, e);
      });
    }

    if (route?.params?.profileImage != '') {
      const imageName = route?.params?.profileImage.path.slice(
        route?.params?.profileImage.path.lastIndexOf('/'),
        route?.params?.profileImage.path.length,
      );
      feedBackData.append('eventprofile', {
        name: imageName,
        type: route?.params?.profileImage.mime,
        uri: route?.params?.profileImage.path,
      });
    }

    if (route?.params?.coverImage != '') {
      const imageName = route?.params?.coverImage.path.slice(
        route?.params?.coverImage.path.lastIndexOf('/'),
        route?.params?.coverImage.path.length,
      );
      feedBackData.append('eventcoverphoto', {
        name: imageName,
        type: route?.params?.coverImage.mime,
        uri: route?.params?.coverImage.path,
      });
    }

    feedBackData.append('title', route?.params?.data?.title);
    feedBackData.append('description', route?.params?.data?.description);
    feedBackData.append('date', route?.params?.selectedDate);
    feedBackData.append('time', moment(route?.params?.time).format('hh:mm A'));
    feedBackData.append('eventtype', route?.params?.data?.eventType);
    feedBackData.append('addressName', route?.params?.eventSchema?.addressName);
    feedBackData.append(
      'eventAddress',
      route?.params?.eventSchema?.eventAddress,
    );
    feedBackData.append('latitude', route?.params?.eventSchema?.latitude);
    feedBackData.append('longitude', route?.params?.eventSchema?.longitude);
    feedBackData.append('venue', route?.params?.data?.venue);
    feedBackData.append('details', values.eventDetails);
    feedBackData.append('eventtags', values.eventTag);
    feedBackData.append('name', userName);
    feedBackData.append('contactno', values.number);
    feedBackData.append('email', userEmail);
    selectedMembersId.map((e: number, index: any) => {
      feedBackData.append(`userid[${index}]`, e);
    });
    if (userType == '2') {
      feedBackData.append('accountId', accountId);
    }

    EventService.postCreateEvent(feedBackData)
      .then((response: any) => {
        setLoader(false);
        toastRef.current.getToast(response.data.message, 'success');
        navigation.replace('StackNavigation', {
          screen: 'EventDetails',
          params: {id: response.data.eventid},
        });
      })
      .catch(error => {
        setLoader(false);
        console.log(error);
      });
  };

  // function for auto fill username and email enable and disable
  const handleDetailsFill = async () => {
    if (detailsFillEnable) {
      setUserNameState(true);
      setUserEmailState(true);
      setUserName('');
      setUserEmail('');
    } else {
      setUserNameState(false);
      setUserEmailState(false);
      getUserDetails();
    }
  };

  const initialValues = {
    eventDetails: '',
    eventTag: '',
    number: '',
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Create Event'}
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
          validationSchema={eventDetailsValidation}
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
              {/* Upload Event Photo section */}
              <TouchableOpacity
                onPress={() => setCameraGalleryModal(true)}
                style={styles.uploadMediaContainer}>
                <View style={{alignItems: 'center', flexDirection: 'row'}}>
                  <Image
                    style={styles.uploadImageStyle}
                    resizeMode="contain"
                    source={require('../../assets/pngImage/UploadMedia.png')}
                  />
                  <Text style={styles.uploadMediaText}>Upload Event Photo</Text>
                </View>
                <Image
                  resizeMode="contain"
                  source={require('../../assets/pngImage/repeatArrow.png')}
                />
              </TouchableOpacity>

              {eventImage?.length >= 0 ? (
                <FlatList
                  data={eventImage}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  renderItem={renderAddedSubCommentsImages}
                  keyExtractor={(item: any, index: any) => String(index)}
                />
              ) : null}

              {/*event details section  */}
              <View>
                <TextInput
                  placeholder="Addition Information (Optional)"
                  placeholderTextColor={colors.WHITE}
                  style={styles.descriptionInput}
                  value={values.eventDetails}
                  numberOfLines={3}
                  multiline={true}
                  textAlignVertical="top"
                  onChangeText={handleChange('eventDetails')}
                  onBlur={() => {
                    handleBlur('eventDetails');
                    setFieldTouched('eventDetails');
                  }}
                />
                <Text style={styles.errorMessage}>
                  {touched.eventDetails && errors.eventDetails}
                </Text>
              </View>

              {/*event tag section  */}
              <View>
                <TextInput
                  placeholder="Event Tag (Optional)"
                  placeholderTextColor={colors.WHITE}
                  style={styles.descriptionInput}
                  value={values.eventTag}
                  numberOfLines={3}
                  multiline={true}
                  textAlignVertical="top"
                  onChangeText={handleChange('eventTag')}
                  onBlur={() => {
                    handleBlur('eventTag');
                    setFieldTouched('eventTag');
                  }}
                />
                <Text style={styles.errorMessage}>
                  {touched.eventTag && errors.eventTag}
                </Text>
              </View>

              {/* auto fill event create details toggle section */}
              <View style={styles.toggleContainer}>
                <Text style={styles.toggleText}>Auto Fill Creator Details</Text>
                <ToggleSwitch
                  isOn={detailsFillEnable}
                  onColor={colors.lightOrange}
                  offColor={colors.lightGray}
                  size="medium"
                  onToggle={() => {
                    setDetailsFillEnable(!detailsFillEnable),
                      handleDetailsFill();
                  }}
                />
              </View>

              {/* person name section */}
              <View>
                <TextInput
                  placeholder="Event Created By"
                  placeholderTextColor={colors.WHITE}
                  style={styles.textInput}
                  value={userName}
                  onChangeText={(text: string) => {
                    setUserName(text);
                    setUserNameState(false);
                  }}
                />

                {userNameState ? (
                  <Text style={styles.errorMessage}>*Name is required</Text>
                ) : (
                  <Text style={styles.errorMessage} />
                )}
              </View>

              {/* email id section  */}
              <View>
                <TextInput
                  placeholder="Email ID"
                  placeholderTextColor={colors.WHITE}
                  style={styles.textInput}
                  value={userEmail}
                  onChangeText={(text: string) => {
                    setUserEmail(text);
                    setUserEmailState(false);
                  }}
                />

                {userEmailState ? (
                  <Text style={styles.errorMessage}>*Email id is required</Text>
                ) : (
                  <Text style={styles.errorMessage} />
                )}
              </View>

              {/* contact number section  */}
              <View>
                <Text style={styles.codeText}>+1 </Text>
                <TextInput
                  placeholder="Contact Number"
                  placeholderTextColor={colors.WHITE}
                  style={styles.numberInput}
                  value={values.number.replace(
                    /(\d{3})(\d{3})(\d{4})/,
                    '$1-$2-$3',
                  )}
                  maxLength={12}
                  keyboardType={
                    Platform.OS === 'ios' ? 'number-pad' : 'numeric'
                  }
                  onChangeText={handleChange('number')}
                  onBlur={() => {
                    handleBlur('number');
                    setFieldTouched('number');
                  }}
                />

                <Text style={styles.errorMessage}>
                  {touched.number && errors.number}
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
                  <Text style={styles.inviteMemberText}>Invite User</Text>
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

              {/* submit button  */}
              <SubmitButton
                loader={loader}
                buttonText={'Save'}
                submitButton={handleSubmit}
              />
            </View>
          )}
        </Formik>

        {/* Camera Gallery Modal  */}
        <CameraGalleryModal
          visibleModal={cameraGalleryModal}
          onClose={() => {
            setCameraGalleryModal(false);
          }}
          cameraClick={openCamera}
          galleryClick={openLibrary}
        />

        {/* Member Email Id modal  */}
        <InviteMemberOnCreateEventModal
          visibleModal={memberIdModal}
          onClose={() => {
            setMemberIdModal(false);
          }}
          onSubmitClick={handleMemberIdAddClick}
          navigation={navigation}
          selectedMembersId={selectedMembersId}
          selectedMembersList={selectedMembersList}
        />

        {/* toaster message for error response from API  */}
        <CommonToast ref={toastRef} />
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateEventDetail;

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
  uploadMediaContainer: {
    alignItems: 'center',
    backgroundColor: colors.BLACK3,
    borderColor: colors.THEME_ORANGE,
    borderRadius: 15,
    borderStyle: 'dotted',
    borderWidth: 2,
    elevation: 3,
    flexDirection: 'row',
    height: 60,
    justifyContent: 'space-between',
    marginVertical: 8,
    paddingHorizontal: 5,
  },
  uploadImageStyle: {
    height: 30,
    paddingHorizontal: 25,
    width: 30,
  },
  uploadMediaText: {
    color: colors.WHITE,
    fontSize: 14,
  },
  descriptionInput: {
    backgroundColor: colors.BLACK3,
    borderColor: colors.brightGray,
    borderRadius: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors.WHITE,
    elevation: 3,
    fontSize: 16,
    height: 100,
    padding: 15,
    paddingLeft: 22,
  },
  textInput: {
    backgroundColor: colors.BLACK3,
    borderColor: colors.brightGray,
    borderRadius: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors.WHITE,
    elevation: 3,
    fontSize: 16,
    padding: 15,
    paddingLeft: 22,
  },
  numberInput: {
    backgroundColor: colors.BLACK3,
    borderColor: colors.brightGray,
    borderRadius: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors.WHITE,
    elevation: 3,
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
    top: 18,
    zIndex: 1,
  },
  inviteMemberContainer: {
    alignItems: 'center',
    backgroundColor: colors.BLACK3,
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
  errorMessage: {
    color: colors.RED,
    fontSize: 14,
    paddingHorizontal: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 5,
  },
  toggleText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
  },
});
