// external imports
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
import React, {useEffect, useRef, useState} from 'react';
import moment from 'moment';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// internal imports
import CommonToast from '../../constants/CommonToast';
import CustomHeader from '../../constants/CustomHeader';
import DeleteAlertModal from '../groups/DeleteAlertModal';
import OrganizationService from '../../service/OrganisationService';
import {colors} from '../../constants/ColorConstant';

const EmployeeDetailsOnOrganization = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [employeeDetails, setEmployeeDetails] = useState(route?.params?.data);
  const [employeeId, setEmployeeId] = useState(0);
  const toastRef = useRef<any>();
  const [selectedDate, setSelectedDate] = useState(
    moment(new Date()).format('YYYY-MM-DD'),
  );
  const [dateOfBirth, setDateOfBirth] = useState(
    moment(new Date()).format('YYYY-MM-DD'),
  );
  useEffect(() => {
    setEmployeeDetails(route?.params?.data);

    // date of birth
    setDateOfBirth(route?.params?.data?.dob);

    // date of joining
    setSelectedDate(route?.params?.data?.joiningdate);
  }, []);

  // function for open camera
  //   const openCameraProfile = async () => {
  //     try {
  //       let value = await ImagePicker.openCamera({
  //         width: 1080,
  //         height: 1080,
  //         cropping: true,
  //         mediaType: 'photo',
  //         compressImageQuality: 1,
  //         compressImageMaxHeight: 1080 / 2,
  //         compressImageMaxWidth: 1080 / 2,
  //       }).then(image => {
  //         setProfileImage(image);
  //         setCameraGalleryProfileModal(false);
  //       });
  //     } catch (error) {
  //       setCameraGalleryProfileModal(false);

  //       console.log('error in openLibrary', error);
  //     }
  //   };

  // function for open gallery
  //   const openLibraryProfile = async () => {
  //     try {
  //       let value = await ImagePicker.openPicker({
  //         width: 1080,
  //         height: 1080,
  //         cropping: true,
  //         mediaType: 'photo',
  //         compressImageQuality: 1,
  //         compressImageMaxHeight: 1080 / 2,
  //         compressImageMaxWidth: 1080 / 2,
  //       }).then(image => {
  //         setProfileImage(image);
  //         setCameraGalleryProfileModal(false);
  //       });
  //     } catch (error) {
  //       setCameraGalleryProfileModal(false);
  //       console.log('error in openLibrary', error);
  //     }
  //   };

  // navigation on edit employee click
  const handleEditClick = (data: any) => {
    navigation.navigate('StackNavigation', {
      screen: 'EditEmployeeOnOrganization',
      params: {
        data: data,
      },
    });
  };

  // open modal on delete icon click for employee
  const handleDeleteClick = (id: any) => {
    setDeleteModal(true);
    setEmployeeId(id);
  };

  // function for delete button click for api call to delete the employee
  const handleDelete = () => {
    setDeleteModal(false);
    OrganizationService.getDeleteOrganizationEmployee(employeeId)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        navigation.goBack();
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  // function for submit button click for api call to create the event
  //   const onSubmit = async (values: any) => {
  //     Keyboard.dismiss();
  //     setLoader(true);

  //     const data = new FormData();
  //     if (profileImage != '') {
  //       const imageName = profileImage.path.slice(
  //         profileImage.path.lastIndexOf('/'),
  //         profileImage.path.length,
  //       );
  //       data.append('profileimage', {
  //         name: imageName,
  //         type: profileImage.mime,
  //         uri: profileImage.path,
  //       });
  //     }
  //     data.append('name', values.name);
  //     data.append('email', values.email);
  //     data.append('joiningdate', selectedDate);
  //     data.append('dob', dateOfBirth);
  //     data.append('department', values.department);
  //     data.append('employeeno', values.employeeNumber);
  //     data.append('totalExp', values.totalExp);
  //     data.append('id', route?.params?.data?.id);
  //     data.append('designation', values.designation);

  //     OrganizationService.postEditOrganizationEmployee(data)
  //       .then((response: any) => {
  //         setLoader(false);
  //         if (response?.data?.status == 1) {
  //           toastRef.current.getToast(response?.data?.message, 'success');
  //           navigation.replace('DrawerNavigator', {
  //             screen: 'BottomNavigator',
  //             params: {
  //               screen: 'BusinessHome',
  //             },
  //           });
  //         } else {
  //           if (response?.data?.error?.email != null) {
  //             toastRef.current.getToast(response?.data?.error?.email, 'success');
  //           } else {
  //             toastRef.current.getToast(
  //               response?.data?.error?.employeeno,
  //               'success',
  //             );
  //           }
  //         }
  //       })
  //       .catch((error: any) => {
  //         setLoader(false);
  //         console.log(error, 'error');
  //       });
  //   };

  //   const initialValues = {
  //     name: route?.params?.data?.name,
  //     email: route?.params?.data?.email,
  //     department: route?.params?.data?.department,
  //     employeeNumber: route?.params?.data?.employeid,
  //     totalExp: route?.params?.data?.previousexperience,
  //     designation: route?.params?.data?.designation,
  //   };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Employee Detail'}
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
        {/* <Formik
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
          }) => ( */}
        <View style={styles.body}>
          {/* edit and delete icon */}
          <View style={styles.iconContainer}>
            <TouchableOpacity
              style={styles.editDeleteContainer}
              onPress={() => {
                handleEditClick(employeeDetails);
              }}>
              <Image
                style={{height: 18, width: 18}}
                resizeMode="contain"
                source={require('../../assets/pngImage/editIcon.png')}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.editDeleteContainer}
              onPress={() => {
                handleDeleteClick(employeeDetails?.id);
              }}>
              <Image
                style={{height: 18, width: 18}}
                resizeMode="contain"
                source={require('../../assets/pngImage/Trash.png')}
              />
            </TouchableOpacity>
          </View>

          {/* name section  */}
          <View>
            <Text style={styles.heading}>Name</Text>
            <TextInput
              editable={false}
              placeholder=" Name"
              placeholderTextColor={colors.GRAY}
              style={styles.textInput}
              value={employeeDetails?.name}
              //   onChangeText={handleChange('name')}
              //   onBlur={() => {
              //     handleBlur('name');
              //     setFieldTouched('name');
              //   }}
            />
            {/* <Text style={styles.errorMessage}>
                  {touched.name && errors.name}
                </Text> */}
          </View>

          {/* email id section  */}
          {/* <View > */}
          <View>
            <Text style={styles.heading}>Email ID</Text>
            <TextInput
              editable={false}
              placeholder="Email ID"
              placeholderTextColor={colors.GRAY}
              style={styles.textInput}
              value={employeeDetails?.email}
              // onChangeText={handleChange('email')}
              // onBlur={() => {
              //   handleBlur('email');
              //   setFieldTouched('email');
              // }}
            />

            {/* <Text style={styles.errorMessage}>
                    {touched.email && errors.email}
                  </Text> */}
          </View>
          {/* <Text
              style={{
                color: colors.GRAY,
                fontSize: 16,
                marginTop: 35,
                paddingHorizontal: 10,
              }}>
              @gmail.com
            </Text> */}
          {/* </View> */}

          {/* date section */}
          <View style={{marginBottom: 5}}>
            <Text style={styles.heading}>Select Joining Date</Text>
            <View style={styles.calendarDateContainer}>
              <TextInput
                editable={false}
                placeholder={'MM-DD-YYYY'}
                placeholderTextColor={colors.GRAY}
                value={moment(selectedDate).format('MM-DD-YYYY')}
                style={{
                  color: colors.WHITE,
                }}
              />
              <View
                // onPress={() => {
                //   setCalendarModal(!calendarModal);
                // }}
                style={styles.calendarIcon}>
                <Image
                  resizeMode="contain"
                  style={styles.timeIcon}
                  source={require('../../assets/pngImage/CalendarBlank1.png')}
                />
              </View>
            </View>
          </View>

          {/* date of birth section */}
          <View style={{marginBottom: 5}}>
            <Text style={styles.heading}>Select DOB</Text>
            <View style={styles.calendarDateContainer}>
              <TextInput
                editable={false}
                placeholder={'MM-DD-YYYY'}
                placeholderTextColor={colors.GRAY}
                value={moment(dateOfBirth).format('MM-DD-YYYY')}
                style={{
                  color: colors.WHITE,
                }}
              />
              <View
                // onPress={() => {
                //   setDobCalendarModal(!dobCalendarModal);
                // }}
                style={styles.calendarIcon}>
                <Image
                  resizeMode="contain"
                  style={styles.timeIcon}
                  source={require('../../assets/pngImage/CalendarBlank1.png')}
                />
              </View>
            </View>
          </View>

          {/* department section  */}
          <View>
            <Text style={styles.heading}>Department</Text>
            <TextInput
              editable={false}
              placeholder="Department"
              placeholderTextColor={colors.GRAY}
              style={styles.textInput}
              value={employeeDetails?.department}
              //   onChangeText={handleChange('department')}
              //   onBlur={() => {
              //     handleBlur('department');
              //     setFieldTouched('department');
              //   }}
            />
            {/* <Text style={styles.errorMessage}>
                  {touched.department && errors.department}
                </Text> */}
          </View>

          {/* designation section  */}
          <View>
            <Text style={styles.heading}>Designation</Text>
            <TextInput
              editable={false}
              placeholder="Designation"
              placeholderTextColor={colors.GRAY}
              style={styles.textInput}
              value={employeeDetails?.designation}
              //   onChangeText={handleChange('designation')}
              //   onBlur={() => {
              //     handleBlur('designation');
              //     setFieldTouched('designation');
              //   }}
            />
            {/* <Text style={styles.errorMessage}>
                  {touched.designation && errors.designation}
                </Text> */}
          </View>

          {/* Previous exp section  */}
          <View>
            <Text style={styles.heading}>Previous Experience</Text>
            <TextInput
              editable={false}
              placeholder="Previous Experience (Years)"
              placeholderTextColor={colors.GRAY}
              style={styles.textInput}
              value={employeeDetails?.previousexperience}
              //   onChangeText={handleChange('totalExp')}
              //   onBlur={() => {
              //     handleBlur('totalExp');
              //     setFieldTouched('totalExp');
              //   }}
            />
            {/* <Text style={styles.errorMessage}>
                  {touched.totalExp && errors.totalExp}
                </Text> */}
          </View>

          {/* Upload Event profile photo section */}
          <Text style={styles.heading}>Profile Image</Text>

          {/* <TouchableOpacity
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
              </TouchableOpacity> */}

          {route?.params?.data?.profile_image != '' ? (
            <View style={styles.ImageSection}>
              <Image
                source={{
                  uri: `${route?.params?.data?.profile_image}`,
                }}
                style={styles.profileImage}
              />
            </View>
          ) : (
            <View>
              <Text style={styles.noImage}>No images added</Text>
            </View>
          )}

          {/* employee number section  */}
          <View>
            <Text style={styles.heading}>Employee Number</Text>
            <TextInput
              placeholder="Employee Number"
              editable={false}
              placeholderTextColor={colors.GRAY}
              style={styles.textInput}
              value={employeeDetails?.employeid}
              //   onChangeText={handleChange('employeeNumber')}
              //   onBlur={() => {
              //     handleBlur('employeeNumber');
              //     setFieldTouched('employeeNumber');
              //   }}
            />
            {/* <Text style={styles.errorMessage}>
                  {touched.employeeNumber && errors.employeeNumber}
                </Text> */}
          </View>

          {/* submit button  */}
          {/* <SubmitButton
                loader={loader}
                buttonText={'Save'}
                submitButton={handleSubmit}
              /> */}

          {/* Camera Gallery Modal for profile  */}
          {/* <CameraGalleryModal
                visibleModal={cameraGalleryProfileModal}
                onClose={() => {
                  setCameraGalleryProfileModal(false);
                }}
                cameraClick={openCameraProfile}
                galleryClick={openLibraryProfile}
              /> */}

          {/* Delete alert modal for delete budget */}
          <DeleteAlertModal
            visibleModal={deleteModal}
            onRequestClosed={() => {
              setDeleteModal(false);
            }}
            onPressRightButton={() => {
              handleDelete();
            }}
            subHeading={'Are you sure you want to delete this employee ?'}
          />

          {/* toaster message for error response from API  */}
          <CommonToast ref={toastRef} />
        </View>
        {/* )}
        </Formik> */}
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

export default EmployeeDetailsOnOrganization;

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
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    right: 15,
    top: 10,
    width: '18%',
    zIndex: 1,
  },
  editDeleteContainer: {
    alignItems: 'center',
    borderRadius: 50,
    justifyContent: 'center',
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
    color: colors.GRAY,
    fontSize: 16,
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
  noImage: {
    color: colors.WHITE,
    fontSize: 12,
    padding: 5,
    fontWeight: '400',
    textAlign: 'center',
  },
});
