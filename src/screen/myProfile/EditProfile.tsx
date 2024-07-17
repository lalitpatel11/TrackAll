//external imports
import {
  Image,
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
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
//internal imports
import CameraGalleryModal from '../groups/CameraGalleryModal';
import CustomHeader from '../../constants/CustomHeader';
import SubmitButton from '../../constants/SubmitButton';
import UserAuthService from '../../service/UserAuthService';
import {colors} from '../../constants/ColorConstant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Formik} from 'formik';
import {organizationEditProfileValidation} from '../../constants/SchemaValidation';
import SearchEventAddressModal from '../eventManagement/SearchEventAddressModal';
import CommonToast from '../../constants/CommonToast';

const EditProfile = ({navigation, route}: {navigation: any; route: any}) => {
  const [cameraGalleryModal, setCameraGalleryModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [taskState, setTaskState] = useState(false);
  const [userName, setUserName] = useState(route?.params?.data?.name);
  const [userInfo, setUserInfo] = useState(route?.params?.data);
  const [eventSchema, setEventSchema] = useState({
    addressName: '',
    eventAddress: '',
    latitude: 0,
    longitude: 0,
  });
  const [err, setErr] = useState(false);
  const [eventAddressModal, setEventAddressModal] = useState(false);
  const toastRef = useRef<any>();
  const [userType, setUserType] = useState('1');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData();

      // for details
      setUserInfo(route?.params?.data);

      // for name
      setUserName(route?.params?.data?.name);

      // for location
      setEventSchema({
        ...eventSchema,
        addressName: route?.params?.data?.address,
        eventAddress: route?.params?.data?.address,
        latitude: route?.params?.data?.latitude,
        longitude: route?.params?.data?.longitude,
      });
    });

    return unsubscribe;
  }, [navigation]);

  const getData = async () => {
    const userType = await AsyncStorage.getItem('userType');
    setUserType(userType);
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
      }).then(image => {
        setProfileImage(image);
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
        setCameraGalleryModal(false);
      });
    } catch (error) {
      setCameraGalleryModal(false);
      console.log('error in openLibrary', error);
    }
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

  // function for submit button click on api call to edit profile
  const onSubmit = async (values?: any) => {
    const accountId = await AsyncStorage.getItem('accountId');

    if (userName !== '') {
      setTaskState(false);
      setLoader(true);

      const data = new FormData();
      if (profileImage != '') {
        const imageName = profileImage.path.slice(
          profileImage.path.lastIndexOf('/'),
          profileImage.path.length,
        );
        data.append('image', {
          name: imageName,
          type: profileImage.mime,
          uri: profileImage.path,
        });
      }
      data.append('name', userName);
      data.append('email', userInfo?.email);
      if (userType == '2') {
        data.append('accountId', accountId);
      }
      if (userType == '3') {
        data.append('website', values.organizationWebsite);
        data.append('address', eventSchema.eventAddress);
        data.append('contactnumber', values.number);
        data.append('category', values.category);
        data.append('domain', values.domain);
      }

      UserAuthService.postEditProfile(data)
        .then((response: any) => {
          setLoader(false);
          toastRef.current.getToast(response.data.message, 'success');
          navigation.navigate('StackNavigation', {
            screen: 'MyProfile',
          });
        })
        .catch((error: any) => {
          setLoader(false);
          console.log('error', error);
        });
    } else {
      setTaskState(true);
    }
  };

  // function for submit button click on api call to edit profile
  const onButtonSubmit = async () => {
    const accountId = await AsyncStorage.getItem('accountId');

    if (userName !== '') {
      setTaskState(false);
      setLoader(true);

      const data = new FormData();
      if (profileImage != '') {
        const imageName = profileImage.path.slice(
          profileImage.path.lastIndexOf('/'),
          profileImage.path.length,
        );
        data.append('image', {
          name: imageName,
          type: profileImage.mime,
          uri: profileImage.path,
        });
      }
      data.append('name', userName);
      data.append('email', userInfo?.email);
      if (userType == '2') {
        data.append('accountId', accountId);
      }

      UserAuthService.postEditProfile(data)
        .then((response: any) => {
          setLoader(false);
          toastRef.current.getToast(response.data.message, 'success');
          navigation.navigate('StackNavigation', {
            screen: 'MyProfile',
          });
        })
        .catch((error: any) => {
          setLoader(false);
          console.log('error', error);
        });
    } else {
      setTaskState(true);
    }
  };
  const initialValues = {
    number: route?.params?.data?.contactno,
    category: route?.params?.data?.organizationtype,
    domain: route?.params?.data?.domain,
    organizationWebsite: route?.params?.data?.website,
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Edit Profile'}
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
        style={styles.body}>
        <View style={styles.ImageSection}>
          <Image
            source={
              userInfo?.profileimage
                ? {
                    uri: `${
                      profileImage ? profileImage.path : userInfo?.profileimage
                    }`,
                  }
                : require('../../assets/pngImage/avatar.png')
            }
            style={styles.profileImage}
          />
        </View>

        <TouchableOpacity
          onPress={() => setCameraGalleryModal(true)}
          style={styles.changeProfilePhotoBox}>
          <Text style={styles.changeProfilePhoto}>Change Profile Photo</Text>
        </TouchableOpacity>

        {/* name section  */}
        <View>
          <Text style={styles.labelName}>Name</Text>
          <TextInput
            value={userName}
            placeholder={userInfo?.name ? userInfo?.name : 'Enter name'}
            style={styles.textInput}
            onChangeText={text => {
              setUserName(text);
              setTaskState(false);
            }}
          />

          {/* error section is case of empty field  */}
          <Text style={styles.errorMessage}>
            {taskState ? '*Name is required' : null}
          </Text>
        </View>

        {/* email section  */}
        <View>
          <Text style={styles.labelName}>Email</Text>
          <TextInput
            value={userInfo?.email}
            keyboardType="email-address"
            editable={false}
            style={styles.userEmail}
          />
        </View>

        {userType == '3' ? (
          <Formik
            validationSchema={organizationEditProfileValidation}
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
              <>
                {/* contact number section */}
                <View>
                  <Text style={styles.labelName}>Contact Number</Text>
                  <View>
                    <Text style={styles.codeText}>+1 </Text>
                    <TextInput
                      placeholder="Contact Number"
                      placeholderTextColor={colors.GRAY}
                      style={styles.numberInput}
                      // value={values.number.replace(
                      //   /(\d{3})(\d{3})(\d{4})/,
                      //   '$1-$2-$3',
                      // )}
                      value={values.number}
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
                </View>

                {/* Domain section */}
                <View>
                  <Text style={styles.labelName}>Domain</Text>
                  <TextInput
                    placeholder="Organization Domain @xyz.com"
                    placeholderTextColor={colors.GRAY}
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

                {/* website section */}
                <View>
                  <Text style={styles.labelName}>Organization Website</Text>
                  <TextInput
                    placeholder="Organization Website (Optional)"
                    placeholderTextColor={colors.GRAY}
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

                {/* address and map section */}
                <View>
                  <Text style={styles.labelName}>Organization Address</Text>

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

                {/* category section */}
                <View>
                  <Text style={styles.labelName}>Organization Type</Text>

                  <TextInput
                    placeholder="Organization Type"
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

                {/* button section */}
                <View style={styles.buttonContainer}>
                  <SubmitButton
                    buttonText={'Save'}
                    loader={loader}
                    submitButton={() => {
                      handleSubmit();
                    }}
                  />
                </View>
              </>
            )}
          </Formik>
        ) : null}

        {/* button section */}
        {userType !== '3' ? (
          <View style={styles.buttonContainer}>
            <SubmitButton
              buttonText={'Save'}
              loader={loader}
              submitButton={() => {
                onButtonSubmit();
              }}
            />
          </View>
        ) : null}

        {/* Camera Gallery Modal  */}
        <CameraGalleryModal
          visibleModal={cameraGalleryModal}
          onClose={() => {
            setCameraGalleryModal(false);
          }}
          cameraClick={openCamera}
          galleryClick={openLibrary}
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

        {/* toaster message for error response from API  */}
        <CommonToast ref={toastRef} />
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {
    flex: 1,
    padding: 10,
  },
  ImageSection: {
    alignSelf: 'center',
    borderRadius: 100,
    height: 95,
    justifyContent: 'flex-end',
    marginVertical: 20,
    overflow: 'hidden',
    width: 95,
  },
  profileImage: {
    borderColor: colors.THEME_ORANGE,
    borderRadius: 100,
    borderWidth: 2,
    height: '100%',
    position: 'absolute',
    width: '100%',
  },
  changeProfilePhotoBox: {
    alignSelf: 'center',
    width: '45%',
  },
  changeProfilePhoto: {
    color: colors.THEME_ORANGE,
    fontSize: 16,
    textAlign: 'center',
  },
  labelName: {
    color: colors.WHITE,
    fontSize: 16,
    padding: 5,
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
  userEmail: {
    backgroundColor: colors.GRAY,
    borderRadius: 10,
    color: colors.WHITE,
    fontSize: 16,
    padding: 15,
    marginBottom: 15,
  },
  errorMessage: {
    color: colors.RED,
    fontSize: 14,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    marginVertical: 20,
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
  numberInput: {
    backgroundColor: colors.BLACK3,
    borderColor: colors.brightGray,
    borderRadius: 8,
    color: colors.WHITE,
    fontSize: 16,
    padding: 15,
    paddingLeft: 30,
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
});
