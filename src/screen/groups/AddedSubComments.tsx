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
import moment from 'moment';
//internal imports
import AddSubCommentModal from './AddSubCommentModal';
import AddedSubSubComments from './AddedSubSubComments';
import CommentImagesTab from './CommentImagesTab';
import CommonToast from '../../constants/CommonToast';
import GroupServices from '../../service/GroupServices';
import {colors} from '../../constants/ColorConstant';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddedSubComments = ({
  getSubSubCommentsRefresh,
  myUserId,
  onDeleteClick,
  onDeleteClickSub,
  onEditClick,
  onEditClickSub,
  subCommentData,
}: {
  getSubSubCommentsRefresh: Function;
  myUserId: number;
  onDeleteClick: Function;
  onDeleteClickSub: Function;
  onEditClick: Function;
  onEditClickSub: Function;
  subCommentData: any;
}) => {
  const [allSubSubComments, setAllSubSubComments] = useState([]);
  const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"
  const [subCommentsModal, setSubCommentsModal] = useState(false);
  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [viewAllCommentsVisible, setViewAllCommentsVisible] = useState(false);
  const toastRef = useRef<any>();

  //To toggle the show text or hide it
  const toggleNumberOfLines = () => {
    setTextShown(!textShown);
  };

  useEffect(() => {
    getSubSubComments();
  }, [subCommentData]);

  // function for get all sub sub comments data on api call
  const getSubSubComments = async () => {
    const data = {
      commentid: subCommentData.id,
    };

    GroupServices.postAllSubCommentsOnComment(data)
      .then((response: any) => {
        setAllSubSubComments(response.data.allsubcomments);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const onTextLayout = useCallback((e: any) => {
    setLengthMore(e.nativeEvent.lines.length >= 2); //to check the text is more than 2 lines or not
  }, []);

  // function for close modal
  const handleAddSubCommentModalClose = () => {
    setSubCommentsModal(false);
  };

  // function for submit button click on api call to add comment
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
    feedBackData.append('comment_id', subCommentData.id);
    feedBackData.append('comment', subComment);
    if (userType == '2') {
      feedBackData.append('accountId', accountId);
    }

    GroupServices.postAddSubComment(feedBackData)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        getSubSubCommentsRefresh(); //for refresh the subComment section
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  // list for sub sub comments
  const renderAddedSubSubComments = ({item}: {item: any; index: any}) => {
    return (
      <AddedSubSubComments
        subCommentsData={item}
        onEditClickSub={onEditClickSub}
        onDeleteClickSub={onDeleteClickSub}
        myUserId={myUserId}
      />
    );
  };

  // list for comments images
  const renderAddedSubCommentsImages = ({item}: {item: any; index: any}) => {
    return <CommentImagesTab commentImages={item} />;
  };

  return (
    <View style={styles.container}>
      {/* profile image , user name and time section  */}
      <View style={styles.profileDirection}>
        <View style={styles.direction}>
          <View style={styles.profileImageContainer}>
            <Image
              source={
                subCommentData?.profileimage
                  ? {uri: `${subCommentData.profileimage}`}
                  : require('../../assets/pngImage/avatar.png')
              }
              resizeMode="contain"
              style={styles.image}
            />
          </View>
          <Text style={styles.userName}>{subCommentData?.username}</Text>
        </View>

        {/* display edit icon basis of customer id match  */}
        {myUserId == subCommentData?.commentuserid ? (
          <View style={styles.direction}>
            <TouchableOpacity
              style={styles.editContainer}
              onPress={() => {
                onEditClick(subCommentData);
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
                onDeleteClick(subCommentData);
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

      <Text style={styles.commentTime}>{subCommentData?.timedifference}</Text>

      {/* feedback sub comment image section */}
      {subCommentData?.commentimages?.length >= 0 ? (
        <FlatList
          data={subCommentData?.commentimages}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={renderAddedSubCommentsImages}
          keyExtractor={(item: any, index: any) => String(index)}
        />
      ) : null}

      {/*Sub comment section on basis of read more and read less */}
      <View style={styles.commentContainer}>
        {/* quotes image section  */}
        <View style={styles.backGroundImageContainer}>
          <Image
            style={styles.image}
            resizeMode="contain"
            source={require('../../assets/pngImage/Quotes.png')}
          />
        </View>

        <Text
          style={styles.userComments}
          onTextLayout={onTextLayout}
          numberOfLines={textShown ? undefined : 2}>
          {subCommentData?.comment}
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
      </View>

      {/* sub sub comments section with show and hide comments */}
      {allSubSubComments?.length >= 0 ? (
        <>
          <FlatList
            data={!viewAllCommentsVisible ? [] : allSubSubComments}
            renderItem={renderAddedSubSubComments}
            keyExtractor={(item: any, index: any) => String(index)}
          />
          {allSubSubComments?.length > 0 ? (
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

      {/* add new sub sub comment tab  */}
      <AddSubCommentModal
        commentDetails={subCommentData}
        visibleModal={subCommentsModal}
        onClose={handleAddSubCommentModalClose}
        onSubmitClick={handleAddCommentSubmitClick}
      />
      {/* toaster message for error response from API  */}
      <CommonToast ref={toastRef} />
    </View>
  );
};

export default AddedSubComments;

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    flex: 1,
    margin: 5,
    padding: 10,
  },
  direction: {
    flexDirection: 'row',
  },
  image: {
    borderRadius: 15,
    height: '100%',
    width: '100%',
  },
  backGroundImageContainer: {
    height: 80,
    opacity: 0.5,
    position: 'absolute',
    right: 50,
    width: 80,
  },
  commentContainer: {
    paddingHorizontal: 10,
  },
  profileImageContainer: {
    borderRadius: 50,
    height: 30,
    width: 30,
  },
  userName: {
    color: colors.WHITE,
    fontSize: 17,
    fontWeight: '700',
    paddingHorizontal: 5,
    paddingTop: 5,
    width: '78%',
  },
  commentTime: {
    color: colors.GRAY,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 3,
    marginLeft: 30,
  },
  userComments: {
    color: colors.THEME_WHITE,
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
    height: 25,
    marginRight: 5,
    marginVertical: 5,
    width: 70,
  },
  icon: {
    height: 18,
    width: 18,
  },
  replyText: {
    color: colors.THEME_ORANGE,
    fontSize: 15,
    fontWeight: '400',
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
  readMoreText: {
    color: colors.THEME_ORANGE,
    lineHeight: 21,
    width: '35%',
  },
  moreReplyContainer: {width: '40%'},
  moreReplyText: {
    color: colors.THEME_ORANGE,
    fontSize: 15,
    fontWeight: '500',
  },
});
