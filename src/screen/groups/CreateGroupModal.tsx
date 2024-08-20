//external imports
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import React, {useEffect, useState} from 'react';
import {Formik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
//internal imports
import CameraGalleryModal from '../groups/CameraGalleryModal';
import SubmitButton from '../../constants/SubmitButton';
import {colors} from '../../constants/ColorConstant';
import {name} from '../../constants/SchemaValidation';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateGroupModal = ({
  navigation,
  onClose,
  onCreateClick,
  visibleModal,
  loader,
}: {
  navigation: any;
  onClose: Function;
  onCreateClick: Function;
  visibleModal: boolean;
  loader: boolean;
}) => {
  const [cameraGalleryModal, setCameraGalleryModal] = useState(false);
  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    setProfileImage('');
  }, [visibleModal]);

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

  // function for submit button click on api call to create group
  const onSubmit = async (values: any) => {
    Keyboard.dismiss();
    const accountId = await AsyncStorage.getItem('accountId');
    const userType = await AsyncStorage.getItem('userType');

    const data = new FormData();
    if (profileImage != '') {
      const imageName = profileImage.path.slice(
        profileImage.path.lastIndexOf('/'),
        profileImage.path.length,
      );
      data.append('groupimage', {
        name: imageName,
        type: profileImage.mime,
        uri: profileImage.path,
      });
    }
    data.append('groupname', values.groupName);

    if (userType == '2') {
      data.append('accountId', accountId);
    }

    onCreateClick(data);
  };

  const initialValues = {
    groupName: '',
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={styles.body}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={visibleModal}
          onRequestClose={() => {
            onClose();
          }}>
          <Formik
            validationSchema={name}
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
              <View style={styles.centeredView}>
                <View style={styles.modalViewGroup}>
                  {/* cross button section  */}
                  <TouchableOpacity
                    style={styles.crossContainer}
                    onPress={() => {
                      onClose();
                    }}>
                    <Image
                      style={styles.imageStyle}
                      resizeMode="contain"
                      source={require('../../assets/pngImage/cross.png')}
                    />
                  </TouchableOpacity>

                  <View style={styles.imageContainer}>
                    <Image
                      resizeMode="contain"
                      source={require('../../assets/pngImage/CreateGroupImage.png')}
                    />
                  </View>

                  <Text style={styles.groupLabel}>Enter Group Name</Text>
                  <TextInput
                    placeholder="Enter Group Name"
                    placeholderTextColor={colors.textGray}
                    style={styles.textInput}
                    value={values.groupName}
                    onChangeText={handleChange('groupName')}
                    onBlur={() => {
                      handleBlur('groupName');
                      setFieldTouched('groupName');
                    }}
                  />
                  <Text style={styles.errorMessage}>
                    {touched.groupName && errors.groupName}
                  </Text>

                  {/* uploded media section  */}
                  {profileImage !== '' ? (
                    <View style={styles.uploadMediaBox}>
                      <Image
                        style={styles.imageStyle}
                        resizeMode="contain"
                        source={{uri: `${profileImage?.path}`}}
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
                    <Text style={styles.uploadMediaText}>
                      Upload group image
                    </Text>
                  </TouchableOpacity>

                  {/* button with loader  */}
                  <View style={styles.buttonContainer}>
                    <SubmitButton
                      loader={loader}
                      submitButton={handleSubmit}
                      buttonText={'Create Group'}
                    />
                  </View>
                </View>
              </View>
            )}
          </Formik>

          {Platform.OS === 'ios' ? (
            <CameraGalleryModal
              visibleModal={cameraGalleryModal}
              onClose={() => {
                setCameraGalleryModal(false);
              }}
              cameraClick={openCamera}
              galleryClick={openLibrary}
            />
          ) : null}
        </Modal>

        {/* Camera Gallery Modal  */}
        <CameraGalleryModal
          visibleModal={cameraGalleryModal}
          onClose={() => {
            setCameraGalleryModal(false);
          }}
          cameraClick={openCamera}
          galleryClick={openLibrary}
        />
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateGroupModal;

const styles = StyleSheet.create({
  container: {flex: 1},
  body: {
    flex: 1,
    padding: 5,
  },
  centeredView: {
    backgroundColor: 'rgba(0, 0, 0, 0.66)',
    flex: 1,
    justifyContent: 'center',
  },
  modalViewGroup: {
    backgroundColor: colors.BLACK2,
    borderRadius: 30,
    paddingVertical: 40,
    paddingHorizontal: 20,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  imageContainer: {
    alignSelf: 'center',
    height: 150,
    justifyContent: 'center',
    marginBottom: 10,
    width: 190,
  },
  groupLabel: {
    color: colors.WHITE,
    fontSize: 18,
    paddingVertical: 10,
  },
  textInput: {
    backgroundColor: colors.BLACK3,
    borderColor: colors.brightGray,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.WHITE,
    fontSize: 16,
    padding: 15,
  },
  errorMessage: {
    color: colors.RED,
    paddingHorizontal: 10,
  },
  buttonContainer: {paddingTop: 10},
  crossContainer: {
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 50,
    height: 30,
    position: 'absolute',
    right: 15,
    top: 10,
    width: 30,
    zIndex: 1,
  },
  imageStyle: {
    borderRadius: 10,
    height: '100%',
    width: '100%',
  },
  uploadMediaContainer: {
    alignItems: 'center',
    backgroundColor: colors.brightGray,
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
  uploadMediaText: {
    color: colors.THEME_BLACK,
    fontSize: 14,
    fontWeight: '400',
  },
  uploadMediaBox: {
    borderRadius: 10,
    height: 90,
    marginBottom: 10,
    width: 130,
  },
});
