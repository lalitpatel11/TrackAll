// external imports
import React, {useRef, useState} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
// internal imports
import CommonToast from '../../constants/CommonToast';
import EventService from '../../service/EventService';
import InviteMemberOnEventModal from './InviteMemberOnEventModal';
import {colors} from '../../constants/ColorConstant';

const EventTab = ({
  getData,
  handleView,
  item,
  navigation,
  onLikeClick,
  onUnLikeClick,
}: {
  getData: Function;
  handleView: Function;
  item: any;
  navigation: any;
  onLikeClick: Function;
  onUnLikeClick: Function;
}) => {
  const [memberIdModal, setMemberIdModal] = useState(false);
  const toastRef = useRef<any>();

  // function for api call on like click
  const handleLike = () => {
    const data = {
      eventid: item?.id,
      status: 1,
    };
    EventService.postLikeUnlikeEvent(data)
      .then((response: any) => {
        getData();
      })
      .catch(error => {
        console.log(error);
      });
  };

  // function for api call on unlike click
  const handleUnLike = () => {
    const data = {
      eventid: item?.id,
      status: 0,
    };
    EventService.postLikeUnlikeEvent(data)
      .then((response: any) => {
        getData();
      })
      .catch(error => {
        console.log(error);
      });
  };

  // function for add member click api call
  const handleMemberIdAddClick = (memberList: number[]) => {
    setMemberIdModal(false);

    const feedBackData = new FormData();
    feedBackData.append('eventid', item?.id);
    memberList.map((e: number, index: any) => {
      feedBackData.append(`userid[${index}]`, e);
    });

    EventService.postShareEvent(feedBackData)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        getData();
      })
      .catch((error: any) => {
        console.log('error', error);
      });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        handleView(item?.id);
      }}>
      {item?.eventnotificationcount > 0 ? (
        <Text style={styles.notificationText}>
          {item?.eventnotificationcount}
        </Text>
      ) : null}

      {/* event profile image and creator image section */}
      <View style={styles.direction}>
        {item?.eventprofile ? (
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              resizeMode="cover"
              source={{uri: `${item?.eventprofile}`}}
            />
          </View>
        ) : (
          <View style={styles.noGroupImageContainer}>
            <View style={styles.noGroupImage}>
              <Image
                resizeMode="cover"
                style={styles.image}
                source={require('../../assets/pngImage/noImage.png')}
              />
            </View>
          </View>
        )}
        <Text style={styles.userName}>{item?.name}</Text>
      </View>

      {/* banner image section */}
      {item?.eventcoverphoto ? (
        <View style={styles.bannerImageContainer}>
          <Image
            resizeMode="cover"
            style={styles.bannerImage}
            source={{uri: `${item?.eventcoverphoto}`}}
          />

          <View style={styles.likeContainer}>
            <Image
              resizeMode="contain"
              tintColor={colors.WHITE}
              style={styles.icon}
              source={require('../../assets/pngImage/redLike.png')}
            />
            <Text style={styles.likeCount}>{item?.totalLikedCount} Likes</Text>
          </View>
        </View>
      ) : (
        <View style={styles.bannerImageContainer}>
          <Image
            resizeMode="cover"
            style={styles.bannerImage}
            source={require('../../assets/pngImage/noBannerimage.png')}
          />
          <View style={styles.likeContainer}>
            <Image
              resizeMode="contain"
              tintColor={colors.WHITE}
              style={styles.icon}
              source={require('../../assets/pngImage/redLike.png')}
            />
            <Text style={styles.likeCount}>{item?.totalLikedCount} Likes</Text>
          </View>
        </View>
      )}

      {/* icons section for like, comment and share  */}
      <View style={styles.IconsDirection}>
        {item?.youlike === 'Not Liked' ? (
          <TouchableOpacity
            style={styles.direction}
            onPress={() => {
              handleLike();
            }}>
            <Image
              resizeMode="contain"
              tintColor={colors.WHITE}
              style={styles.icons}
              source={require('../../assets/pngImage/like.png')}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.direction}
            onPress={() => {
              handleUnLike();
            }}>
            <Image
              resizeMode="contain"
              style={styles.icons}
              source={require('../../assets/pngImage/redLike.png')}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.direction}
          onPress={() => {
            navigation.navigate('StackNavigation', {
              screen: 'EventAllComments',
              params: {
                data: item?.id,
              },
            });
          }}>
          <Image
            resizeMode="contain"
            tintColor={colors.WHITE}
            style={styles.icons}
            source={require('../../assets/pngImage/chat.png')}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.direction}
          onPress={() => {
            setMemberIdModal(true);
          }}>
          <Image
            resizeMode="contain"
            tintColor={colors.WHITE}
            style={styles.icons}
            source={require('../../assets/pngImage/ShareIcon.png')}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.followDirection}>
        {/* name and date time section */}
        <View style={styles.amountContainer}>
          <Text numberOfLines={1} style={styles.pageName}>
            {item?.title}
          </Text>
          <Text style={styles.eventType}>{item?.eventtype}</Text>
          <View style={styles.direction}>
            <Image
              resizeMode="contain"
              style={{width: 20, height: 20}}
              source={require('../../assets/pngImage/CalendarBlank.png')}
            />
            <Text style={styles.dateText}>{item?.created_at}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.locationLabel}>Location : </Text>
            <Text style={styles.eventType}>
              {item?.addressName}, {item?.eventAddress}
            </Text>
          </View>
        </View>
      </View>

      {/* Member Email Id modal  */}
      <InviteMemberOnEventModal
        visibleModal={memberIdModal}
        onClose={() => {
          setMemberIdModal(false);
        }}
        onSubmitClick={handleMemberIdAddClick}
      />

      {/* toaster message for error response from API  */}
      <CommonToast ref={toastRef} />
    </TouchableOpacity>
  );
};

export default EventTab;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK3,
    borderRadius: 15,
    height: 'auto',
    marginVertical: 10,
    paddingBottom: 10,
  },
  likeImageContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.WHITE,
    borderColor: colors.brightGray,
    borderRadius: 50,
    borderWidth: 1,
    height: 35,
    justifyContent: 'center',
    padding: 5,
    position: 'absolute',
    right: 10,
    top: 10,
    width: 35,
    zIndex: 1,
  },
  bannerImageContainer: {
    height: 190,
    width: 380,
  },
  bannerImage: {
    height: '100%',
    width: '100%',
  },
  IconsDirection: {
    backgroundColor: colors.BLACK3,
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 10,
    width: '30%',
  },
  direction: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  imageContainer: {
    borderRadius: 50,
    height: 50,
    margin: 8,
    width: 50,
  },
  image: {
    borderRadius: 50,
    height: '100%',
    width: '100%',
  },
  noGroupImageContainer: {
    alignItems: 'center',
    backgroundColor: colors.BLACK3,
    borderColor: colors.THEME_WHITE,
    borderRadius: 50,
    borderWidth: 2,
    height: 50,
    justifyContent: 'center',
    margin: 5,
    width: 50,
  },
  noGroupImage: {
    height: 40,
    width: 35,
  },
  followDirection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    width: '90%',
  },
  amountContainer: {
    paddingHorizontal: 5,
  },
  userName: {
    color: colors.WHITE,
    fontSize: 14,
    width: '60%',
  },
  pageName: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '500',
    width: '90%',
  },
  likeContainer: {
    alignItems: 'center',
    backfaceVisibility: 'visible',
    backgroundColor: 'rgba(0, 0, 0, 0.50)',
    bottom: 0,
    flexDirection: 'row',
    height: 35,
    paddingHorizontal: 10,
    position: 'absolute',
    width: '100%',
    zIndex: 1,
  },
  likeCount: {
    color: colors.WHITE,
    fontSize: 12,
  },
  locationLabel: {
    color: colors.WHITE,
    fontSize: 15,
    paddingBottom: 3,
  },
  eventType: {
    color: colors.THEME_ORANGE,
    fontSize: 15,
    paddingBottom: 3,
    paddingRight: 5,
    width: '85%',
  },
  dateText: {
    color: colors.textGray,
    fontSize: 14,
    fontWeight: '400',
    paddingHorizontal: 5,
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
    right: 0,
    textAlign: 'center',
    top: -15,
    width: 25,
    zIndex: 2,
  },
  icon: {
    height: 12,
    marginHorizontal: 5,
    width: 12,
  },
  icons: {
    height: 25,
    marginHorizontal: 5,
    width: 25,
  },
});
