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
import React, {useRef, useState} from 'react';
import {Formik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// internal imports
import BusinessCommunityService from '../../service/BusinessCommunityService';
import CameraGalleryModal from '../groups/CameraGalleryModal';
import CommonToast from '../../constants/CommonToast';
import CustomHeader from '../../constants/CustomHeader';
import SearchEventAddressModal from '../eventManagement/SearchEventAddressModal';
import SubmitButton from '../../constants/SubmitButton';
import {businessValidation} from '../../constants/SchemaValidation';
import {colors} from '../../constants/ColorConstant';

const CreateBusiness = ({navigation}: {navigation: any}) => {
  const [businessAddressModal, setBusinessAddressModal] = useState(false);
  const [businessImage, setBusinessImage] = useState({});
  const [cameraGalleryModal, setCameraGalleryModal] = useState(false);
  const [err, setErr] = useState(false);
  const [loader, setLoader] = useState(false);
  const [monthYear, setMonthYear] = useState('M');
  const [subscriptionAmount, setSubscriptionAmount] = useState('');
  const [yesNoText, setYesNoText] = useState(0);
  const [businessSchema, setBusinessSchema] = useState({
    addressName: '',
    businessAddress: '',
    latitude: 0,
    longitude: 0,
  });
  const toastRef = useRef<any>();

  //function
  const handleSelectedEventAddress = (item: any) => {
    setErr(false);
    setBusinessSchema({
      ...businessSchema,
      addressName: item.name,
      businessAddress: item.formatted_address,
      latitude: item.geometry.location.lat,
      longitude: item.geometry.location.lng,
    });
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
        setBusinessImage(image);
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
        setBusinessImage(image);
        setCameraGalleryModal(false);
      });
    } catch (error) {
      setCameraGalleryModal(false);
      console.log('error in openLibrary', error);
    }
  };

  // function for submit click api call
  const onSubmit = (values: any) => {
    Keyboard.dismiss();
    if (yesNoText == 0) {
      setErr(false);
      setLoader(true);
      const feedBackData = new FormData();
      if (businessImage?.path != null) {
        const imageName = businessImage?.path?.slice(
          businessImage?.path.lastIndexOf('/'),
          businessImage?.length,
        );
        feedBackData.append('businessimage', {
          name: imageName,
          type: businessImage?.mime,
          uri: businessImage?.path,
        });
      }
      feedBackData.append('name', values.name);
      feedBackData.append('contactno', values.number);
      feedBackData.append('email', values.email);
      feedBackData.append('address', businessSchema?.addressName);
      feedBackData.append('description', values.description);
      feedBackData.append('subscribed', yesNoText);
      feedBackData.append('price', subscriptionAmount);
      feedBackData.append('subscriptionstatus', monthYear);
      feedBackData.append('addressName', businessSchema?.addressName);
      feedBackData.append('businessAddress', businessSchema?.businessAddress);
      feedBackData.append('latitude', businessSchema?.latitude);
      feedBackData.append('longitude', businessSchema?.longitude);

      BusinessCommunityService.postCreateBusiness(feedBackData)
        .then((response: any) => {
          setLoader(false);
          toastRef.current.getToast(response.data.message, 'success');
          navigation.replace('StackNavigation', {
            screen: 'BusinessDetailsPage',
            params: {id: response.data.businessid},
          });
        })
        .catch((error: any) => {
          setLoader(false);
          console.log(error, 'error');
        });
    } else if (yesNoText == 1 && subscriptionAmount !== '') {
      setErr(false);
      setLoader(true);
      const feedBackData = new FormData();
      if (businessImage?.path != null) {
        const imageName = businessImage?.path?.slice(
          businessImage?.path.lastIndexOf('/'),
          businessImage?.length,
        );
        feedBackData.append('businessimage', {
          name: imageName,
          type: businessImage?.mime,
          uri: businessImage?.path,
        });
      }
      feedBackData.append('name', values.name);
      feedBackData.append('contactno', values.number);
      feedBackData.append('email', values.email);
      feedBackData.append('address', businessSchema?.addressName);
      feedBackData.append('description', values.description);
      feedBackData.append('subscribed', yesNoText);
      feedBackData.append('price', subscriptionAmount);
      feedBackData.append('subscriptionstatus', monthYear);
      feedBackData.append('addressName', businessSchema?.addressName);
      feedBackData.append('businessAddress', businessSchema?.businessAddress);
      feedBackData.append('latitude', businessSchema?.latitude);
      feedBackData.append('longitude', businessSchema?.longitude);

      BusinessCommunityService.postCreateBusiness(feedBackData)
        .then((response: any) => {
          setLoader(false);
          toastRef.current.getToast(response.data.message, 'success');
          navigation.replace('StackNavigation', {
            screen: 'BusinessDetailsPage',
            params: {id: response.data.businessid},
          });
        })
        .catch((error: any) => {
          setLoader(false);
          console.log(error, 'error');
        });
    } else {
      setLoader(false);
      setErr(true);
    }
  };

  const initialValues = {
    description: '',
    email: '',
    name: '',
    number: '',
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Create Business'}
        backButton={{
          visible: true,
          onClick: () => {
            navigation.goBack();
          },
        }}
      />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}>
        <Formik
          validationSchema={businessValidation}
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
              {/* title section  */}
              <View>
                <TextInput
                  placeholder="Business Name"
                  placeholderTextColor={colors.THEME_WHITE}
                  style={styles.textInput}
                  value={values.name}
                  onChangeText={handleChange('name')}
                  onBlur={() => {
                    handleBlur('name');
                    setFieldTouched('name');
                  }}
                />

                <Text style={styles.errorMessage}>
                  {touched.name && errors.name}
                </Text>
              </View>

              {/* contact number section  */}
              <View>
                <Text style={styles.codeText}>+1 </Text>
                <TextInput
                  placeholder="Contact Number"
                  placeholderTextColor={colors.THEME_WHITE}
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

              {/* email id section  */}
              <View>
                <TextInput
                  placeholder="Email ID"
                  placeholderTextColor={colors.THEME_WHITE}
                  style={styles.textInput}
                  value={values.email}
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

              {/* address and map section */}
              <View>
                <View style={styles.calendarDateContainer}>
                  <TouchableOpacity
                    hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                    style={{
                      width: '90%',
                      justifyContent: 'center',
                      alignContent: 'center',
                    }}
                    onPress={() => {
                      console.log('CLIKED');
                      setBusinessAddressModal(true);
                    }}>
                    <Text
                      style={{
                        color: colors.WHITE,
                      }}>
                      {businessSchema?.addressName
                        ? businessSchema?.addressName
                        : null}{' '}
                      {businessSchema?.businessAddress
                        ? businessSchema?.businessAddress
                        : 'Search Address'}
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

              {/*Description section  */}
              <View>
                <TextInput
                  placeholder="Description"
                  placeholderTextColor={colors.THEME_WHITE}
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

              {/* uploaded media section  */}
              {businessImage?.path != null ? (
                <View style={styles.uploadMediaBox}>
                  <TouchableOpacity
                    style={styles.crossContainer}
                    onPress={() => {
                      setBusinessImage({});
                    }}>
                    <Image
                      style={styles.image}
                      resizeMode="cover"
                      source={require('../../assets/pngImage/cross.png')}
                    />
                  </TouchableOpacity>
                  <Image
                    style={styles.imageStyle}
                    resizeMode="cover"
                    source={{uri: `${businessImage?.path}`}}
                  />
                </View>
              ) : null}

              {/* upload image section */}
              <TouchableOpacity
                onPress={() => setCameraGalleryModal(true)}
                style={styles.uploadMediaContainer}>
                <Image
                  style={styles.uploadImageStyle}
                  resizeMode="contain"
                  source={require('../../assets/pngImage/UploadMedia.png')}
                />
                <Text style={styles.uploadMediaText}>Upload image</Text>
              </TouchableOpacity>

              {/* subscription based radio button  */}
              {/* <View>
                <Text style={styles.subscriptionText}>
                  Would you like to keep your page subscription based?
                </Text>
                <View style={styles.yesNoDirection}>
                  <TouchableOpacity
                    style={styles.radioDirection}
                    onPress={() => {
                      setYesNoText(1);
                    }}>
                    <View
                      style={
                        yesNoText === 1
                          ? styles.selectedRadio
                          : styles.unSelectedRadio
                      }>
                      <View
                        style={
                          yesNoText === 1 ? styles.selectedRadioFill : null
                        }
                      />
                    </View>
                    <Text style={styles.yesNoText}>Yes</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.radioDirection}
                    onPress={() => {
                      setYesNoText(0);
                    }}>
                    <View
                      style={
                        yesNoText === 0
                          ? styles.selectedRadio
                          : styles.unSelectedRadio
                      }>
                      <View
                        style={
                          yesNoText === 0 ? styles.selectedRadioFill : null
                        }
                      />
                    </View>
                    <Text style={styles.yesNoText}>No</Text>
                  </TouchableOpacity>
                </View>
              </View> */}

              {yesNoText == 1 ? (
                <>
                  {/* subscription amount section  */}
                  <View>
                    <Text style={styles.codeText}>$</Text>
                    <TextInput
                      placeholder="Subscription Amount"
                      placeholderTextColor={colors.THEME_WHITE}
                      style={styles.textInput}
                      value={subscriptionAmount}
                      keyboardType={
                        Platform.OS === 'ios' ? 'number-pad' : 'numeric'
                      }
                      onChangeText={(text: any) => {
                        setErr(false);
                        setSubscriptionAmount(text);
                      }}
                    />

                    {err ? (
                      <Text style={styles.errorMessage}>
                        *Please enter subscription amount.
                      </Text>
                    ) : (
                      <Text style={styles.errorMessage} />
                    )}
                  </View>

                  <View style={styles.monthDirection}>
                    <TouchableOpacity
                      style={styles.radioDirection}
                      onPress={() => {
                        setMonthYear('M');
                      }}>
                      <View
                        style={
                          monthYear === 'M'
                            ? styles.selectedRadio
                            : styles.unSelectedRadio
                        }>
                        <View
                          style={
                            monthYear === 'M' ? styles.selectedRadioFill : null
                          }
                        />
                      </View>
                      <Text style={styles.yesNoText}>Monthly</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.radioDirection}
                      onPress={() => {
                        setMonthYear('Y');
                      }}>
                      <View
                        style={
                          monthYear === 'Y'
                            ? styles.selectedRadio
                            : styles.unSelectedRadio
                        }>
                        <View
                          style={
                            monthYear === 'Y' ? styles.selectedRadioFill : null
                          }
                        />
                      </View>
                      <Text style={styles.yesNoText}>Yearly</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : null}

              {/* button with loader  */}
              <View style={styles.buttonContainer}>
                <SubmitButton
                  loader={loader}
                  submitButton={handleSubmit}
                  buttonText={'Create'}
                />
              </View>

              {/* Camera Gallery Modal  */}
              <CameraGalleryModal
                visibleModal={cameraGalleryModal}
                onClose={() => {
                  setCameraGalleryModal(false);
                }}
                cameraClick={openCamera}
                galleryClick={openLibrary}
              />

              {/* Modal for Search Event Address */}
              <SearchEventAddressModal
                visibleModal={businessAddressModal}
                onRequestClosed={() => {
                  setBusinessAddressModal(false);
                }}
                onArrowClick={() => {
                  setBusinessAddressModal(false);
                }}
                selectedEventAddress={handleSelectedEventAddress}
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

export default CreateBusiness;

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
    borderColor: colors.brightGray,
    borderRadius: 10,
    borderWidth: 1,
    color: colors.WHITE,
    fontSize: 16,
    padding: 15,
    paddingLeft: 20,
  },
  descriptionInput: {
    backgroundColor: colors.BLACK3,
    borderColor: colors.brightGray,
    borderRadius: 10,
    borderWidth: 1,
    color: colors.WHITE,
    fontSize: 16,
    height: 100,
    padding: 15,
    paddingLeft: 20,
  },
  numberInput: {
    backgroundColor: colors.BLACK3,
    borderColor: colors.brightGray,
    borderRadius: 10,
    borderWidth: 1,
    color: colors.WHITE,
    fontSize: 16,
    padding: 15,
    paddingLeft: 28,
  },
  codeText: {
    color: colors.WHITE,
    fontSize: 16,
    paddingHorizontal: 5,
    position: 'absolute',
    top: 18,
    zIndex: 1,
  },
  errorMessage: {
    color: colors.RED,
    fontSize: 14,
    paddingHorizontal: 10,
  },
  uploadMediaContainer: {
    alignItems: 'center',
    backgroundColor: colors.BLACK3,
    borderColor: colors.THEME_ORANGE,
    borderRadius: 50,
    borderStyle: 'dotted',
    borderWidth: 2,
    flexDirection: 'row',
    height: 60,
    justifyContent: 'center',
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
    fontSize: 14,
    fontWeight: '400',
  },
  uploadMediaBox: {
    borderRadius: 10,
    height: 90,
    marginBottom: 10,
    width: 130,
  },
  subscriptionText: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '500',
    paddingVertical: 10,
    textAlign: 'center',
  },
  yesNoDirection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    width: '40%',
  },
  radioDirection: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
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
    borderColor: colors.WHITE,
    borderRadius: 12,
    borderWidth: 2,
    height: 20,
    justifyContent: 'center',
    marginHorizontal: 3,
    width: 20,
  },
  yesNoText: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '400',
    marginHorizontal: 5,
  },
  buttonContainer: {
    paddingTop: 30,
  },
  monthDirection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
  },
  crossContainer: {
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 50,
    height: 20,
    position: 'absolute',
    right: 0,
    top: 0,
    width: 20,
    zIndex: 1,
  },
  image: {
    borderRadius: 10,
    height: '100%',
    width: '100%',
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
    height: 25,
    justifyContent: 'center',
    width: 25,
  },
});
