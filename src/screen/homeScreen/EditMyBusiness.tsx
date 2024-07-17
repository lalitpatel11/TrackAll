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
import ImagePicker from 'react-native-image-crop-picker';
import React, {useEffect, useRef, useState} from 'react';
import {Formik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// internal imports
import BusinessService from '../../service/BusinessService';
import CameraGalleryModal from '../groups/CameraGalleryModal';
import CommonToast from '../../constants/CommonToast';
import CustomHeader from '../../constants/CustomHeader';
import SearchEventAddressModal from '../eventManagement/SearchEventAddressModal';
import SubmitButton from '../../constants/SubmitButton';
import {addNewBusinessValidation} from '../../constants/SchemaValidation';
import {colors} from '../../constants/ColorConstant';

const EditMyBusiness = ({navigation, route}: {navigation: any; route: any}) => {
  const [eventAddressModal, setEventAddressModal] = useState(false);
  const [err, setErr] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [cameraGalleryProfileModal, setCameraGalleryProfileModal] =
    useState(false);
  const [loader, setLoader] = useState(false);
  const toastRef = useRef<any>();
  const [eventSchema, setEventSchema] = useState({
    addressName: '',
    eventAddress: '',
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    // for location
    setEventSchema({
      ...eventSchema,
      addressName: route?.params?.data?.address,
      eventAddress: route?.params?.data?.address,
      latitude: route?.params?.data?.latitude,
      longitude: route?.params?.data?.longitude,
    });
  }, []);

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

  // function for select event address
  const handleSelectedAddress = (item: any) => {
    setErr(false);
    setEventSchema({
      ...eventSchema,
      addressName: item.name,
      eventAddress: item.formatted_address,
      latitude: item.geometry.location.lat,
      longitude: item.geometry.location.lng,
    });
  };

  // function for submit button click for api call to create the event
  const onSubmit = async (values: any) => {
    Keyboard.dismiss();

    if (eventSchema.addressName != '') {
      setErr(false);
      setLoader(true);

      const data = new FormData();
      if (profileImage != '') {
        const imageName = profileImage.path.slice(
          profileImage.path.lastIndexOf('/'),
          profileImage.path.length,
        );
        data.append('businesslogo', {
          name: imageName,
          type: profileImage.mime,
          uri: profileImage.path,
        });
      }
      data.append('name', values.businessName);
      data.append('website', values.businessWebsite);
      data.append('address', eventSchema.eventAddress);
      data.append('category', values.category);
      data.append('businessid', route?.params?.data?.businessid);
      data.append('description', values.description);
      data.append('contactnumber', values.number);
      data.append('email', values.email);

      BusinessService.postEditMyBusiness(data)
        .then((response: any) => {
          setLoader(false);
          toastRef.current.getToast(response?.data?.message, 'success');
          navigation.replace('DrawerNavigator', {
            screen: 'BottomNavigator',
            params: {
              screen: 'BusinessHome',
            },
          });
        })
        .catch((error: any) => {
          setLoader(false);
          console.log(error, 'error');
        });
    } else {
      setErr(true);
    }
  };

  const initialValues = {
    businessWebsite: route?.params?.data?.website,
    businessName: route?.params?.data?.businessName,
    category: route?.params?.data?.businesstype,
    description: route?.params?.data?.description,
    number: route?.params?.data?.contactnumber,
    email: route?.params?.data?.email,
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Edit Business'}
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
          validationSchema={addNewBusinessValidation}
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
              {/* title section */}
              <View>
                <TextInput
                  placeholder="Business Name"
                  placeholderTextColor={colors.GRAY}
                  style={styles.textInput}
                  value={values.businessName}
                  onChangeText={handleChange('businessName')}
                  onBlur={() => {
                    handleBlur('businessName');
                    setFieldTouched('businessName');
                  }}
                />
                <Text style={styles.errorMessage}>
                  {touched.businessName && errors.businessName}
                </Text>
              </View>

              {/* website section */}
              <View>
                <TextInput
                  placeholder="Business Website (Optional)"
                  placeholderTextColor={colors.GRAY}
                  style={styles.textInput}
                  value={values.businessWebsite}
                  onChangeText={handleChange('businessWebsite')}
                  onBlur={() => {
                    handleBlur('businessWebsite');
                    setFieldTouched('businessWebsite');
                  }}
                />
                <Text style={styles.errorMessage}>
                  {touched.businessWebsite && errors.businessWebsite}
                </Text>
              </View>

              {/* address and map section */}
              <View>
                <View style={styles.calendarDateContainer}>
                  <TouchableOpacity
                    hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                    style={{
                      height: 50,
                      justifyContent: 'center',
                      alignContent: 'center',
                    }}
                    onPress={() => {
                      console.log('CLIKED');
                      setEventAddressModal(true);
                    }}>
                    <Text
                      style={{
                        color: eventSchema?.eventAddress
                          ? colors.WHITE
                          : colors.WHITE,
                        fontSize: 16,
                      }}>
                      {eventSchema?.eventAddress
                        ? eventSchema?.eventAddress
                        : 'Business Address'}
                    </Text>
                  </TouchableOpacity>

                  <View
                    // onPress={() => setMapLocation(true)}
                    style={styles.calendarIcon}>
                    <Image
                      resizeMode="contain"
                      style={styles.image}
                      source={require('../../assets/pngImage/location.png')}
                    />
                  </View>
                </View>

                {err ? (
                  <Text style={styles.errorMessage}>
                    *Please enter location.
                  </Text>
                ) : (
                  <Text style={styles.errorMessage} />
                )}
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
                    Upload Business logo
                  </Text>
                </View>
                <Image
                  resizeMode="contain"
                  source={require('../../assets/pngImage/repeatArrow.png')}
                />
              </TouchableOpacity>

              <View style={styles.ImageSection}>
                <Image
                  source={
                    route?.params?.data?.businessProfile
                      ? {
                          uri: `${
                            profileImage
                              ? profileImage.path
                              : route?.params?.data?.businessProfile
                          }`,
                        }
                      : require('../../assets/pngImage/avatar.png')
                  }
                  style={styles.profileImage}
                />
              </View>

              {/* contact number section */}
              <View>
                <Text style={styles.codeText}>+1 </Text>
                <TextInput
                  placeholder="Contact Number"
                  placeholderTextColor={colors.GRAY}
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

              {/* email id section */}
              <View>
                <TextInput
                  placeholder="Email ID"
                  placeholderTextColor={colors.GRAY}
                  style={styles.textInput}
                  value={values.email}
                  editable={
                    route?.params?.data?.accounttype != 'S' ? false : true
                  }
                  onChangeText={handleChange('email')}
                  onBlur={() => {
                    handleBlur('email');
                    setFieldTouched('email');
                  }}
                />

                <Text style={styles.errorMessage}>
                  {touched.email && errors.email}
                </Text>
              </View>

              {/* type/category section */}
              <View>
                <TextInput
                  placeholder="Business Type"
                  placeholderTextColor={colors.GRAY}
                  style={styles.textInput}
                  value={values.category}
                  onChangeText={handleChange('category')}
                  onBlur={() => {
                    handleBlur('category');
                    setFieldTouched('category');
                  }}
                />
                <Text style={styles.errorMessage}>
                  {touched.category && errors.category}
                </Text>
              </View>

              {/* Description section */}
              <View>
                <TextInput
                  placeholder="Description"
                  placeholderTextColor={colors.GRAY}
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

              {/* submit button */}
              <SubmitButton
                loader={loader}
                buttonText={'Save'}
                submitButton={handleSubmit}
              />

              {/* Modal for search business address */}
              <SearchEventAddressModal
                visibleModal={eventAddressModal}
                onRequestClosed={() => {
                  setEventAddressModal(false);
                }}
                onArrowClick={() => {
                  setEventAddressModal(false);
                }}
                selectedEventAddress={handleSelectedAddress}
              />

              {/* Camera Gallery Modal for profile */}
              <CameraGalleryModal
                visibleModal={cameraGalleryProfileModal}
                onClose={() => {
                  setCameraGalleryProfileModal(false);
                }}
                cameraClick={openCameraProfile}
                galleryClick={openLibraryProfile}
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

export default EditMyBusiness;

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
    height: 60,
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
  uploadMediaContainer: {
    alignItems: 'center',
    backgroundColor: colors.BLACK3,
    borderColor: colors.THEME_ORANGE,
    borderRadius: 15,
    borderStyle: 'dotted',
    borderWidth: 2,
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
    fontSize: 16,
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
    padding: 18,
    zIndex: 1,
  },
  ImageSection: {
    borderRadius: 15,
    height: 50,
    marginVertical: 10,
    width: 50,
  },
  profileImage: {
    borderColor: colors.brightGray,
    borderRadius: 15,
    borderWidth: 1,
    height: '100%',
    width: '100%',
  },
  descriptionInput: {
    backgroundColor: colors.BLACK3,
    borderRadius: 10,
    color: colors.WHITE,
    fontSize: 16,
    height: 100,
    padding: 15,
  },
});
