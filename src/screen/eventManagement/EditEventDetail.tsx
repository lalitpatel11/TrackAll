// external imports
import {
  FlatList,
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
import moment from 'moment';
import {Formik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// external imports
import CameraGalleryModal from '../groups/CameraGalleryModal';
import CommentImageOnEditModal from '../groups/CommentImageOnEditModal';
import CommonToast from '../../constants/CommonToast';
import CustomHeader from '../../constants/CustomHeader';
import EventService from '../../service/EventService';
import SubmitButton from '../../constants/SubmitButton';
import {colors} from '../../constants/ColorConstant';
import {eventDetailsValidation} from '../../constants/SchemaValidation';
import CommentImagesTab from '../groups/CommentImagesTab';

const EditEventDetail = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const [arrayList, setArrayList] = useState<any[]>([]);
  const [cameraGalleryModal, setCameraGalleryModal] = useState(false);
  const [deletedImageId, setDeletedImageId] = useState<any[]>([]);
  const [eventImage, setEventImage] = useState<any[]>([]);
  const [loader, setLoader] = useState(false);
  const toastRef = useRef<any>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // for preselected images
      if (route?.params?.data?.image != null) {
        let imageId = route?.params?.data?.image.map((e: any) => e.imageid);
        setArrayList(imageId); //for pre selected images id
      }
    });
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
      }).then((image: any) => {
        const img = {
          name: image.path.slice(
            image.path.lastIndexOf('/'),
            image.path.length,
          ),
          uri: image.path,
          type: image.mime,
        };
        setEventImage([img]);
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
        setEventImage(imageList);
        setCameraGalleryModal(false);
      });
    } catch (error) {
      setCameraGalleryModal(false);
      console.log('error in openLibrary', error);
    }
  };

  // list for comments images
  const renderAddedTaskImages = ({item}: {item: any; index: any}) => {
    return <CommentImagesTab commentImages={item} />;
  };

  // list for previously added event images
  const renderPreAddedTaskImages = ({item}: {item: any; index: any}) => {
    return (
      <CommentImageOnEditModal
        commentImages={item}
        removeImage={handleRemoveImage}
        checkedList={arrayList}
      />
    );
  };

  // function for remove image
  const handleRemoveImage = (selectedImagesId: number) => {
    if (arrayList.includes(selectedImagesId)) {
      setArrayList(arrayList.filter(ids => ids !== selectedImagesId));
      setDeletedImageId(arrayList.filter(ids => ids == selectedImagesId));
    }
  };

  // function for submit button click for api call to edit the event details
  const onSubmit = (values: any) => {
    Keyboard.dismiss();
    setLoader(true);
    const feedBackData = new FormData();

    if (eventImage !== null) {
      eventImage.map((e: any, index: any) => {
        feedBackData.append(`images[${index}]`, e);
      });
    }

    if (route?.params?.profileImage != '') {
      const imageName = route?.params?.profileImage.path.slice(
        route?.params?.profileImage.path.lastIndexOf('/'),
        route?.params?.profileImage.path.length,
      );
      feedBackData.append('eventprofile', {
        name: imageName,
        type: route?.params?.profileImage.mime,
        uri: route?.params?.profileImage.path,
      });
    }

    if (route?.params?.coverImage != '') {
      const imageName = route?.params?.coverImage.path.slice(
        route?.params?.coverImage.path.lastIndexOf('/'),
        route?.params?.coverImage.path.length,
      );
      feedBackData.append('eventcoverphoto', {
        name: imageName,
        type: route?.params?.coverImage.mime,
        uri: route?.params?.coverImage.path,
      });
    }

    feedBackData.append('eventid', route?.params?.id);
    feedBackData.append('title', route?.params?.value?.title);
    feedBackData.append('description', route?.params?.value?.description);
    feedBackData.append('date', route?.params?.selectedDate);
    feedBackData.append('time', moment(route?.params?.time).format('hh:mm A'));
    feedBackData.append('eventtype', route?.params?.value?.eventType);
    feedBackData.append('addressName', route?.params?.eventSchema?.addressName);
    feedBackData.append(
      'eventAddress',
      route?.params?.eventSchema?.eventAddress,
    );
    feedBackData.append('latitude', route?.params?.eventSchema?.latitude);
    feedBackData.append('longitude', route?.params?.eventSchema?.longitude);
    feedBackData.append('venue', route?.params?.value?.venue);
    feedBackData.append('details', values.eventDetails);
    feedBackData.append('eventtags', values.eventTag);
    feedBackData.append('name', values.name);
    feedBackData.append('contactno', values.number);
    feedBackData.append('email', values.email);
    if (deletedImageId !== null) {
      deletedImageId.map((e: any, index: any) => {
        feedBackData.append(`deleteimageid[${index}]`, e);
      });
    }

    EventService.postEditEvent(feedBackData)
      .then((response: any) => {
        setLoader(false);
        toastRef.current.getToast(response?.data?.message, 'success');
        navigation.replace('StackNavigation', {
          screen: 'EventDetails',
          params: {id: response?.data?.eventid},
        });
      })
      .catch(error => {
        setLoader(false);
        console.log('error----', error);
      });
  };

  const initialValues = {
    email: route?.params?.data?.email,
    eventDetails: route?.params?.data?.details,
    eventTag: route?.params?.data?.eventtags,
    name: route?.params?.data?.name,
    number: route?.params?.data?.contactno,
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Edit Event'}
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
          validationSchema={eventDetailsValidation}
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
              {/* Upload Event Photo section */}
              <TouchableOpacity
                onPress={() => setCameraGalleryModal(true)}
                style={styles.uploadMediaContainer}>
                <View style={{alignItems: 'center', flexDirection: 'row'}}>
                  <Image
                    style={styles.uploadImageStyle}
                    resizeMode="contain"
                    source={require('../../assets/pngImage/UploadMedia.png')}
                  />
                  <Text style={styles.uploadMediaText}>Upload Event Photo</Text>
                </View>
                <Image
                  resizeMode="contain"
                  source={require('../../assets/pngImage/repeatArrow.png')}
                />
              </TouchableOpacity>

              {/* pre selected image section */}
              {route?.params?.data?.image?.length >= 0 ? (
                <FlatList
                  data={route?.params?.data?.image}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  renderItem={renderPreAddedTaskImages}
                  keyExtractor={(item: any, index: any) => String(index)}
                />
              ) : null}

              <View style={{marginVertical: 5}}>
                {eventImage?.length >= 0 ? (
                  <FlatList
                    data={eventImage}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderAddedTaskImages}
                    keyExtractor={(item: any, index: any) => String(index)}
                  />
                ) : null}
              </View>

              {/*event details section */}
              <View>
                <TextInput
                  placeholder="Enter Event Details"
                  placeholderTextColor={colors.WHITE}
                  style={styles.descriptionInput}
                  value={values.eventDetails}
                  numberOfLines={3}
                  multiline={true}
                  textAlignVertical="top"
                  onChangeText={handleChange('eventDetails')}
                  onBlur={() => {
                    handleBlur('eventDetails');
                    setFieldTouched('eventDetails');
                  }}
                />
                <Text style={styles.errorMessage}>
                  {touched.eventDetails && errors.eventDetails}
                </Text>
              </View>

              {/*event tag section  */}
              <View>
                <TextInput
                  placeholder="Type Event Tag"
                  placeholderTextColor={colors.WHITE}
                  style={styles.descriptionInput}
                  value={values.eventTag}
                  numberOfLines={3}
                  multiline={true}
                  textAlignVertical="top"
                  onChangeText={handleChange('eventTag')}
                  onBlur={() => {
                    handleBlur('eventTag');
                    setFieldTouched('eventTag');
                  }}
                />
                <Text style={styles.errorMessage}>
                  {touched.eventTag && errors.eventTag}
                </Text>
              </View>

              {/* person name section  */}
              <View>
                <TextInput
                  placeholder="Event Creator Name"
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

              {/* contact number section  */}
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
                  }}
                />

                <Text style={styles.errorMessage}>
                  {touched.email && errors.email}
                </Text>
              </View>

              {/* submit button  */}
              <SubmitButton
                loader={loader}
                buttonText={'Save'}
                submitButton={handleSubmit}
              />
            </View>
          )}
        </Formik>

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
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditEventDetail;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {
    padding: 10,
    flex: 1,
    paddingBottom: 40,
  },
  uploadMediaContainer: {
    alignItems: 'center',
    backgroundColor: colors.BLACK3,
    borderColor: colors.THEME_ORANGE,
    borderRadius: 15,
    borderStyle: 'dotted',
    borderWidth: 2,
    elevation: 3,
    flexDirection: 'row',
    height: 60,
    justifyContent: 'space-between',
    marginVertical: 8,
    paddingHorizontal: 5,
  },
  uploadImageStyle: {
    height: 30,
    width: 30,
    paddingHorizontal: 25,
  },
  uploadMediaText: {
    color: colors.WHITE,
    fontSize: 14,
  },
  descriptionInput: {
    backgroundColor: colors.BLACK3,
    borderColor: colors.brightGray,
    borderRadius: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors.WHITE,
    elevation: 3,
    fontSize: 16,
    height: 100,
    padding: 15,
    paddingLeft: 22,
  },
  textInput: {
    backgroundColor: colors.BLACK3,
    borderColor: colors.brightGray,
    borderRadius: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors.WHITE,
    elevation: 3,
    fontSize: 16,
    padding: 15,
    paddingLeft: 22,
  },
  numberInput: {
    backgroundColor: colors.BLACK3,
    borderColor: colors.brightGray,
    borderRadius: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors.WHITE,
    elevation: 3,
    fontSize: 16,
    padding: 15,
    paddingLeft: 30,
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
});
