//external imports
import React, {useCallback, useState} from 'react';
import {View, Image, Text, TouchableOpacity, StyleSheet} from 'react-native';
//internal imports
import {colors} from '../../constants/ColorConstant';

const AddedComments = ({
  data,
  taskId,
  taskType,
  viewTaskClick,
}: {
  data: any;
  taskId: number;
  taskType: string;
  viewTaskClick: Function;
}) => {
  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"

  //To toggle the show text or hide it
  const toggleNumberOfLines = () => {
    setTextShown(!textShown);
  };

  const onTextLayout = useCallback((e: any) => {
    setLengthMore(e.nativeEvent.lines.length >= 2); //to check the text is more than 2 lines or not
  }, []);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        viewTaskClick(taskId, taskType);
      }}>
      {data?.commentimages ? (
        <View style={styles.direction}>
          {/* feedback image section */}
          <View style={styles.feedbackImageContainer}>
            <Image
              style={styles.image}
              resizeMode="contain"
              source={{uri: `${data.commentimages[0]}`}}
            />
          </View>

          {/* comments background image section */}
          <View style={styles.backGroundImageContainer}>
            <Image
              style={styles.image}
              resizeMode="contain"
              source={require('../../assets/pngImage/Quotes.png')}
            />
          </View>

          {/* user profile pic and name */}
          <View style={styles.profileContainer}>
            <Image
              style={styles.userProfile}
              resizeMode="contain"
              source={
                data?.userprofile
                  ? {
                      uri: `${data.userprofile}`,
                    }
                  : require('../../assets/pngImage/avatar.png')
              }
            />
            <Text style={styles.userName}>{data?.username}</Text>
          </View>

          {/* comment section on basis of read more and read less */}
          <View style={styles.commentContainerWithImage}>
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
      ) : (
        <View>
          {/* comments background image section */}
          <View style={styles.backGroundImageContainer}>
            <Image
              style={styles.image}
              resizeMode="contain"
              source={require('../../assets/pngImage/Quotes.png')}
            />
          </View>

          {/* user profile pic and name */}
          <View style={styles.profileContainer}>
            <Image
              style={styles.userProfile}
              resizeMode="contain"
              source={
                data?.userprofile
                  ? {
                      uri: `${data.userprofile}`,
                    }
                  : require('../../assets/pngImage/avatar.png')
              }
            />
            <Text style={styles.userName}>{data?.username}</Text>
          </View>

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
      )}
    </TouchableOpacity>
  );
};

export default AddedComments;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK3,
    borderColor: colors.GRAY,
    borderRadius: 15,
    borderWidth: 1,
    flex: 1,
    marginRight: 8,
    padding: 10,
  },
  direction: {
    flexDirection: 'row',
  },
  profileContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
  },
  feedbackImageContainer: {
    borderRadius: 15,
    height: 100,
    width: 130,
  },
  image: {
    borderRadius: 15,
    height: '100%',
    width: '100%',
  },
  backGroundImageContainer: {
    borderRadius: 15,
    height: 100,
    opacity: 0.5,
    position: 'absolute',
    right: 15,
    width: 100,
  },
  commentContainerWithImage: {
    paddingHorizontal: 10,
    width: '58%',
  },
  commentContainer: {
    paddingHorizontal: 10,
    width: 300,
  },
  commentText: {
    color: colors.WHITE,
    fontSize: 14,
  },
  userName: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 5,
  },
  userProfile: {
    borderRadius: 50,
    height: 30,
    width: 30,
  },
  readMoreText: {
    color: colors.THEME_ORANGE,
    lineHeight: 21,
    width: '50%',
  },
});
