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
import ExpensesManagementService from '../../service/ExpensesManagementService';
import SubmitButton from '../../constants/SubmitButton';
import {categoryValidation} from '../../constants/SchemaValidation';
import {colors} from '../../constants/ColorConstant';

const AddCategoryModal = ({
  mainCategory,
  onClose,
  onSubmitClick,
  visibleModal,
}: {
  mainCategory: String;
  onClose: Function;
  onSubmitClick: Function;
  visibleModal: Boolean;
}) => {
  const [cameraGalleryModal, setCameraGalleryModal] = useState(false);
  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    setProfileImage('');
  }, [visibleModal]);

  // function for submit button click for api call to add category
  const onSubmit = (values: any) => {
    Keyboard.dismiss();
    const data = new FormData();
    if (profileImage != '') {
      const imageName = profileImage.path.slice(
        profileImage.path.lastIndexOf('/'),
        profileImage.path.length,
      );
      data.append('categoryimage', {
        name: imageName,
        type: profileImage.mime,
        uri: profileImage.path,
      });
    }
    data.append('category_type', mainCategory);
    data.append('name', values.name);
    ExpensesManagementService.postAddCategory(data)
      .then((response: any) => {
        onSubmitClick(response.data.categoryid);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const initialValues = {
    name: '',
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
            validationSchema={categoryValidation}
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
                <View style={styles.modalViewEmailId}>
                  {/* cross button section  */}
                  <TouchableOpacity
                    style={styles.crossContainer}
                    onPress={() => {
                      onClose();
                    }}>
                    <Image
                      style={styles.image}
                      resizeMode="contain"
                      source={require('../../assets/pngImage/cross.png')}
                    />
                  </TouchableOpacity>

                  <Text style={styles.cardLabel}>Add New Category</Text>

                  <TextInput
                    placeholder="Enter Category Name"
                    placeholderTextColor={colors.textGray}
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
                      Upload Category Image
                    </Text>
                  </TouchableOpacity>

                  {/*save button section */}
                  <SubmitButton
                    buttonText={'Add'}
                    submitButton={() => {
                      handleSubmit();
                    }}
                  />
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
                </View>
              </View>
            )}
          </Formik>
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

export default AddCategoryModal;

const styles = StyleSheet.create({
  container: {flex: 1},
  body: {flex: 1, padding: 5},
  centeredView: {
    backgroundColor: 'rgba(0, 0, 0, 0.66)',
    flex: 1,
    justifyContent: 'center',
  },
  modalViewEmailId: {
    backgroundColor: colors.BLACK2,
    borderRadius: 30,
    elevation: 5,
    padding: 20,
  },
  cardLabel: {
    color: colors.WHITE,
    fontSize: 22,
    fontWeight: '500',
    paddingVertical: 10,
    textAlign: 'center',
  },
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
  image: {
    borderRadius: 50,
    height: '100%',
    width: '100%',
  },
  textInput: {
    backgroundColor: colors.BLACK3,
    borderColor: colors.brightGray,
    borderRadius: 8,
    borderWidth: 2,
    color: colors.WHITE,
    fontSize: 16,
    padding: 15,
  },
  errorMessage: {
    color: colors.RED,
    fontSize: 14,
    padding: 5,
  },
  imageStyle: {
    height: '100%',
    width: '100%',
    borderRadius: 10,
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
    marginBottom: 15,
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
