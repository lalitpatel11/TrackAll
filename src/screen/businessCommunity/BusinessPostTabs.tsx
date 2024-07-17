//external imports
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import moment from 'moment';
//internal imports
import BusinessPostBannerImage from './BusinessPostBannerImage';
import {colors} from '../../constants/ColorConstant';

const BusinessPostTabs = ({
  handlePostDelete,
  handlePostEdit,
  items,
  myUserId,
  pageDetails,
}: {
  handlePostDelete: Function;
  handlePostEdit: Function;
  items: any;
  myUserId: any;
  pageDetails: any;
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

  // list for all images on business post
  const renderPostImagesItem = ({item}: {item: any; index: any}) => {
    return <BusinessPostBannerImage postImage={item} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.direction}>
        {/* image section */}
        {items?.profile_image ? (
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              resizeMode="contain"
              source={{uri: `${items?.profile_image}`}}
            />
          </View>
        ) : (
          <View style={styles.noGroupImageContainer}>
            <View style={styles.noGroupImage}>
              <Image
                resizeMode="contain"
                style={styles.image}
                source={require('../../assets/pngImage/avatar.png')}
              />
            </View>
          </View>
        )}

        <View style={styles.followDirection}>
          {/* name and date time section */}
          <View style={styles.amountContainer}>
            <Text style={styles.pageName}>{items?.profile_username}</Text>
            <View style={styles.direction}>
              <Text style={styles.dateText}>
                {moment(items?.created_at).format('MM-DD-YYYY')}
              </Text>
            </View>
          </View>
        </View>

        {/* edit delete icon basis of my user id */}
        <View style={styles.iconsContainer}>
          {items?.created_by == myUserId ? (
            <View style={styles.direction}>
              {/* edit icon  */}
              <TouchableOpacity
                style={styles.editContainer}
                onPress={() => {
                  handlePostEdit(items);
                }}>
                <Image
                  resizeMode="contain"
                  style={{height: 18, width: 18}}
                  source={require('../../assets/pngImage/editIcon.png')}
                />
              </TouchableOpacity>

              {/* delete icon  */}
              <TouchableOpacity
                style={styles.editContainer}
                onPress={() => {
                  handlePostDelete(items?.id);
                }}>
                <Image
                  resizeMode="contain"
                  style={{height: 18, width: 18}}
                  source={require('../../assets/pngImage/Trash.png')}
                />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </View>

      {/* banner image section */}
      {items?.images ? (
        <View style={{marginVertical: 15}}>
          <FlatList
            data={items?.images}
            renderItem={renderPostImagesItem}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item: any, index: any) => String(index)}
          />
        </View>
      ) : null}

      {/* description section */}
      <View>
        <Text
          style={styles.descriptionText}
          onTextLayout={onTextLayout}
          numberOfLines={textShown ? undefined : 2}>
          {items?.post_description}
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

export default BusinessPostTabs;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK3,
    borderRadius: 15,
    height: 'auto',
    marginVertical: 5,
    padding: 5,
  },
  direction: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  imageContainer: {
    borderColor: colors.textGray,
    borderRadius: 100,
    borderWidth: 1,
    height: 45,
    width: 45,
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
    height: 45,
    justifyContent: 'center',
    width: 45,
  },
  noGroupImage: {
    height: 40,
    width: 35,
  },
  followDirection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '65%',
  },
  amountContainer: {
    paddingHorizontal: 15,
  },
  pageName: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '500',
    width: 210,
  },
  dateText: {
    color: colors.WHITE,
    fontSize: 12,
    fontWeight: '400',
    paddingVertical: 5,
  },
  descriptionText: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '400',
    paddingBottom: 10,
    paddingHorizontal: 5,
    marginTop: 10,
  },
  readMoreText: {
    color: colors.THEME_ORANGE,
    fontWeight: '500',
    lineHeight: 21,
    width: '35%',
  },
  iconsContainer: {
    height: 30,
    width: '20%',
  },
  editContainer: {
    alignItems: 'center',
    borderRadius: 50,
    justifyContent: 'center',
    marginHorizontal: 3,
    padding: 3,
  },
});
