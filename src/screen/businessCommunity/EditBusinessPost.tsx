// external imports
import {
  FlatList,
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
import {Formik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// internal imports
import BusinessCommunityService from '../../service/BusinessCommunityService';
import CameraGalleryModal from '../groups/CameraGalleryModal';
import CommentImagesTab from '../groups/CommentImagesTab';
import CommonToast from '../../constants/CommonToast';
import CustomHeader from '../../constants/CustomHeader';
import ImageOnEditPost from './ImageOnEditPost';
import SubmitButton from '../../constants/SubmitButton';
import {colors} from '../../constants/ColorConstant';
import {postValidation} from '../../constants/SchemaValidation';

const EditBusinessPost = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const [arrayList, setArrayList] = useState<any[]>([]);
  const [businessId, setBusinessId] = useState(route?.params?.id);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [cameraGalleryModal, setCameraGalleryModal] = useState(false);
  const [deletedImageId, setDeletedImageId] = useState<any[]>([]);
  const [feedbackImage, setFeedbackImage] = useState<any[]>([]);
  const toastRef = useRef<any>();

  useEffect(() => {
    setBusinessId(route?.params?.id);
    setFeedbackImage([]);
    if (route?.params?.data?.images != null) {
      let imageId = route?.params?.data?.images.map((e: any) => e.id);
      setArrayList(imageId); //for pre selected images id
    }
  }, []);

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
      }).then((image: any) => {
        const img = {
          name: image.path.slice(
            image.path.lastIndexOf('/'),
            image.path.length,
          ),
          uri: image.path,
          type: image.mime,
        };
        setFeedbackImage([img]);
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
      let imageList: any = [];
      let value = await ImagePicker.openPicker({
        width: 1080,
        height: 1080,
        cropping: true,
        multiple: true,
        mediaType: 'photo',
        compressImageQuality: 1,
        compressImageMaxHeight: 1080 / 2,
        compressImageMaxWidth: 1080 / 2,
      }).then((image: any) => {
        image.map((e: any) => {
          imageList.push({
            name: e.path.slice(e.path.lastIndexOf('/'), e.path.length),
            uri: e.path,
            type: e.mime,
          });
        });
        setFeedbackImage(imageList);
        setCameraGalleryModal(false);
      });
    } catch (error) {
      setCameraGalleryModal(false);
      console.log('error in openLibrary', error);
    }
  };

  // list for comment image
  const renderAddPostImages = ({item}: {item: any; index: any}) => {
    return <CommentImagesTab commentImages={item} />;
  };

  // function for notes submit button click api call
  const onSubmit = (values: any) => {
    setButtonLoader(true);

    const feedBackData = new FormData();
    if (feedbackImage !== null) {
      feedbackImage.map((e: any, index: any) => {
        feedBackData.append(`images[${index}]`, e);
      });
    }
    feedBackData.append('postid', businessId);
    feedBackData.append('post', values.description);
    if (deletedImageId !== null) {
      deletedImageId.forEach((e: any) =>
        feedBackData.append('deleteimagesid[]', e),
      );
    }

    BusinessCommunityService.postBusinessEditPost(feedBackData)
      .then((response: any) => {
        setButtonLoader(false);
        toastRef.current.getToast(response.data.message, 'success');
        navigation.replace('StackNavigation', {
          screen: 'BusinessDetailsPage',
          params: {
            id: route?.params?.businessId,
          },
        });
      })
      .catch((error: any) => {
        setButtonLoader(false);
        console.log(error);
      });
  };

  // function for remove click
  const handleRemoveImage = (selectedImagesId: number) => {
    if (arrayList.includes(selectedImagesId)) {
      setArrayList(arrayList.filter(ids => ids !== selectedImagesId));
      setDeletedImageId(arrayList.filter(ids => ids == selectedImagesId));
    }
  };

  // list for image edit
  const renderPreAddedPostImages = ({item}: {item: any; index: any}) => {
    return (
      <ImageOnEditPost
        commentImages={item}
        removeImage={handleRemoveImage}
        checkedList={arrayList}
      />
    );
  };

  const initialValues = {
    description: route?.params?.data?.post_description,
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Edit Post'}
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
          validationSchema={postValidation}
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
              {/*upload post section  */}
              <View>
                <TextInput
                  placeholder="Write Something for your business post?"
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

              {/* pre selected image section  */}
              {route?.params?.data?.images?.length >= 0 ? (
                <FlatList
                  data={route?.params?.data?.images}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  renderItem={renderPreAddedPostImages}
                  keyExtractor={(item: any, index: any) => String(index)}
                />
              ) : null}

              {/* uploaded image section  */}
              {feedbackImage?.length >= 0 ? (
                <FlatList
                  data={feedbackImage}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  renderItem={renderAddPostImages}
                  keyExtractor={(item: any, index: any) => String(index)}
                />
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
                buttonText={'Post'}
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

export default EditBusinessPost;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {
    flex: 1,
    padding: 10,
  },
  image: {
    height: '100%',
    width: '100%',
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
    width: 30,
    paddingHorizontal: 25,
  },
  uploadMediaText: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '400',
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
});
