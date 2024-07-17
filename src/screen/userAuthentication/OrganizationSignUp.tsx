import {
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  StyleSheet,
  Keyboard,
} from 'react-native';
import CameraGalleryModal from '../groups/CameraGalleryModal';
import Header from '../../constants/Header';
import ImagePicker from 'react-native-image-crop-picker';
import React, {useState} from 'react';
import SubmitButton from '../../constants/SubmitButton';
import {Formik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {colors} from '../../constants/ColorConstant';
import SearchEventAddressModal from '../eventManagement/SearchEventAddressModal';
import UserAuthService from '../../service/UserAuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {organizationSignUpValidation} from '../../constants/SchemaValidation';

const OrganizationSignUp = ({navigation}: {navigation: any}) => {
  const [err, setErr] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [cameraGalleryProfileModal, setCameraGalleryProfileModal] =
    useState(false);
  const [loader, setLoader] = useState(false);
  const [eventAddressModal, setEventAddressModal] = useState(false);
  const [emailResponse, setEmailResponse] = useState('');
  const [eventSchema, setEventSchema] = useState({
    addressName: '',
    eventAddress: '',
    latitude: 0,
    longitude: 0,
  });

  // function for open camera for logo
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

  // function for open gallery for logo
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

  // navigation for back arrow click
  const handleBackClick = () => {
    navigation.navigate('StackNavigation', {
      screen: 'SignUpOption',
    });
  };

  // function for select event address
  const handleSelectedEventAddress = (item: any) => {
    setErr(false);
    setEventSchema({
      ...eventSchema,
      addressName: item.name,
      eventAddress: item.formatted_address,
      latitude: item.geometry.location.lat,
      longitude: item.geometry.location.lng,
    });
  };

  // function for verify email address
  const handleEmailVerify = (email: string) => {
    const data = {
      email: email,
    };

    UserAuthService.postCheckEmailStatus(data)
      .then((response: any) => {
        setLoader(false);
        if (response.data.status === 1) {
          setEmailResponse('');
        } else if (response.data.status === 0) {
          setEmailResponse(response.data.message);
        }
      })
      .catch((error: any) => {
        setLoader(false);
        console.log(error, 'error');
      });
  };

  // function for submit button click for api call to create the event
  const onSubmit = async (values: any) => {
    Keyboard.dismiss();

    if (eventSchema.addressName != '') {
      setLoader(true);
      setErr(false);
      let fcmToken: any = await AsyncStorage.getItem('fcmToken');
      const data = new FormData();
      if (profileImage != '') {
        const imageName = profileImage.path.slice(
          profileImage.path.lastIndexOf('/'),
          profileImage.path.length,
        );
        data.append('organizationlogo', {
          name: imageName,
          type: profileImage.mime,
          uri: profileImage.path,
        });
      }

      data.append('name', values.organizationName);
      data.append('website', values.organizationWebsite);
      data.append('address', eventSchema.eventAddress);
      data.append('contactnumber', values.number);
      data.append('email', values.email);
      data.append('usertype', 3);
      data.append('category', values.category);
      data.append('domain', values.domain);
      data.append('fcmToken', fcmToken);

      UserAuthService.postBusinessOrganizationSignUp(data)
        .then((response: any) => {
          setLoader(false);
          navigation.navigate('StackNavigation', {
            screen: 'SignUpOtp',
            params: {otp: response.data.otp, email: values.email},
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
    organizationWebsite: '',
    organizationName: '',
    number: '',
    email: '',
    category: '',
    domain: '',
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {/* reusable header component  */}
      <Header headerText={'Organization Details'} backClick={handleBackClick} />

      {/* body section */}
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}>
        <Formik
          validationSchema={organizationSignUpValidation}
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
                  placeholder="Organization Name"
                  placeholderTextColor={colors.WHITE}
                  style={styles.textInput}
                  value={values.organizationName}
                  onChangeText={handleChange('organizationName')}
                  onBlur={() => {
                    handleBlur('organizationName');
                    setFieldTouched('organizationName');
                  }}
                />
                <Text style={styles.errorMessage}>
                  {touched.organizationName && errors.organizationName}
                </Text>
              </View>

              {/* website section */}
              <View>
                <TextInput
                  placeholder="Organization Website (Optional)"
                  placeholderTextColor={colors.WHITE}
                  style={styles.textInput}
                  value={values.organizationWebsite}
                  onChangeText={handleChange('organizationWebsite')}
                  onBlur={() => {
                    handleBlur('organizationWebsite');
                    setFieldTouched('organizationWebsite');
                  }}
                />
                <Text style={styles.errorMessage}>
                  {touched.organizationWebsite && errors.organizationWebsite}
                </Text>
              </View>

              {/* Upload Organization logo section */}
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
                    Upload Organization Logo
                  </Text>
                </View>
                <Image
                  resizeMode="contain"
                  source={require('../../assets/pngImage/repeatArrow.png')}
                />
              </TouchableOpacity>

              {/* uploaded image section */}
              {profileImage !== '' ? (
                <View style={styles.uploadMediaBox}>
                  <Image
                    style={styles.imageStyle}
                    // resizeMode="contain"
                    source={{uri: `${profileImage?.path}`}}
                  />
                </View>
              ) : null}

              {/* Domain section */}
              <View>
                <TextInput
                  placeholder="Organization Domain @xyz.com"
                  placeholderTextColor={colors.WHITE}
                  style={styles.textInput}
                  value={values.domain}
                  onChangeText={handleChange('domain')}
                  onBlur={() => {
                    handleBlur('domain');
                    setFieldTouched('domain');
                  }}
                />
                <Text style={styles.errorMessage}>
                  {touched.domain && errors.domain}
                </Text>
              </View>

              <Text style={styles.header}>Contact Details</Text>

              {/* address and map section */}
              <View>
                <View style={styles.calendarDateContainer}>
                  <TouchableOpacity
                    hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                    style={{
                      height: 'auto',
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
                        : 'Organization Address'}
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

              {/* contact number section */}
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

              {/* email id section */}
              <View>
                <TextInput
                  placeholder="Email ID"
                  placeholderTextColor={colors.WHITE}
                  style={styles.textInput}
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={() => {
                    handleBlur('email');
                    setFieldTouched('email');
                    handleEmailVerify(values.email);
                  }}
                />

                <Text style={styles.errorMessage}>
                  {touched.email && errors.email}
                  {emailResponse}
                </Text>
              </View>

              {/* category section */}
              <View>
                <TextInput
                  placeholder="Organization Type"
                  placeholderTextColor={colors.WHITE}
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

              {/* submit button  */}
              <SubmitButton
                loader={loader}
                buttonText={'SignUp'}
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
                selectedEventAddress={handleSelectedEventAddress}
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
            </View>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

export default OrganizationSignUp;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
    padding: 5,
  },
  body: {
    flex: 1,
    padding: 10,
    paddingBottom: 40,
  },
  textInput: {
    backgroundColor: colors.BLACK3,
    borderColor: colors.brightGray,
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
    height: 'auto',
    justifyContent: 'space-between',
    maxHeight: 'auto',
    minHeight: 50,
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
  imageStyle: {
    borderRadius: 10,
    height: '100%',
    width: '100%',
  },
  uploadMediaText: {
    color: colors.WHITE,
    fontSize: 16,
  },
  uploadMediaBox: {
    borderRadius: 10,
    height: 50,
    marginBottom: 10,
    width: 70,
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
    padding: 15,
    paddingHorizontal: 5,
    position: 'absolute',
    zIndex: 1,
  },
  header: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '500',
    marginVertical: 10,
  },
});
