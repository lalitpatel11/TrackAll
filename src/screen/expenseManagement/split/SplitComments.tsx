//external imports
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import moment from 'moment';
//internal imports
import CommonToast from '../../../constants/CommonToast';
import ExpansesImage from '../ExpansesImage';
import {colors} from '../../../constants/ColorConstant';

const SplitComments = ({
  handleDeleteComment,
  handleEditComment,
  items,
}: {
  handleDeleteComment: any;
  handleEditComment: any;
  items: any;
}) => {
  const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"
  const [myUserId, setMyUserId] = useState<any>();
  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const toastRef = useRef<any>();

  // convert time from moment
  const commentTime = moment(items?.created_date).startOf('second').fromNow();

  useEffect(() => {
    getData();
  }, []);

  // list for added images on split
  const renderAddedSubCommentsImages = ({item}: {item: any; index: any}) => {
    return <ExpansesImage expenseImage={item} />;
  };

  // function for get user id from local storage
  const getData = async () => {
    // user id for delete and edit icon
    const token = await AsyncStorage.getItem('userId');
    setMyUserId(token);
  };

  //To toggle the show text or hide it
  const toggleNumberOfLines = () => {
    setTextShown(!textShown);
  };

  const onTextLayout = useCallback((e: any) => {
    setLengthMore(e.nativeEvent.lines.length >= 2); //to check the text is more than 2 lines or not
  }, []);

  return (
    <View style={styles.container}>
      {/* profile image , user name and time section  */}
      <View style={styles.profileDirection}>
        <View style={styles.direction}>
          <View style={styles.profileImageContainer}>
            <Image
              source={
                items?.userprofile
                  ? {uri: `${items.userprofile}`}
                  : require('../../../assets/pngImage/avatar.png')
              }
              resizeMode="contain"
              style={styles.image}
            />
          </View>
          <Text style={styles.userName}>{items?.username}</Text>
        </View>

        {/* display edit, delete icon basis of customer id match  */}
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
                source={require('../../../assets/pngImage/editIcon.png')}
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
                source={require('../../../assets/pngImage/Trash.png')}
              />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      <Text style={styles.commentTime}>{commentTime}</Text>

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
            source={require('../../../assets/pngImage/Quotes.png')}
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
      </View>

      {/* toaster message for error response from API  */}
      <CommonToast ref={toastRef} />
    </View>
  );
};

export default SplitComments;

const styles = StyleSheet.create({
  container: {
    borderRadius: 25,
    flex: 1,
    margin: 10,
    padding: 15,
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
    width: '77%',
  },
  commentTime: {
    color: colors.textGray,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 3,
    marginLeft: 25,
    paddingHorizontal: 5,
  },
  userComments: {
    color: colors.WHITE,
    textAlign: 'justify',
  },
  icon: {
    height: 18,
    width: 18,
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
  readMoreText: {
    color: colors.THEME_ORANGE,
    lineHeight: 21,
    width: '35%',
  },
});
