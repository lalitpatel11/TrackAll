// external imports
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import React, {useEffect, useRef, useState} from 'react';
// internal imports
import CameraGalleryModal from '../groups/CameraGalleryModal';
import CommonToast from '../../constants/CommonToast';
import CustomHeader from '../../constants/CustomHeader';
import EventService from '../../service/EventService';
import SubmitButton from '../../constants/SubmitButton';
import UploadedEventImageTab from './UploadedEventImageTab';
import {colors} from '../../constants/ColorConstant';

const UploadImageOnEvent = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const [cameraGalleryModal, setCameraGalleryModal] = useState(false);
  const [eventId, setEventId] = useState<number>(route?.params?.id);
  const [eventImage, setEventImage] = useState<any[]>([]);
  const [loader, setLoader] = useState(false);
  const toastRef = useRef<any>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setEventId(route?.params?.id);
      setEventImage([]);
    });
    return unsubscribe;
  }, [navigation]);

  // function for open camera
  const openCamera = async () => {
    try {
      let value = await ImagePicker.openCamera({
        width: 1080,
        height: 1080,
        // cropping: true,
        mediaType: 'any',
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
        // cropping: true,
        multiple: true,
        mediaType: 'any',
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
  // function for submit button click for api call to upload the image on event details
  const handleSubmit = () => {
    setLoader(true);
    const feedBackData = new FormData();
    if (eventImage !== null) {
      eventImage.map((e: any, index: any) => {
        feedBackData.append(`images[${index}]`, e);
      });
    }
    feedBackData.append('eventid', eventId);

    EventService.postUploadImageOnEvent(feedBackData)
      .then((response: any) => {
        setLoader(false);
        toastRef.current.getToast(response.data.message, 'success');
        navigation.replace('StackNavigation', {
          screen: 'EventDetails',
          params: {
            id: eventId,
          },
        });
      })
      .catch((error: any) => {
        setLoader(false);
        console.log(error);
      });
  };

  // list for uploaded image on event details page
  const renderAddedSubCommentsImages = ({item}: {item: any; index: any}) => {
    return <UploadedEventImageTab eventImage={item} />;
  };

  return (
    <View style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Event Details'}
        backButton={{
          visible: true,
          onClick: () => {
            navigation.goBack();
          },
        }}
      />

      {/* body section */}
      <View style={styles.body}>
        {/* event name section*/}
        <View style={styles.eventNameContainer}>
          <Text style={styles.eventTitle}>Event Name:</Text>
          <Text style={styles.eventName}>{route?.params?.name}</Text>
        </View>

        <View style={styles.eventNameContainer}>
          <Text style={styles.heading}>You can upload image for the event</Text>
        </View>

        {eventImage?.length >= 0 ? (
          <FlatList
            data={eventImage}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={renderAddedSubCommentsImages}
            keyExtractor={(item: any, index: any) => String(index)}
          />
        ) : null}

        {/* upload image section */}
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

        {/* submit button  */}
        <SubmitButton
          loader={loader}
          buttonText={'Save'}
          submitButton={handleSubmit}
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

      {/* toaster message for error response from API  */}
      <CommonToast ref={toastRef} />
    </View>
  );
};

export default UploadImageOnEvent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {padding: 10},
  eventNameContainer: {
    flexDirection: 'row',
    height: 'auto',
    margin: 10,
    width: '95%',
  },
  eventTitle: {
    color: colors.THEME_ORANGE,
    fontSize: 20,
    fontWeight: '500',
    paddingRight: 10,
  },
  eventName: {
    color: colors.WHITE,
    fontSize: 20,
    width: '60%',
  },
  heading: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
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
    marginVertical: 20,
    paddingHorizontal: 5,
  },
  uploadImageStyle: {
    paddingHorizontal: 25,
    width: 30,
    height: 30,
  },
  uploadMediaText: {
    color: colors.WHITE,
    fontSize: 14,
  },
});
