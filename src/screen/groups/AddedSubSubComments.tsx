// external imports
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// internal imports
import CommentImagesTab from './CommentImagesTab';
import React, {useCallback, useEffect, useState} from 'react';
import moment from 'moment';
import {colors} from '../../constants/ColorConstant';

const AddedSubSubComments = ({
  myUserId,
  onDeleteClickSub,
  onEditClickSub,
  subCommentsData,
}: {
  myUserId: number;
  onDeleteClickSub: Function;
  onEditClickSub: Function;
  subCommentsData: any;
}) => {
  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"

  useEffect(() => {}, [subCommentsData]);

  //To toggle the show text or hide it
  const toggleNumberOfLines = () => {
    setTextShown(!textShown);
  };

  const onTextLayout = useCallback((e: any) => {
    setLengthMore(e.nativeEvent.lines.length >= 2); //to check the text is more than 2 lines or not
  }, []);

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
                subCommentsData?.profileimage
                  ? {uri: `${subCommentsData.profileimage}`}
                  : require('../../assets/pngImage/avatar.png')
              }
              resizeMode="contain"
              style={styles.image}
            />
          </View>
          <Text style={styles.userName}>{subCommentsData?.username}</Text>
        </View>

        {/* display edit icon basis of customer id match  */}
        {myUserId == subCommentsData?.commentuserid ? (
          <View style={styles.direction}>
            <TouchableOpacity
              style={styles.editContainer}
              onPress={() => {
                onEditClickSub(subCommentsData);
              }}>
              <Image
                style={styles.icon}
                resizeMode="contain"
                source={require('../../assets/pngImage/editIcon.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editContainer}
              onPress={() => {
                onDeleteClickSub(subCommentsData);
              }}>
              <Image
                style={styles.icon}
                resizeMode="contain"
                source={require('../../assets/pngImage/Trash.png')}
              />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      <Text style={styles.commentTime}>{subCommentsData?.timedifference}</Text>

      {/* feedback sub comment image section */}
      {subCommentsData?.commentimages?.length >= 0 ? (
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={subCommentsData?.commentimages}
          listKey={'fourth'}
          renderItem={renderAddedSubCommentsImages}
          keyExtractor={(item: any, index: any) => String(index)}
        />
      ) : null}

      {/* Sub sub comment section on basis of read more and read less */}
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
          {subCommentsData?.comment}
        </Text>
        {lengthMore ? (
          <Text onPress={toggleNumberOfLines} style={styles.readMoreText}>
            {textShown ? 'View less...' : 'View more...'}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

export default AddedSubSubComments;

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
    width: '80%',
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
    lineHeight: 21,
    color: colors.THEME_ORANGE,
  },
});
