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
import ImagePicker from 'react-native-image-crop-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Formik} from 'formik';
// internal imports
import SubmitButton from '../../constants/SubmitButton';
import CameraGalleryModal from '../groups/CameraGalleryModal';
import {colors} from '../../constants/ColorConstant';
import CustomHeader from '../../constants/CustomHeader';
import {notesValidation} from '../../constants/SchemaValidation';
import BusinessCommunityService from '../../service/BusinessCommunityService';
import CommonToast from '../../constants/CommonToast';

const EditCommunity = ({navigation, route}: {navigation: any; route: any}) => {
  const [buttonLoader, setButtonLoader] = useState(false);
  const [cameraGalleryModal, setCameraGalleryModal] = useState(false);
  const [communityImage, setCommunityImage] = useState({});
  const toastRef = useRef<any>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {});
    return unsubscribe;
  }, [navigation]);

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
        setCommunityImage(image);
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
        setCommunityImage(image);
        setCameraGalleryModal(false);
      });
    } catch (error) {
      setCameraGalleryModal(false);
      console.log('error in openLibrary', error);
    }
  };

  //  function for community submit button click
  const onSubmit = (values: any) => {
    setButtonLoader(true);

    const feedBackData = new FormData();
    if (communityImage?.path != null) {
      const imageName = communityImage?.path?.slice(
        communityImage?.path.lastIndexOf('/'),
        communityImage?.length,
      );
      feedBackData.append('communityimage', {
        name: imageName,
        type: communityImage?.mime,
        uri: communityImage?.path,
      });
    }
    feedBackData.append('communityid', route?.params?.data?.id);
    feedBackData.append('name', values.title);
    feedBackData.append('description', values.description);

    BusinessCommunityService.postEditCommunity(feedBackData)
      .then((response: any) => {
        setButtonLoader(false);
        toastRef.current.getToast(response.data.message, 'success');
        navigation.replace('StackNavigation', {
          screen: 'CommunityDetailsPage',
          params: {
            id: response.data.communityid,
          },
        });
      })
      .catch((error: any) => {
        setButtonLoader(false);
        console.log(error);
      });
  };

  const initialValues = {
    description: route?.params?.data?.description,
    title: route?.params?.data?.name,
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Edit Community'}
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
        <Formik
          validationSchema={notesValidation}
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
                  placeholder="Community Name"
                  placeholderTextColor={colors.textGray}
                  style={styles.titleInput}
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
                  placeholder="Description"
                  placeholderTextColor={colors.textGray}
                  style={styles.descriptionInput}
                  value={values.description}
                  numberOfLines={8}
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
              {communityImage?.path != null ? (
                <View style={styles.uploadMediaBox}>
                  <Image
                    style={styles.image}
                    resizeMode="contain"
                    source={{uri: `${communityImage?.path}`}}
                  />
                </View>
              ) : route?.params?.data?.communityimage != null ? (
                <View style={styles.uploadMediaBox}>
                  <Image
                    style={styles.image}
                    resizeMode="contain"
                    source={{uri: `${route?.params?.data?.communityimage}`}}
                  />
                </View>
              ) : null}

              {/* upload image section */}
              <View>
                <TouchableOpacity
                  onPress={() => setCameraGalleryModal(true)}
                  style={styles.uploadMediaContainer}>
                  <Image
                    style={styles.uploadImageStyle}
                    resizeMode="contain"
                    source={require('../../assets/pngImage/UploadMedia.png')}
                  />
                  <Text style={styles.uploadMediaText}>Upload Media</Text>
                </TouchableOpacity>
              </View>

              {/* save group button  */}
              <SubmitButton
                buttonText={'Save'}
                submitButton={handleSubmit}
                loader={buttonLoader}
              />

              {/* Camera Gallery Modal  */}
              <CameraGalleryModal
                visibleModal={cameraGalleryModal}
                onClose={() => {
                  setCameraGalleryModal(false);
                }}
                cameraClick={openCamera}
                galleryClick={openLibrary}
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

export default EditCommunity;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {
    flex: 1,
    padding: 10,
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
    marginVertical: 20,
  },
  uploadImageStyle: {
    height: 30,
    paddingHorizontal: 25,
    width: 30,
  },
  uploadMediaText: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '400',
  },
  titleInput: {
    backgroundColor: colors.BLACK3,
    borderColor: colors.brightGray,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.WHITE,
    fontSize: 16,
    padding: 15,
  },
  descriptionInput: {
    backgroundColor: colors.BLACK3,
    borderColor: colors.brightGray,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.WHITE,
    fontSize: 16,
    height: 150,
    padding: 15,
  },
  errorMessage: {
    color: colors.RED,
    paddingHorizontal: 10,
  },
  uploadMediaBox: {
    borderRadius: 10,
    height: 90,
    marginBottom: 10,
    width: 130,
  },
  image: {
    borderRadius: 10,
    height: '100%',
    width: '100%',
  },
});
