//external imports
import {
  ActivityIndicator,
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
import ImagePicker from 'react-native-image-crop-picker';
import React, {useEffect, useRef, useState} from 'react';
import moment from 'moment';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
//internal imports
import CameraGalleryModal from '../../groups/CameraGalleryModal';
import CommonToast from '../../../constants/CommonToast';
import CustomHeader from '../../../constants/CustomHeader';
import DeleteAlertModal from '../../groups/DeleteAlertModal';
import EditCommentModal from '../../groups/EditCommentModal';
import GroupServices from '../../../service/GroupServices';
import SplitBillUsers from './SplitBillUsers';
import SplitComments from './SplitComments';
import SplitDetailsProcess from './SplitDetailsProcess';
import SplitService from '../../../service/SplitService';
import UploadImageTab from '../../groups/UploadImageTab';
import {colors} from '../../../constants/ColorConstant';
import {useKeyboard} from '../../../hooks/isKeyBoardOpen';

const SplitDetail = ({navigation, route}: {navigation: any; route: any}) => {
  const [buttonLoader, setButtonLoader] = useState(false);
  const [cameraGalleryModal, setCameraGalleryModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [feedbackImage, setFeedbackImage] = useState<any[]>([]);
  const [monthlySplits, setMonthlySplits] = useState<any[]>([]);
  const [pageLoader, setPageLoader] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(0);
  const [selectedEditCommentData, setSelectedEditCommentData] = useState({});
  const [splitDetails, setSplitDetails] = useState({});
  const [splitId, setSplitId] = useState(route?.params?.data);
  const [taskComments, setTaskComments] = useState('');
  const [taskState, setTaskState] = useState(false);
  const isKeyBoardOpen = useKeyboard();
  const toastRef = useRef<any>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setPageLoader(true);
      setSplitId(route?.params?.data);
      getData();
    });
    return unsubscribe;
  }, [navigation]);

  // function for get all monthly split bill data on api call
  const getData = () => {
    setFeedbackImage([]);
    SplitService.getSplitDetails(splitId)
      .then((response: any) => {
        setPageLoader(false);
        setSplitDetails(response?.data);
        setMonthlySplits(response?.data?.monthlysplits);
      })
      .catch(error => {
        setPageLoader(false);
        console.log(error);
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

  // list for uploaded images
  const renderUploadFeedbackImages = ({item}: {item: any; index: any}) => {
    return <UploadImageTab commentImages={item} />;
  };

  // list for added split bill users
  const renderAddedSplitBillUser = ({item}: {item: any; index: any}) => {
    return <SplitBillUsers items={item} />;
  };

  // list for monthly split bill progress bar
  const renderAddedSplitMonthlyProcess = ({item}: {item: any; index: any}) => {
    return (
      <SplitDetailsProcess
        items={item}
        totalAmount={splitDetails?.totalamount}
      />
    );
  };

  // function for submit button click for api call to comment on split details
  const handleSubmitClick = () => {
    Keyboard.dismiss();
    if (taskComments !== '') {
      setTaskState(false);
      setButtonLoader(true);
      const feedBackData = new FormData();
      if (feedbackImage !== null) {
        feedbackImage.map((e: any, index: any) => {
          feedBackData.append(`images[${index}]`, e);
        });
      }
      feedBackData.append('groupid', splitId);
      feedBackData.append('comment', taskComments);

      SplitService.postSplitGroupComment(feedBackData)
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
    } else {
      setTaskState(true);
    }
  };

  // function for open delete modal for delete comment
  const handleDeleteComment = (selectedData: any) => {
    setDeleteModal(true);
    setSelectedCommentId(selectedData?.id);
  };

  // function for delete button click for api call to delete the comment
  const deleteComment = () => {
    var data = {commentid: selectedCommentId};
    GroupServices.postDeleteComment(data)
      .then(response => {
        toastRef.current.getToast(response.data.message, 'success');
        getData(); //for refresh the task and comment section
      })
      .catch(error => {
        console.log(error);
      });
  };

  // function for open edit modal for edit comment
  const handleEditComment = (selectedData: any) => {
    setEditModal(true);
    setSelectedEditCommentData(selectedData);
  };

  // function for edit button click for api call to edit the comment
  const handleEditModalSubmitClick = (
    taskComments: any,
    feedbackImage: any[],
    deletedImagesId: any,
  ) => {
    setEditModal(false);
    const commentData = new FormData();

    if (feedbackImage !== null) {
      feedbackImage.map((e: any, index: any) => {
        commentData.append(`images[${index}]`, e);
      });
    }
    commentData.append('commentid', selectedEditCommentData?.id);
    commentData.append('comment', taskComments);
    deletedImagesId.forEach((e: any) =>
      commentData.append('deletedimagesid[]', e),
    );

    GroupServices.postEditComment(commentData)
      .then(response => {
        toastRef.current.getToast(response.data.message, 'success');
        getData(); //for refresh the comment section after edit
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Split Detail'}
        backButton={{
          visible: true,
          onClick: () => {
            navigation.navigate('StackNavigation', {
              screen: 'AddedSplit',
            });
          },
        }}
      />

      {/* body section */}
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={styles.body}>
        {!pageLoader ? (
          <View style={styles.container}>
            <View style={styles.direction}>
              <View style={styles.titleContainer}>
                <Text style={styles.splitTitle}>
                  {splitDetails?.groupdetails?.groupname}
                </Text>
                <Text style={styles.amountText}>
                  ${splitDetails?.totalamount}
                </Text>
                <Text style={styles.spendText}>Spent</Text>
              </View>

              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => {
                  navigation.navigate('StackNavigation', {
                    screen: 'AddSplitBill',
                    params: {
                      data: splitId,
                    },
                  });
                }}>
                <Text style={styles.buttonText}>Add Bill</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.addedByText}>
              Added by {splitDetails?.groupdetails?.groupusername} on{' '}
              {moment(splitDetails?.groupdetails?.created_at).format(
                'MMM DD, YYYY',
              )}
            </Text>

            {/* user with their split amount section */}
            <View>
              {splitDetails?.details?.length > 0 ? (
                <View style={{paddingHorizontal: 8}}>
                  <FlatList
                    data={splitDetails?.details}
                    renderItem={renderAddedSplitBillUser}
                    keyExtractor={(item: any, index: any) => String(index)}
                  />
                </View>
              ) : null}

              {/* description section */}
              <View style={styles.descriptionContainer}>
                <Text style={styles.textLine}>
                  {splitDetails?.groupdetails?.groupdescription}
                </Text>
              </View>

              {/* monthly process bar section */}
              <View style={styles.processContainer}>
                <FlatList
                  data={monthlySplits}
                  renderItem={renderAddedSplitMonthlyProcess}
                  keyExtractor={(item: any, index: any) => String(index)}
                />
              </View>

              {/* add more and split list button section */}
              <View style={styles.buttonDirection}>
                <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={() => {
                    navigation.navigate('StackNavigation', {
                      screen: 'SplitDetailViewMore',
                      params: {
                        data: splitId,
                      },
                    });
                  }}>
                  <Text style={styles.buttonText}>View More</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={() => {
                    navigation.navigate('StackNavigation', {
                      screen: 'SplitList',
                      params: {
                        data: splitId,
                      },
                    });
                  }}>
                  <Text style={styles.buttonText}>Split List</Text>
                </TouchableOpacity>
              </View>

              {/* comment section  */}
              <View style={styles.buttonDirection}>
                <Text style={styles.commentText}>Comments</Text>
              </View>

              {splitDetails?.groupdetails?.commentdetails?.length >= 0 ? (
                <View style={styles.commentContainer}>
                  <ScrollView nestedScrollEnabled={true}>
                    {splitDetails?.groupdetails?.commentdetails?.map(
                      (item: any) => {
                        return (
                          <SplitComments
                            items={item}
                            handleEditComment={handleEditComment}
                            handleDeleteComment={handleDeleteComment}
                          />
                        );
                      },
                    )}
                  </ScrollView>
                </View>
              ) : (
                <View style={styles.noCommentContainer}>
                  <Text style={styles.noCommentText}>No comment available</Text>
                </View>
              )}

              {/* add comments section */}
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
                      placeholderTextColor={colors.textGray}
                      style={styles.textInput}
                      value={taskComments}
                      onChangeText={text => {
                        setTaskState(false);
                        setTaskComments(text);
                      }}
                    />
                    {/* error section is case of empty field  */}
                    {taskState ? (
                      <Text style={styles.errorText}>
                        *Please add your comment.
                      </Text>
                    ) : (
                      <Text style={styles.errorText} />
                    )}

                    {/* upload image section  */}
                    {feedbackImage?.length >= 0 ? (
                      <View style={styles.uploadImageContainer}>
                        <FlatList
                          data={feedbackImage}
                          horizontal={true}
                          showsHorizontalScrollIndicator={false}
                          renderItem={renderUploadFeedbackImages}
                          keyExtractor={(item: any, index: any) =>
                            String(index)
                          }
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
                      source={require('../../../assets/pngImage/cameraIcon.png')}
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
            </View>
          </View>
        ) : (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.THEME_ORANGE} />
          </View>
        )}

        {/* Camera Gallery Modal  */}
        <CameraGalleryModal
          visibleModal={cameraGalleryModal}
          onClose={() => {
            setCameraGalleryModal(false);
          }}
          cameraClick={openCamera}
          galleryClick={openLibrary}
        />

        {/* Edit comment modal  */}
        <EditCommentModal
          commentDetails={selectedEditCommentData}
          visibleModal={editModal}
          onClose={() => {
            setEditModal(false);
          }}
          onSubmitClick={handleEditModalSubmitClick}
        />

        {/* Delete alert modal  */}
        <DeleteAlertModal
          visibleModal={deleteModal}
          onRequestClosed={() => {
            setDeleteModal(false);
          }}
          onPressRightButton={() => {
            setDeleteModal(false);
            deleteComment();
          }}
          subHeading={'Are you sure you want to delete this comment ?'}
        />

        {/* toaster message for error response from API  */}
        <CommonToast ref={toastRef} />
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

export default SplitDetail;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {
    padding: 10,
    flex: 1,
  },
  direction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleContainer: {
    paddingHorizontal: 5,
    width: '70%',
  },
  splitTitle: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '400',
  },
  addedByText: {
    color: colors.textGray,
    fontSize: 14,
    fontWeight: '500',
  },
  amountText: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '500',
  },
  spendText: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
    fontWeight: '400',
  },
  imageContainer: {
    backgroundColor: colors.GRAY,
    borderRadius: 50,
    height: 30,
    width: 30,
  },
  image: {
    borderRadius: 50,
    height: '100%',
    width: '100%',
  },
  textLine: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '400',
    paddingHorizontal: 10,
    textAlign: 'justify',
  },
  descriptionContainer: {
    height: 'auto',
    marginVertical: 5,
    padding: 5,
  },
  processContainer: {
    height: 120,
    marginVertical: 10,
  },
  buttonDirection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 5,
  },
  buttonContainer: {
    alignItems: 'center',
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 50,
    height: 40,
    justifyContent: 'center',
    width: 100,
  },
  buttonText: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '500',
    padding: 10,
  },
  commentText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
  },
  commentContainer: {
    height: 250,
    paddingBottom: 40,
  },
  addCommentContainer: {
    alignItems: 'center',
    backgroundColor: colors.BLACK3,
    bottom: 0,
    flexDirection: 'row',
    height: 60,
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 1,
  },
  textInputContainer: {
    width: '70%',
  },
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
    top: -35,
  },
  noCommentContainer: {
    alignItems: 'center',
    height: 250,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  noCommentText: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '500',
    padding: 20,
  },
  uploadImageContainer: {
    position: 'absolute',
    top: -60,
  },
  loaderContainer: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
