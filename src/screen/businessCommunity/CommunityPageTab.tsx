//external imports
import React, {useCallback, useState} from 'react';
import {View, Image, Text, StyleSheet, TouchableOpacity} from 'react-native';
//internal imports
import {colors} from '../../constants/ColorConstant';
import moment from 'moment';

const CommunityPageTab = ({
  handleView,
  items,
}: {
  handleView: any;
  items: any;
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
        handleView(items?.id);
      }}>
      {items?.postCount > 0 ? (
        <Text style={styles.notificationText}>{items?.postCount}</Text>
      ) : null}

      <View style={styles.direction}>
        {/* image section */}
        {items?.communityimage ? (
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={{uri: `${items?.communityimage}`}}
            />
          </View>
        ) : (
          <View style={styles.noGroupImageContainer}>
            <View style={styles.noGroupImage}>
              <Image
                style={styles.image}
                source={require('../../assets/pngImage/noImage.png')}
              />
            </View>
          </View>
        )}

        {/* details section */}
        <View style={styles.detailsContainer}>
          <Text style={styles.communityTitle}>{items?.name}</Text>
          <View style={styles.direction}>
            <Text style={styles.placeText}>{items?.place}</Text>
            <Text style={styles.followerText}>
              {items?.totalfollow} Followers
            </Text>
          </View>

          {/* date section */}
          <View style={styles.direction}>
            <Image
              style={{height: 15, width: 15}}
              tintColor={colors.THEME_WHITE}
              source={require('../../assets/pngImage/CalendarBlank.png')}
            />
            <Text style={styles.dateTimeText}>
              {moment(items?.created_at).format('MM-DD-YYYY')}
            </Text>
          </View>
        </View>
      </View>

      {/* description section */}
      <View style={styles.descriptionContainer}>
        <Text
          style={styles.descriptionText}
          onTextLayout={onTextLayout}
          numberOfLines={textShown ? undefined : 2}>
          {items?.description}
        </Text>
        {lengthMore ? (
          <Text onPress={toggleNumberOfLines} style={styles.readMoreText}>
            {textShown ? 'View less...' : 'View more...'}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export default CommunityPageTab;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK3,
    borderRadius: 15,
    flex: 1,
    height: 'auto',
    marginVertical: 5,
    padding: 10,
  },
  direction: {
    flexDirection: 'row',
  },
  imageContainer: {
    borderRadius: 50,
    height: 60,
    width: 60,
  },
  image: {
    borderRadius: 50,
    height: '100%',
    width: '100%',
  },
  noGroupImageContainer: {
    alignItems: 'center',
    backgroundColor: colors.GRAY,
    borderColor: colors.WHITE,
    borderRadius: 50,
    borderWidth: 3,
    height: 60,
    justifyContent: 'center',
    width: 60,
  },
  noGroupImage: {
    height: 40,
    width: 35,
  },
  detailsContainer: {
    paddingHorizontal: 10,
    width: '90%',
  },
  communityTitle: {
    color: colors.WHITE,
    fontSize: 16,
    width: '100%',
  },
  placeText: {
    color: colors.THEME_ORANGE,
    fontSize: 16,
    paddingVertical: 5,
  },
  followerText: {
    color: colors.WHITE,
    fontSize: 13,
    paddingVertical: 5,
  },
  dateTimeText: {
    color: colors.THEME_WHITE,
    fontSize: 13,
    paddingHorizontal: 5,
  },
  descriptionContainer: {
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  descriptionText: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '400',
  },
  readMoreText: {
    color: colors.THEME_ORANGE,
    fontWeight: '500',
    lineHeight: 21,
    width: '35%',
  },
  notificationText: {
    backgroundColor: colors.RED,
    borderRadius: 50,
    color: colors.WHITE,
    fontSize: 12,
    fontWeight: '500',
    height: 25,
    justifyContent: 'center',
    padding: 3,
    position: 'absolute',
    right: 5,
    textAlign: 'center',
    top: 0,
    width: 25,
    zIndex: 1,
  },
});
