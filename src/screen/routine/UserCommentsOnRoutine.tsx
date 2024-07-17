//external imports
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
//internal imports
import AddSubCommentModal from '../groups/AddSubCommentModal';
import AddedSubComments from '../groups/AddedSubComments';
import CommentImagesTab from '../groups/CommentImagesTab';
import CommonToast from '../../constants/CommonToast';
import DeleteAlertModal from '../groups/DeleteAlertModal';
import EditCommentModal from '../groups/EditCommentModal';
import GroupServices from '../../service/GroupServices';
import {colors} from '../../constants/ColorConstant';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserCommentsOnRoutine = ({
  getRefreshComments,
  items,
  myUserId,
}: {
  getRefreshComments: Function;
  items: any;
  myUserId: number;
}) => {
  const [allSubComment, setAllSubComment] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"
  const [selectedCommentId, setSelectedCommentId] = useState(0);
  const [selectedEditCommentData, setSelectedEditCommentData] = useState({});
  const [subCommentsModal, setSubCommentsModal] = useState(false);
  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [viewAllCommentsVisible, setViewAllCommentsVisible] = useState(false);
  const toastRef = useRef<any>();

  //To toggle the show text or hide it
  const toggleNumberOfLines = () => {
    setTextShown(!textShown);
  };

  const onTextLayout = useCallback((e: any) => {
    setLengthMore(e.nativeEvent.lines.length >= 2); //to check the text is more than 2 lines or not
  }, []);

  useEffect(() => {
    getSubComments();
  }, [items]);

  // function for get all comments data on api call
  const getSubComments = async () => {
    const data = {
      commentid: items?.commentid,
    };

    GroupServices.postAllSubCommentsOnComment(data)
      .then((response: any) => {
        setAllSubComment(response.data.allsubcomments);
      })
      .catch((error: any) => {
        console.log(error, 'error');
      });
  };

  // function for open modal on add sub comments
  const handleAddSubCommentModalClose = () => {
    setSubCommentsModal(false);
  };

  // function for delete button click on api call to delete budgetary
  const handleAddCommentSubmitClick = async (
    subComment: string,
    subCommentImage: any[],
  ) => {
    const accountId = await AsyncStorage.getItem('accountId');
    const userType = await AsyncStorage.getItem('userType');

    setSubCommentsModal(false);
    const feedBackData = new FormData();

    if (subCommentImage !== null) {
      subCommentImage.map((e: any, index: any) => {
        feedBackData.append(`images[${index}]`, e);
      });
    }
    feedBackData.append('comment_id', items.commentid);
    feedBackData.append('comment', subComment);

    if (userType == '2') {
      feedBackData.append('accountId', accountId);
    }

    GroupServices.postAddSubComment(feedBackData)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        getRefreshComments(); //for refresh the Comment section
      })
      .catch((error: any) => {
        console.log('error-', error);
      });
  };

  // list for added sub comments
  const renderAddedSubComments = ({item}: {item: any; index: any}) => {
    return (
      <AddedSubComments
        subCommentData={item}
        onEditClick={handleEditComment}
        onDeleteClick={handleDeleteComment}
        onEditClickSub={handleEditComment}
        onDeleteClickSub={handleDeleteComment}
        getSubSubCommentsRefresh={getRefreshComments}
        myUserId={myUserId}
      />
    );
  };

  // list for added sub comments image
  const renderAddedSubCommentsImages = ({item}: {item: any; index: any}) => {
    return <CommentImagesTab commentImages={item} />;
  };

  // function for open modal on delete icon click
  const handleDeleteComment = (selectedData: any) => {
    setDeleteModal(true);
    setSelectedCommentId(
      selectedData?.commentid ? selectedData?.commentid : selectedData?.id,
    );
  };

  // function for delete button click on api call to delete comment
  const deleteComment = () => {
    var data = {commentid: selectedCommentId};
    GroupServices.postDeleteComment(data)
      .then(response => {
        toastRef.current.getToast(response.data.message, 'success');
        getRefreshComments();
      })
      .catch(error => {
        console.log(error);
      });
  };

  // function for open modal on edit icon click
  const handleEditComment = (selectedData: any) => {
    setEditModal(true);
    setSelectedEditCommentData(selectedData);
  };

  // function for close modal on edit icon click
  const handleEditModalClose = () => {
    setEditModal(false);
  };

  // function for edit button click on api call to edit comment
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
    commentData.append(
      'commentid',
      selectedEditCommentData?.commentid
        ? selectedEditCommentData?.commentid
        : selectedEditCommentData?.id,
    );
    commentData.append('comment', taskComments);
    deletedImagesId.forEach((e: any) =>
      commentData.append('deletedimagesid[]', e),
    );

    GroupServices.postEditComment(commentData)
      .then(response => {
        toastRef.current.getToast(response.data.message, 'success');
        getRefreshComments(); //for refresh the comment section after edit
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      {/* profile image , user name and time section  */}
      <View style={styles.profileDirection}>
        <View style={styles.direction}>
          <View style={styles.profileImageContainer}>
            <Image
              source={
                items?.commentuserprofile
                  ? {uri: `${items.commentuserprofile}`}
                  : require('../../assets/pngImage/avatar.png')
              }
              resizeMode="contain"
              style={styles.image}
            />
          </View>
          <Text style={styles.userName}>{items.commentusername}</Text>
        </View>

        {/* display edit icon basis of customer id match  */}
        {myUserId == items?.commentuserid ? (
          <View style={styles.direction}>
            <TouchableOpacity
              style={styles.editContainer}
              onPress={() => {
                handleEditComment(items);
              }}>
              <Image
                resizeMode="contain"
                style={styles.icon}
                source={require('../../assets/pngImage/editIcon.png')}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.editContainer}
              onPress={() => {
                handleDeleteComment(items);
              }}>
              <Image
                resizeMode="contain"
                style={styles.icon}
                source={require('../../assets/pngImage/Trash.png')}
              />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      <Text style={styles.commentTime}>{items?.timedifference}</Text>

      {/* feedback comment image section */}
      {items?.commentimages?.length >= 0 ? (
        <FlatList
          data={items?.commentimages}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={renderAddedSubCommentsImages}
          keyExtractor={(item: any, index: any) => String(index)}
        />
      ) : null}

      {/* comment section  */}
      <View style={styles.commentContainer}>
        {/* quotes image section  */}
        <View style={styles.backGroundImageContainer}>
          <Image
            style={styles.image}
            resizeMode="contain"
            source={require('../../assets/pngImage/Quotes.png')}
          />
        </View>

        {/* comment section on basis of read more and read less */}
        <Text
          style={styles.userComments}
          onTextLayout={onTextLayout}
          numberOfLines={textShown ? undefined : 2}>
          {items?.comment}
        </Text>

        {lengthMore ? (
          <Text onPress={toggleNumberOfLines} style={styles.readMoreText}>
            {textShown ? 'View less...' : 'View more...'}
          </Text>
        ) : null}

        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => {
            setSubCommentsModal(true);
          }}>
          <Image
            style={styles.imageStyle}
            resizeMode="contain"
            tintColor={colors.THEME_ORANGE}
            source={require('../../assets/pngImage/replyArrow.png')}
          />
          <Text style={styles.replyText}>Reply</Text>
        </TouchableOpacity>

        {/* sub comments section with show and hide comments*/}
        {allSubComment?.length >= 0 ? (
          <>
            <FlatList
              data={!viewAllCommentsVisible ? [] : allSubComment}
              renderItem={renderAddedSubComments}
              keyExtractor={(item: any, index: any) => String(index)}
            />

            {allSubComment?.length > 0 ? (
              <TouchableOpacity
                onPress={() => {
                  setViewAllCommentsVisible(!viewAllCommentsVisible);
                }}
                style={styles.moreReplyContainer}>
                <Text style={styles.moreReplyText}>
                  {!viewAllCommentsVisible
                    ? 'View All Reply...'
                    : 'Hide All Reply...'}
                </Text>
              </TouchableOpacity>
            ) : null}
          </>
        ) : null}
      </View>

      {/* add new sub comment tab  */}
      <AddSubCommentModal
        commentDetails={items}
        visibleModal={subCommentsModal}
        onClose={handleAddSubCommentModalClose}
        onSubmitClick={handleAddCommentSubmitClick}
      />

      {/* Edit comment modal  */}
      <EditCommentModal
        commentDetails={selectedEditCommentData}
        visibleModal={editModal}
        onClose={handleEditModalClose}
        onSubmitClick={handleEditModalSubmitClick}
      />

      {/* Delete alert modal  */}
      <DeleteAlertModal
        visibleModal={deleteModal}
        onRequestClosed={() => {
          setDeleteModal(!deleteModal);
        }}
        onPressRightButton={() => {
          setDeleteModal(false);
          deleteComment();
        }}
        subHeading={'Are you sure you want to delete this comment ?'}
      />

      {/* toaster message for error response from API  */}
      <CommonToast ref={toastRef} />
    </View>
  );
};

export default UserCommentsOnRoutine;
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK2,
    borderRadius: 15,
    flex: 1,
    margin: 3,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  direction: {flexDirection: 'row'},
  profileImageContainer: {
    borderRadius: 50,
    height: 30,
    width: 30,
  },
  image: {
    borderRadius: 50,
    height: '100%',
    width: '100%',
  },
  userName: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '700',
    padding: 5,
    width: '70%',
  },
  commentTime: {
    color: colors.textGray,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 3,
    marginLeft: 25,
    padding: 5,
  },
  userComments: {
    color: colors.WHITE,
    textAlign: 'justify',
  },
  imageStyle: {
    height: 20,
    paddingHorizontal: 15,
    width: 20,
  },
  iconContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 30,
    marginRight: 5,
    marginVertical: 10,
    width: 70,
  },
  replyText: {
    color: colors.THEME_ORANGE,
    fontSize: 15,
    fontWeight: '400',
  },
  commentContainer: {
    paddingHorizontal: 10,
  },
  backGroundImageContainer: {
    height: 80,
    opacity: 0.5,
    position: 'absolute',
    right: 50,
    width: 80,
  },
  profileDirection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editContainer: {
    alignItems: 'center',
    borderRadius: 50,
    justifyContent: 'center',
    marginHorizontal: 3,
    padding: 3,
  },
  icon: {
    height: 18,
    width: 18,
  },
  readMoreText: {
    color: colors.THEME_ORANGE,
    lineHeight: 21,
    width: '35%',
  },
  moreReplyContainer: {width: '40%'},
  moreReplyText: {
    color: colors.THEME_ORANGE,
    fontSize: 16,
    fontWeight: '500',
  },
});
