// external imports
import {
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
import DatePicker from 'react-native-date-picker';
import ImagePicker from 'react-native-image-crop-picker';
import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {Formik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// internal imports
import CameraGalleryModal from '../groups/CameraGalleryModal';
import CustomHeader from '../../constants/CustomHeader';
import EventLocationMapModal from './EventLocationMapModal';
import RepeatCalendarModal from '../groups/RepeatCalendarModal';
import SearchEventAddressModal from './SearchEventAddressModal';
import SubmitButton from '../../constants/SubmitButton';
import {colors} from '../../constants/ColorConstant';
import {eventValidation} from '../../constants/SchemaValidation';

const EditEvent = ({navigation, route}: {navigation: any; route: any}) => {
  const [selectedDate, setSelectedDate] = useState(
    moment(new Date()).format('YYYY-MM-DD'),
  );
  const [calendarModal, setCalendarModal] = useState(false);
  const [cameraGalleryCoverModal, setCameraGalleryCoverModal] = useState(false);
  const [cameraGalleryProfileModal, setCameraGalleryProfileModal] =
    useState(false);
  const [coverImage, setCoverImage] = useState('');
  const [date, setDate] = useState(new Date());
  const [eventAddressModal, setEventAddressModal] = useState(false);
  const [mapLocation, setMapLocation] = useState(false);
  const [open, setOpen] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [eventSchema, setEventSchema] = useState({
    addressName: '',
    eventAddress: '',
    latitude: 0,
    longitude: 0,
  });
  const [selectDate, setSelectDate] = useState(
    moment(new Date()).format('MM-DD-YYYY'),
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // for date
      setSelectedDate(route?.params?.data?.date);

      // for time
      var a = moment(route?.params?.data?.createdTime).toDate();
      setDate(a);

      // for location
      setEventSchema({
        ...eventSchema,
        addressName: route?.params?.data?.addressName,
        eventAddress: route?.params?.data?.eventAddress,
        latitude: route?.params?.data?.latitude,
        longitude: route?.params?.data?.longitude,
      });
    });
    return unsubscribe;
  }, [navigation]);

  // function for open camera
  const openCameraProfile = async () => {
    try {
      let value = await ImagePicker.openCamera({
        width: 1080,
        height: 1080,
        cropping: true,
        mediaType: 'photo',
        compressImageQuality: 1,
        compressImageMaxHeight: 1080 / 2,
        compressImageMaxWidth: 1080 / 2,
      }).then(image => {
        setProfileImage(image);
        setCameraGalleryProfileModal(false);
      });
    } catch (error) {
      setCameraGalleryProfileModal(false);

      console.log('error in openLibrary', error);
    }
  };

  // function for open gallery
  const openLibraryProfile = async () => {
    try {
      let value = await ImagePicker.openPicker({
        width: 1080,
        height: 1080,
        cropping: true,
        mediaType: 'photo',
        compressImageQuality: 1,
        compressImageMaxHeight: 1080 / 2,
        compressImageMaxWidth: 1080 / 2,
      }).then(image => {
        setProfileImage(image);
        setCameraGalleryProfileModal(false);
      });
    } catch (error) {
      setCameraGalleryProfileModal(false);
      console.log('error in openLibrary', error);
    }
  };

  // function for open camera
  const openCameraGallery = async () => {
    try {
      let value = await ImagePicker.openCamera({
        width: 1080,
        height: 1080,
        cropping: true,
        mediaType: 'photo',
        compressImageQuality: 1,
        compressImageMaxHeight: 1080 / 2,
        compressImageMaxWidth: 1080 / 2,
      }).then(image => {
        setCoverImage(image);
        setCameraGalleryCoverModal(false);
      });
    } catch (error) {
      setCameraGalleryCoverModal(false);

      console.log('error in openLibrary', error);
    }
  };

  // function for open gallery
  const openLibraryGallery = async () => {
    try {
      let value = await ImagePicker.openPicker({
        width: 1080,
        height: 1080,
        cropping: true,
        mediaType: 'photo',
        compressImageQuality: 1,
        compressImageMaxHeight: 1080 / 2,
        compressImageMaxWidth: 1080 / 2,
      }).then(image => {
        setCoverImage(image);
        setCameraGalleryCoverModal(false);
      });
    } catch (error) {
      setCameraGalleryCoverModal(false);
      console.log('error in openLibrary', error);
    }
  };

  // function for selected event address
  const handleSelectedEventAddress = (item: any) => {
    setEventSchema({
      ...eventSchema,
      addressName: item.name,
      eventAddress: item.formatted_address,
      latitude: item.geometry.location.lat,
      longitude: item.geometry.location.lng,
    });
  };

  // function for save click after select event address
  const handleSaveSelectedLocation = (selectedLocation: any) => {
    setEventSchema({
      ...eventSchema,
      latitude: selectedLocation.geometry.location.lat,
      longitude: selectedLocation.geometry.location.lng,
      addressName: selectedLocation.address_components[0].short_name,
      eventAddress: selectedLocation.formatted_address,
    });
  };

  // function for save click after select date
  const handleCalendarSubmitClick = (selectDate: string) => {
    setCalendarModal(false);
    setSelectedDate(moment(selectDate).format('YYYY-MM-DD'));
    setSelectDate(moment(selectDate).format('MM-DD-YYYY'));
  };

  // function for submit button click for api call to edit the event
  const onSubmit = (values: any) => {
    Keyboard.dismiss();
    navigation.navigate('StackNavigation', {
      screen: 'EditEventDetail',
      params: {
        value: values,
        selectedDate: selectedDate,
        time: date,
        eventSchema: eventSchema,
        profileImage: profileImage,
        coverImage: coverImage,
        data: route?.params?.data,
        id: route?.params?.data?.id,
      },
    });
  };

  const initialValues = {
    title: route?.params?.data?.title,
    description: route?.params?.data?.description,
    eventType: route?.params?.data?.eventtype,
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Edit Event'}
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
          validationSchema={eventValidation}
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
              <Text style={styles.heading}>Fill Your Event Information</Text>

              {/* title section  */}
              <View>
                <TextInput
                  placeholder="Enter Title"
                  placeholderTextColor={colors.WHITE}
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

              {/*Description section  */}
              <View>
                <TextInput
                  placeholder="Enter Description"
                  placeholderTextColor={colors.WHITE}
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

              {/* date section */}
              <View>
                <View style={styles.calendarDateContainer}>
                  <TextInput
                    editable={false}
                    placeholder={'MM-DD-YYYY'}
                    placeholderTextColor={colors.WHITE}
                    value={selectDate}
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
                      style={styles.image}
                      tintColor={colors.WHITE}
                      source={require('../../assets/pngImage/CalendarBlank1.png')}
                    />
                  </TouchableOpacity>
                </View>

                <Text style={styles.errorMessage}>
                  {/* {touched.description && errors.description} */}
                </Text>
              </View>

              {/* Time section */}
              <View>
                <View style={styles.calendarDateContainer}>
                  <TextInput
                    editable={false}
                    placeholder={'10:00 AM'}
                    placeholderTextColor={colors.WHITE}
                    value={moment(date).format('hh:mm A')}
                    style={{
                      color: colors.WHITE,
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setOpen(true);
                    }}
                    style={styles.calendarIcon}>
                    <Image
                      resizeMode="contain"
                      style={styles.image}
                      tintColor={colors.WHITE}
                      source={require('../../assets/pngImage/Clock.png')}
                    />
                  </TouchableOpacity>
                  <DatePicker
                    modal
                    open={open}
                    date={date}
                    title={'Select Time'}
                    mode={'time'}
                    theme="dark"
                    buttonColor={colors.THEME_ORANGE}
                    dividerColor={colors.THEME_ORANGE}
                    textColor={colors.THEME_ORANGE}
                    minuteInterval={15}
                    onConfirm={date => {
                      setOpen(false);
                      setDate(date);
                    }}
                    onCancel={() => {
                      setOpen(false);
                    }}
                  />
                </View>

                <Text style={styles.errorMessage}>
                  {/* {touched.description && errors.description} */}
                </Text>
              </View>

              {/* Upload Event profile photo section */}
              <TouchableOpacity
                onPress={() => setCameraGalleryProfileModal(true)}
                style={styles.uploadMediaContainer}>
                <View style={{alignItems: 'center', flexDirection: 'row'}}>
                  <Image
                    style={styles.uploadImageStyle}
                    resizeMode="contain"
                    source={require('../../assets/pngImage/UploadMedia.png')}
                  />
                  <Text style={styles.uploadMediaText}>
                    Upload Event profile photo
                  </Text>
                </View>
                <Image
                  resizeMode="contain"
                  source={require('../../assets/pngImage/repeatArrow.png')}
                />
              </TouchableOpacity>

              {/* uploaded profile image section  */}
              {profileImage !== '' ? (
                <View style={styles.uploadMediaBox}>
                  <Image
                    style={styles.imageStyle}
                    resizeMode="contain"
                    source={{uri: `${profileImage?.path}`}}
                  />
                </View>
              ) : route?.params?.data?.eventprofile != null ? (
                <View style={styles.uploadMediaBox}>
                  <Image
                    style={styles.image}
                    resizeMode="contain"
                    source={{uri: `${route?.params?.data?.eventprofile}`}}
                  />
                </View>
              ) : null}

              {/* Upload Event cover Photo section */}
              <TouchableOpacity
                onPress={() => setCameraGalleryCoverModal(true)}
                style={styles.uploadMediaContainer}>
                <View style={{alignItems: 'center', flexDirection: 'row'}}>
                  <Image
                    style={styles.uploadImageStyle}
                    resizeMode="contain"
                    source={require('../../assets/pngImage/UploadMedia.png')}
                  />
                  <Text style={styles.uploadMediaText}>Upload Cover Photo</Text>
                </View>
                <Image
                  resizeMode="contain"
                  source={require('../../assets/pngImage/repeatArrow.png')}
                />
              </TouchableOpacity>

              {/* uploaded cover image section  */}
              {coverImage !== '' ? (
                <View style={styles.uploadMediaBox}>
                  <Image
                    style={styles.imageStyle}
                    resizeMode="contain"
                    source={{uri: `${coverImage?.path}`}}
                  />
                </View>
              ) : route?.params?.data?.eventcoverphoto != null ? (
                <View style={styles.uploadMediaBox}>
                  <Image
                    style={styles.image}
                    resizeMode="contain"
                    source={{uri: `${route?.params?.data?.eventcoverphoto}`}}
                  />
                </View>
              ) : null}

              {/* event type section  */}
              <View>
                <TextInput
                  placeholder="Enter Event Type"
                  placeholderTextColor={colors.WHITE}
                  style={styles.textInput}
                  value={values.eventType}
                  onChangeText={handleChange('eventType')}
                  onBlur={() => {
                    handleBlur('eventType');
                    setFieldTouched('eventType');
                  }}
                />

                <Text style={styles.errorMessage}>
                  {touched.eventType && errors.eventType}
                </Text>
              </View>

              {/* address and map section */}
              <View>
                <View style={styles.calendarDateContainer}>
                  <TouchableOpacity
                    hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                    style={{
                      width: '80%',
                      justifyContent: 'center',
                      alignContent: 'center',
                    }}
                    onPress={() => setEventAddressModal(true)}>
                    <Text
                      style={{
                        color: colors.WHITE,
                      }}>
                      {eventSchema?.eventAddress
                        ? eventSchema?.addressName
                        : null}{' '}
                      {eventSchema?.eventAddress
                        ? eventSchema?.eventAddress
                        : 'Search Event Address'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setMapLocation(true)}
                    style={styles.calendarIcon}>
                    <Image
                      resizeMode="contain"
                      style={styles.image}
                      source={require('../../assets/pngImage/location.png')}
                    />
                  </TouchableOpacity>
                </View>

                <Text style={styles.errorMessage}>
                  {/* {touched.eventType && errors.eventType} */}
                </Text>
              </View>

              {/* continue button  */}
              <SubmitButton
                buttonText={'Continue'}
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

              {/* Camera Gallery Modal  */}
              <CameraGalleryModal
                visibleModal={cameraGalleryProfileModal}
                onClose={() => {
                  setCameraGalleryProfileModal(false);
                }}
                cameraClick={openCameraProfile}
                galleryClick={openLibraryProfile}
              />

              {/* Camera Gallery Modal  */}
              <CameraGalleryModal
                visibleModal={cameraGalleryCoverModal}
                onClose={() => {
                  setCameraGalleryCoverModal(false);
                }}
                cameraClick={openCameraGallery}
                galleryClick={openLibraryGallery}
              />

              {/* Modal for select event location through map  */}
              <EventLocationMapModal
                visibleModal={mapLocation}
                onRequestClosed={() => {
                  setMapLocation(false);
                }}
                selectedLocationAddress={handleSaveSelectedLocation}
              />

              {/* Modal for Search Event Address */}
              <SearchEventAddressModal
                visibleModal={eventAddressModal}
                onRequestClosed={() => {
                  setEventAddressModal(false);
                }}
                onArrowClick={() => {
                  setEventAddressModal(false);
                }}
                selectedEventAddress={handleSelectedEventAddress}
              />
            </View>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditEvent;

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
  heading: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '400',
    paddingVertical: 10,
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
    padding: 12,
    paddingLeft: 22,
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
    padding: 12,
    paddingLeft: 22,
  },
  calendarDateContainer: {
    backgroundColor: colors.BLACK3,
    borderColor: colors.brightGray,
    borderRadius: 10,
    borderWidth: 1,
    elevation: 3,
    flexDirection: 'row',
    maxHeight: 'auto',
    minHeight: 50,
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 2,
  },
  calendarIcon: {
    alignItems: 'center',
    alignSelf: 'center',
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
  image: {
    borderRadius: 50,
    height: '100%',
    width: '100%',
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
    width: 30,
    paddingHorizontal: 25,
  },
  uploadMediaText: {
    color: colors.WHITE,
    fontSize: 14,
  },
  uploadMediaBox: {
    borderRadius: 10,
    height: 50,
    marginBottom: 10,
    width: 70,
  },
  imageStyle: {
    borderRadius: 10,
    height: '100%',
    width: '100%',
  },
  errorMessage: {
    color: colors.RED,
    fontSize: 14,
    paddingHorizontal: 10,
  },
});
