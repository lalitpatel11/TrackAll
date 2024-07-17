//external imports
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
import React, {useEffect, useRef, useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
//internal imports
import CameraGalleryModal from '../groups/CameraGalleryModal';
import CommonToast from '../../constants/CommonToast';
import CustomHeader from '../../constants/CustomHeader';
import GroupServices from '../../service/GroupServices';
import UploadImageTab from '../groups/UploadImageTab';
import UserCommentsOnRoutine from './UserCommentsOnRoutine';
import {colors} from '../../constants/ColorConstant';
import {useKeyboard} from '../../hooks/isKeyBoardOpen';

export const {width, height} = Dimensions.get('screen');

const RoutineAllComments = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const [allCommentCount, setAllCommentCount] = useState([]);
  const [allComments, setAllComments] = useState([]);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [cameraGalleryModal, setCameraGalleryModal] = useState(false);
  const [feedbackImage, setFeedbackImage] = useState<any[]>([]);
  const [myUserId, setMyUserId] = useState<any>();
  const [pageLoader, setPageLoader] = useState(false);
  const [routineId] = useState(route?.params?.data);
  const [taskComments, setTaskComments] = useState('');
  const [taskName, setTaskName] = useState('');
  const isKeyBoardOpen = useKeyboard();
  const toastRef = useRef<any>();

  useEffect(() => {
    setTaskComments('');
    setFeedbackImage([]);
    setPageLoader(true);
    getData();
  }, []);

  // function for get all comments data on api call
  const getData = async () => {
    // user id for delete and edit icon
    const token = await AsyncStorage.getItem('userId');
    setMyUserId(token);

    setFeedbackImage([]);
    const data = {
      taskid: routineId,
      tasktype: 'R',
    };
    GroupServices.postAllCommentsOnTask(data)
      .then((response: any) => {
        setPageLoader(false);
        setTaskName(response.data.taskdetails.name);
        setAllComments(response.data.taskdetails.commentdetails);
        setAllCommentCount(response.data.taskdetails.commentsCount);
      })
      .catch((error: any) => {
        setPageLoader(false);
        console.log('error', error);
      });
  };

  // list for comments on routine
  const renderUsersComments = ({item}: {item: any; index: any}) => {
    return (
      <UserCommentsOnRoutine
        items={item}
        getRefreshComments={getData}
        myUserId={myUserId}
      />
    );
  };

  // list for upload images
  const renderUploadFeedbackImages = ({item}: {item: any; index: any}) => {
    return <UploadImageTab commentImages={item} />;
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
        multiple: true,
        cropping: true,
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

  // function for submit button click on api call to add comment
  const handleSubmitClick = async () => {
    const accountId = await AsyncStorage.getItem('accountId');
    const userType = await AsyncStorage.getItem('userType');

    Keyboard.dismiss();

    if (taskComments !== '' || feedbackImage?.length > 0) {
      setButtonLoader(true);

      const feedBackData = new FormData();
      if (feedbackImage !== null) {
        feedbackImage.map((e: any, index: any) => {
          feedBackData.append(`images[${index}]`, e);
        });
      }
      feedBackData.append('object_id', routineId);
      feedBackData.append('comment', taskComments);
      feedBackData.append('comment_type', 'R');

      if (userType == '2') {
        feedBackData.append('accountId', accountId);
      }

      GroupServices.postAddComment(feedBackData)
        .then((response: any) => {
          setButtonLoader(false);
          toastRef.current.getToast(response.data.message, 'success');
          getData(); //for refresh the task and comment section
          setTaskComments('');
        })
        .catch((error: any) => {
          setButtonLoader(false);
          console.log('error', error);
        });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <Loader showLoader={pageLoader} />
      {/* header section */}
      <CustomHeader
        headerText={'Comments'}
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
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* routine name section*/}
          <View style={styles.taskNameContainer}>
            <Text style={styles.taskTitle}>Routine Name:</Text>
            <Text style={styles.taskName}>{taskName}</Text>
          </View>

          {/* other users comments on this task*/}
          {allComments?.length > 0 ? (
            <View style={styles.commentContainer}>
              <Text style={styles.commentCount}>
                Comments ({allCommentCount})
              </Text>
              <FlatList
                data={allComments}
                renderItem={renderUsersComments}
                keyExtractor={(item: any, index: any) => String(index)}
              />
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAwareScrollView>

      {allComments?.length > 0 ? null : (
        <>
          {pageLoader ? null : (
            <View style={styles.noCommentContainer}>
              <Image
                resizeMode="contain"
                tintColor={colors.WHITE}
                style={styles.noCommentImage}
                source={require('../../assets/pngImage/noCommentImage.png')}
              />
              <Text style={styles.noCommentText}>No Comments Available!</Text>
            </View>
          )}
        </>
      )}

      {/* add comment section  */}
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          marginBottom: isKeyBoardOpen ? '15%' : 0,
        }}>
        <View style={styles.addCommentContainer}>
          <View style={styles.textInputContainer}>
            <TextInput
              placeholder="Write a comment..."
              placeholderTextColor={colors.THEME_WHITE}
              style={styles.textInput}
              multiline={true}
              value={taskComments}
              onChangeText={text => {
                setTaskComments(text);
              }}
            />

            {/* upload image section  */}
            {feedbackImage?.length >= 0 ? (
              <View style={styles.uploadImageContainer}>
                <FlatList
                  data={feedbackImage}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  renderItem={renderUploadFeedbackImages}
                  keyExtractor={(item: any, index: any) => String(index)}
                />
              </View>
            ) : null}
          </View>

          <TouchableOpacity
            style={styles.cameraIconContainer}
            onPress={() => setCameraGalleryModal(true)}>
            <Image
              resizeMode="contain"
              tintColor={colors.WHITE}
              style={{height: 25, width: 25}}
              source={require('../../assets/pngImage/cameraIcon.png')}
            />
          </TouchableOpacity>

          {!buttonLoader ? (
            <TouchableOpacity
              style={styles.submitButtonContainer}
              onPress={() => {
                handleSubmitClick();
              }}>
              <Text style={styles.submitText}>Send</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.submitButtonContainer}>
              <ActivityIndicator color={colors.WHITE} />
            </View>
          )}
        </View>
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
    </KeyboardAvoidingView>
  );
};

export default RoutineAllComments;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {
    height: height,
    marginBottom: 40,
    padding: 10,
  },
  taskNameContainer: {
    paddingVertical: 5,
    width: '95%',
  },
  commentCount: {
    color: colors.WHITE,
    fontSize: 17,
    fontWeight: '500',
    padding: 8,
  },
  taskTitle: {
    color: colors.WHITE,
    fontSize: 12,
    fontWeight: '400',
  },
  taskName: {
    color: colors.THEME_ORANGE,
    fontSize: 16,
    fontWeight: '500',
    width: '95%',
  },
  loaderContainer: {
    alignSelf: 'center',
    height: '100%',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
  },
  addCommentContainer: {
    alignItems: 'center',
    backgroundColor: colors.BLACK3,
    borderRadius: 5,
    flexDirection: 'row',
    height: 60,
    justifyContent: 'flex-end',
  },
  textInputContainer: {width: '70%'},
  textInput: {
    color: colors.WHITE,
    paddingLeft: 20,
    width: '100%',
  },
  cameraIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '10%',
  },
  submitButtonContainer: {
    alignItems: 'center',
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 5,
    height: 42,
    justifyContent: 'center',
    padding: 7,
    width: '19%',
  },
  submitText: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '500',
  },
  errorText: {
    color: colors.RED,
    padding: 10,
    position: 'absolute',
    top: -25,
    zIndex: 1,
  },
  noCommentContainer: {
    alignItems: 'center',
    bottom: '50%',
    justifyContent: 'center',
    width: '100%',
  },
  noCommentImage: {
    height: 135,
    width: 135,
  },
  noCommentText: {
    color: colors.THEME_WHITE,
    fontSize: 18,
    fontWeight: '400',
    padding: 18,
  },
  commentContainer: {flex: 1},
  uploadImageContainer: {top: -60, position: 'absolute'},
});

// loader part
export const Loader = ({showLoader = false}) => {
  return (
    <>
      {showLoader ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.THEME_ORANGE} />
        </View>
      ) : null}
    </>
  );
};
