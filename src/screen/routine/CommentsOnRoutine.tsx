//external imports
import React, {useCallback, useState} from 'react';
import moment from 'moment';
import {View, Image, Text, StyleSheet, FlatList} from 'react-native';
//internal imports
import CommentImagesTab from '../groups/CommentImagesTab';
import {colors} from '../../constants/ColorConstant';

const CommentsOnRoutine = ({
  data,
  routineId,
  viewCommentsClick,
}: {
  data: any;
  routineId: number;
  viewCommentsClick: Function;
}) => {
  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"

  // convert time from moment
  const commentTime = moment(data?.created_date).startOf('second').fromNow();

  //To toggle the show text or hide it
  const toggleNumberOfLines = () => {
    setTextShown(!textShown);
  };

  const onTextLayout = useCallback((e: any) => {
    setLengthMore(e.nativeEvent.lines.length >= 2); //to check the text is more than 2 lines or not
  }, []);

  // list for comment image
  const renderAddedSubCommentsImages = ({item}: {item: any; index: any}) => {
    return <CommentImagesTab commentImages={item} />;
  };

  return (
    <View style={styles.container}>
      {/* profile image , user name and time section  */}
      <View style={styles.direction}>
        <View style={styles.profileImageContainer}>
          <Image
            source={
              data?.commentuserprofile
                ? {uri: `${data?.commentuserprofile}`}
                : require('../../assets/pngImage/avatar.png')
            }
            resizeMode="contain"
            style={styles.image}
          />
        </View>
        <Text style={styles.userName}>{data?.commentusername}</Text>
        <Text style={styles.commentTime}>{commentTime}</Text>
      </View>

      {/* feedback comment image section */}
      {data?.commentimages?.length >= 0 ? (
        <FlatList
          data={data?.commentimages}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={renderAddedSubCommentsImages}
          keyExtractor={(item: any, index: any) => String(index)}
        />
      ) : null}

      {/* comment section on basis of read more and read less */}
      <View style={styles.commentContainer}>
        <Text
          style={styles.commentText}
          onTextLayout={onTextLayout}
          numberOfLines={textShown ? undefined : 2}>
          {data?.comment}
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

export default CommentsOnRoutine;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  direction: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
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
    fontWeight: '500',
    padding: 5,
    width: '54%',
  },
  commentTime: {
    color: colors.GRAY,
    fontSize: 15,
    fontWeight: '500',
    paddingVertical: 5,
  },
  commentContainer: {
    paddingHorizontal: 5,
  },
  commentText: {
    color: colors.WHITE,
    fontSize: 14,
  },
  readMoreText: {
    color: colors.THEME_ORANGE,
    lineHeight: 21,
    width: '50%',
  },
});
