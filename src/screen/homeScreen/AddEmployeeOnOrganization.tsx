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
import moment from 'moment';
import {Formik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// internal imports
import CalendarModal from '../expenseManagement/CalendarModal';
import CameraGalleryModal from '../groups/CameraGalleryModal';
import CommonToast from '../../constants/CommonToast';
import CustomHeader from '../../constants/CustomHeader';
import OrganizationService from '../../service/OrganisationService';
import SubmitButton from '../../constants/SubmitButton';
import {addNewEmployeeValidation} from '../../constants/SchemaValidation';
import {colors} from '../../constants/ColorConstant';

const AddEmployeeOnOrganization = ({navigation}: {navigation: any}) => {
  const [calendarModal, setCalendarModal] = useState(false);
  const [dobCalendarModal, setDobCalendarModal] = useState(false);
  const [err, setErr] = useState(false);
  const [loader, setLoader] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const toastRef = useRef<any>();
  const [selectedDate, setSelectedDate] = useState(
    moment(new Date()).format('YYYY-MM-DD'),
  );
  const [dateOfBirth, setDateOfBirth] = useState(
    moment(new Date()).format('YYYY-MM-DD'),
  );
  const [cameraGalleryProfileModal, setCameraGalleryProfileModal] =
    useState(false);

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

  // function for calender submit click after select joining  date
  const handleCalendarSubmitClick = (selectDate: string) => {
    setCalendarModal(false);
    setSelectedDate(moment(selectDate).format('YYYY-MM-DD'));
  };

  // function for calender submit click after select date of birth
  const handleDobCalendarSubmitClick = (selectDate: string) => {
    setDobCalendarModal(false);
    setDateOfBirth(moment(selectDate).format('YYYY-MM-DD'));
  };

  // function for submit button click for api call to create the event
  const onSubmit = async (values: any) => {
    Keyboard.dismiss();

    setLoader(true);

    const data = new FormData();
    if (profileImage != '') {
      const imageName = profileImage.path.slice(
        profileImage.path.lastIndexOf('/'),
        profileImage.path.length,
      );
      data.append('profileimage', {
        name: imageName,
        type: profileImage.mime,
        uri: profileImage.path,
      });
    }
    data.append('name', values.name);
    data.append('email', values.email + '@gmail.com');
    data.append('joiningdate', selectedDate);
    data.append('dob', dateOfBirth);
    data.append('department', values.department);
    data.append('employeeno', values.employeeNumber);
    data.append('totalExp', values.totalExp);
    data.append('designation', values.designation);
    OrganizationService.postAddNewEmployee(data)
      .then((response: any) => {
        setLoader(false);
        if (response?.data?.status == 1) {
          toastRef.current.getToast(response?.data?.message, 'success');
          navigation.replace('DrawerNavigator', {
            screen: 'BottomNavigator',
            params: {
              screen: 'BusinessHome',
            },
          });
        } else {
          if (response?.data?.error?.email != null) {
            toastRef.current.getToast(response?.data?.error?.email, 'success');
          } else {
            toastRef.current.getToast(
              response?.data?.error?.employeeno,
              'success',
            );
          }
        }
      })
      .catch((error: any) => {
        setLoader(false);
        console.log(error, 'error');
      });
  };

  const initialValues = {
    department: '',
    designation: '',
    email: '',
    employeeNumber: '',
    name: '',
    totalExp: '',
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Add Employee'}
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
          validationSchema={addNewEmployeeValidation}
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
              {/* name section  */}
              <View>
                <Text style={styles.heading}>Name</Text>
                <TextInput
                  placeholder=" Name"
                  placeholderTextColor={colors.WHITE}
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

              {/* email id section  */}
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View>
                  <Text style={styles.heading}>Email ID</Text>
                  <TextInput
                    placeholder="Email ID"
                    placeholderTextColor={colors.WHITE}
                    style={styles.emailInput}
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
                <Text style={styles.domainText}>@gmail.com</Text>
              </View>

              {/* date section */}
              <View style={{marginBottom: 5}}>
                <Text style={styles.heading}>Select Joining Date</Text>
                <View style={styles.calendarDateContainer}>
                  <TextInput
                    editable={false}
                    placeholder={'MM-DD-YYYY'}
                    placeholderTextColor={colors.WHITE}
                    value={moment(selectedDate).format('MM-DD-YYYY')}
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

              {/* date of birth section */}
              <View style={{marginBottom: 5}}>
                <Text style={styles.heading}>Select DOB</Text>
                <View style={styles.calendarDateContainer}>
                  <TextInput
                    editable={false}
                    placeholder={'MM-DD-YYYY'}
                    placeholderTextColor={colors.WHITE}
                    value={moment(dateOfBirth).format('MM-DD-YYYY')}
                    style={{
                      color: colors.WHITE,
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setDobCalendarModal(!dobCalendarModal);
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

              {/* department section  */}
              <View>
                <Text style={styles.heading}>Department</Text>
                <TextInput
                  placeholder="Department"
                  placeholderTextColor={colors.WHITE}
                  style={styles.textInput}
                  value={values.department}
                  onChangeText={handleChange('department')}
                  onBlur={() => {
                    handleBlur('department');
                    setFieldTouched('department');
                  }}
                />
                <Text style={styles.errorMessage}>
                  {touched.department && errors.department}
                </Text>
              </View>

              {/* designation section  */}
              <View>
                <Text style={styles.heading}>Designation</Text>
                <TextInput
                  placeholder="Designation"
                  placeholderTextColor={colors.WHITE}
                  style={styles.textInput}
                  value={values.designation}
                  onChangeText={handleChange('designation')}
                  onBlur={() => {
                    handleBlur('designation');
                    setFieldTouched('designation');
                  }}
                />
                <Text style={styles.errorMessage}>
                  {touched.designation && errors.designation}
                </Text>
              </View>

              {/* previous exp section  */}
              <View>
                <Text style={styles.heading}>Previous Experience</Text>
                <TextInput
                  placeholder="Previous Experience (Years)"
                  placeholderTextColor={colors.WHITE}
                  keyboardType="numeric"
                  style={styles.textInput}
                  value={values.totalExp}
                  onChangeText={handleChange('totalExp')}
                  onBlur={() => {
                    handleBlur('totalExp');
                    setFieldTouched('totalExp');
                  }}
                />
                <Text style={styles.errorMessage}>
                  {touched.totalExp && errors.totalExp}
                </Text>
              </View>

              {/* Upload Event profile photo section */}
              <Text style={styles.heading}>Upload Image</Text>

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
                    Upload Profile Image
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

              {/* employee number section  */}
              <View>
                <Text style={styles.heading}>Employee Number</Text>
                <TextInput
                  placeholder="Employee Number"
                  placeholderTextColor={colors.WHITE}
                  style={styles.textInput}
                  keyboardType="numeric"
                  value={values.employeeNumber}
                  onChangeText={handleChange('employeeNumber')}
                  onBlur={() => {
                    handleBlur('employeeNumber');
                    setFieldTouched('employeeNumber');
                  }}
                />
                <Text style={styles.errorMessage}>
                  {touched.employeeNumber && errors.employeeNumber}
                </Text>
              </View>

              {/* submit button  */}
              <SubmitButton
                loader={loader}
                buttonText={'Save'}
                submitButton={handleSubmit}
              />

              {/* Calender modal for joining date */}
              <CalendarModal
                visibleModal={calendarModal}
                onClose={() => {
                  setCalendarModal(false);
                }}
                onSubmitClick={handleCalendarSubmitClick}
              />

              {/* Calender modal for dob date*/}
              <CalendarModal
                visibleModal={dobCalendarModal}
                onClose={() => {
                  setDobCalendarModal(false);
                }}
                onSubmitClick={handleDobCalendarSubmitClick}
              />

              {/* Camera Gallery Modal for profile  */}
              <CameraGalleryModal
                visibleModal={cameraGalleryProfileModal}
                onClose={() => {
                  setCameraGalleryProfileModal(false);
                }}
                cameraClick={openCameraProfile}
                galleryClick={openLibraryProfile}
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

export default AddEmployeeOnOrganization;

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
  },
  emailInput: {
    backgroundColor: colors.BLACK3,
    borderRadius: 8,
    color: colors.WHITE,
    fontSize: 16,
    padding: 12,
    paddingLeft: 22,
    width: 150,
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
  domainText: {
    color: colors.WHITE,
    fontSize: 16,
    marginTop: 10,
    paddingHorizontal: 10,
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
    tintColor: colors.THEME_ORANGE,
    width: 20,
  },
});
