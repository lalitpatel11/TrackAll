// external imports
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageViewer from 'react-native-image-zoom-viewer';
import LinearGradient from 'react-native-linear-gradient';
import MapView, {Marker} from 'react-native-maps';
import React, {useEffect, useRef, useState} from 'react';
import {Modal} from 'react-native';
// internal imports
import CommonToast from '../../constants/CommonToast';
import CustomHeader from '../../constants/CustomHeader';
import DeleteAlertModal from '../groups/DeleteAlertModal';
import EventImages from './EventImages';
import EventService from '../../service/EventService';
import EventVideos from './EventVideos';
import InviteMemberOnEventModal from './InviteMemberOnEventModal';
import RecentlyAddedEventMembersTab from './RecentlyAddedEventMembersTab';
import {colors} from '../../constants/ColorConstant';
import {width} from '../notes/NotesAllComments';
import moment from 'moment';

const EventDetails = ({navigation, route}: {navigation: any; route: any}) => {
  const [buttonText, setButtonText] = useState('I');
  const [deleteModal, setDeleteModal] = useState(false);
  const [eventDetails, setEventDetails] = useState<any[]>([]);
  const [eventId, setEventId] = useState<number>(route?.params?.id);
  const [imageData, setImageData] = useState<any[]>([]);
  const [imageModal, setImageModal] = useState(false);
  const [memberIdModal, setMemberIdModal] = useState(false);
  const [myUserId, setMyUserId] = useState<any>();
  const [pageLoader, setPageLoader] = useState(false);
  const [selectedMembersId, setSelectedMembersId] = useState<number[]>([]);
  const toastRef = useRef<any>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setEventId(route?.params?.id);
      setPageLoader(true);
      getData();
    });
    return unsubscribe;
  }, [navigation]);

  // function for get all event data api call
  const getData = async () => {
    // user id for delete and edit icon
    const token = await AsyncStorage.getItem('userId');
    setMyUserId(token);
    EventService.getEventDetails(eventId)
      .then((response: any) => {
        setPageLoader(false);
        setEventDetails(response.data.eventdetails);
        if (response.data.eventdetails?.shareduser?.length > 0) {
          let user = response.data.eventdetails?.shareduser.map(
            (e: any) => e.id,
          );
          setSelectedMembersId(user);
        }

        // for image enlarge
        if (response.data.eventdetails?.image?.length > 0) {
          for (
            let index = 0;
            index < response.data.eventdetails?.image?.length;
            index++
          ) {
            const img = {
              url: response.data.eventdetails?.image[index]?.images,
            };
            imageData.push(img);
          }
        }
      })
      .catch(error => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // list for recently added members on event
  const renderAddedMembers = ({item}: {item: any; index: any}) => {
    return <RecentlyAddedEventMembersTab item={item} />;
  };

  // function for api call for member add click
  const handleMemberIdAddClick = (memberList: number[]) => {
    setMemberIdModal(false);

    const feedBackData = new FormData();
    feedBackData.append('eventid', eventId);
    memberList.map((e: number, index: any) => {
      feedBackData.append(`userid[${index}]`, e);
    });

    EventService.postShareEvent(feedBackData)
      .then((response: any) => {
        toastRef.current.getToast(response?.data?.message, 'success');
        getData();
      })
      .catch((error: any) => {
        console.log('error', error);
      });
  };

  // function for api call on delete click
  const handleDelete = () => {
    setDeleteModal(false);
    EventService.getDeleteEvent(eventId)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        navigation.replace('StackNavigation', {
          screen: 'EventManagement',
        });
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  // function for api call on like click
  const handleLike = () => {
    const data = {
      eventid: eventId,
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
      eventid: eventId,
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

  // list for event images
  const renderEventImagesItem = ({item}: {item: any; index: any}) => {
    return <EventImages eventImages={item} imageClick={handleImageClick} />;
  };

  // list for event videos
  const renderEventVideosItem = ({item}: {item: any; index: any}) => {
    return <EventVideos eventImages={item} imageClick={handleImageClick} />;
  };

  // function on image click for enlarge image preview
  const handleImageClick = () => {
    setImageModal(true);
  };

  // function on map click
  const handleOpenMap = () => {
    // routing only if lat and long is available
    if (eventDetails?.latitude && eventDetails?.longitude != null) {
      const scheme = Platform.select({
        ios: 'maps:0,0?q=',
        android: 'geo:0,0?q=',
      });
      const latLng = `${eventDetails?.latitude},${eventDetails?.longitude}`;
      const label = eventDetails?.addressName;
      const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`,
      });
      Linking.openURL(url);
    }
  };

  return (
    <View style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Event Details'}
        backButton={{
          visible: true,
          onClick: () => {
            navigation.goBack();
          },
        }}
      />
      {/* body section */}
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        {!pageLoader ? (
          <>
            {/* banner image section */}
            {eventDetails?.eventcoverphoto ? (
              <View style={styles.bannerImageContainer}>
                <Image
                  resizeMode="contain"
                  style={styles.bannerImage}
                  source={{uri: `${eventDetails?.eventcoverphoto}`}}
                />
              </View>
            ) : (
              <View style={styles.bannerImageContainer}>
                <Image
                  resizeMode="contain"
                  style={styles.bannerImage}
                  source={require('../../assets/pngImage/noBannerimage.png')}
                />
              </View>
            )}

            <View style={styles.body}>
              {/* name organized by and date time section */}
              <View style={styles.pageDetailsContainer}>
                <Text style={styles.eventName}>{eventDetails?.title}</Text>

                {/* edit delete icon basis of my user id */}
                <View style={styles.iconsContainer}>
                  {eventDetails?.created_by == myUserId ? (
                    <View style={styles.direction}>
                      {/* edit icon  */}
                      <TouchableOpacity
                        style={styles.editContainer}
                        onPress={() => {
                          navigation.navigate('StackNavigation', {
                            screen: 'EditEvent',
                            params: {
                              data: eventDetails,
                            },
                          });
                        }}>
                        <Image
                          resizeMode="contain"
                          style={{height: 15, width: 15, margin: 5}}
                          source={require('../../assets/pngImage/editIcon.png')}
                        />
                      </TouchableOpacity>

                      {/* delete icon  */}
                      <TouchableOpacity
                        style={styles.editContainer}
                        onPress={() => {
                          setDeleteModal(true);
                        }}>
                        <Image
                          resizeMode="contain"
                          style={{height: 15, width: 15, margin: 5}}
                          source={require('../../assets/pngImage/Trash.png')}
                        />
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>

                <View style={styles.direction}>
                  {/*profile image section */}
                  {eventDetails?.eventprofile ? (
                    <View style={styles.imageContainer}>
                      <Image
                        style={styles.image}
                        resizeMode="contain"
                        source={{uri: `${eventDetails?.eventprofile}`}}
                      />
                    </View>
                  ) : (
                    <View style={styles.noGroupImageContainer}>
                      <View style={styles.noGroupImage}>
                        <Image
                          resizeMode="contain"
                          style={styles.image}
                          source={require('../../assets/pngImage/noImage.png')}
                        />
                      </View>
                    </View>
                  )}

                  <Text style={styles.organizedByText}>Organized by:</Text>
                  <Text style={styles.organizedBy}>{eventDetails?.name}</Text>
                </View>

                {/* organized by section  */}
                <Text style={styles.organizedBy}>
                  {eventDetails?.eventtags}
                </Text>

                {/* date time section  */}
                <View style={styles.direction}>
                  <Image
                    resizeMode="contain"
                    tintColor={colors.WHITE}
                    style={{width: 18, height: 18, marginRight: 5}}
                    source={require('../../assets/pngImage/CalendarBlank.png')}
                  />
                  <Text style={styles.dateText}>
                    {moment(eventDetails?.date).format('MM-DD-YYYY')},{' '}
                    {eventDetails?.time}
                  </Text>
                </View>

                {/* location section */}
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.locationLabel}>Location:</Text>
                  <Text style={styles.organizedBy}>
                    {eventDetails?.addressName}, {eventDetails?.eventAddress}
                  </Text>
                </View>
              </View>

              {/* event info, photo, video and event creator button section */}
              <View style={styles.buttonDirection}>
                <TouchableOpacity
                  style={
                    buttonText == 'I'
                      ? styles.buttonContainer
                      : styles.disableButtonContainer
                  }
                  onPress={() => {
                    setButtonText('I');
                  }}>
                  <Text
                    style={
                      buttonText == 'I'
                        ? styles.buttonText
                        : styles.disableButtonText
                    }>
                    Event Info
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={
                    buttonText == 'P'
                      ? styles.buttonContainer
                      : styles.disableButtonContainer
                  }
                  onPress={() => {
                    setButtonText('P');
                  }}>
                  <Text
                    style={
                      buttonText == 'P'
                        ? styles.buttonText
                        : styles.disableButtonText
                    }>
                    Photo & Video
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={
                    buttonText == 'C'
                      ? styles.buttonContainer
                      : styles.disableButtonContainer
                  }
                  onPress={() => {
                    setButtonText('C');
                  }}>
                  <Text
                    style={
                      buttonText == 'C'
                        ? styles.buttonText
                        : styles.disableButtonText
                    }>
                    Organizer
                  </Text>
                </TouchableOpacity>
              </View>

              {/* event info, photo, video and event creator section */}
              <View style={styles.dataContainer}>
                {buttonText == 'I' ? (
                  <View>
                    <Text style={styles.descriptionText}>
                      {eventDetails?.description}
                    </Text>

                    <View style={styles.textDirection}>
                      <Text style={styles.labelText}>Event Members</Text>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('StackNavigation', {
                            screen: 'ViewAllInvitedEventMembers',
                            params: {
                              id: eventId,
                            },
                          });
                        }}>
                        <Text style={styles.viewAllText}>View All</Text>
                      </TouchableOpacity>
                    </View>

                    {/* all the invited members */}
                    {eventDetails?.shareduser?.length > 0 ? (
                      <View
                        style={{
                          height: 'auto',
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <FlatList
                          data={eventDetails?.shareduser}
                          renderItem={renderAddedMembers}
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          keyExtractor={(item: any, index: any) =>
                            String(index)
                          }
                        />
                        {/* add member icon  */}
                        <TouchableOpacity
                          onPress={() => {
                            setMemberIdModal(true);
                          }}>
                          <LinearGradient
                            colors={['#F28520', '#F5BD35']}
                            style={styles.addMemberIconContainer}>
                            <Image
                              style={styles.createIconImage}
                              resizeMode="contain"
                              source={require('../../assets/pngImage/Plus.png')}
                            />
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={styles.noMembersContainer}>
                        <Text style={styles.noMembersText}>
                          No Members Added
                        </Text>
                      </View>
                    )}

                    {/* location and map section */}
                    <View style={styles.textDirection}>
                      <Text style={styles.labelText}>About the events</Text>
                      <TouchableOpacity
                        onPress={() => {
                          handleOpenMap();
                        }}>
                        <Text style={styles.viewAllText}>Get Destination</Text>
                      </TouchableOpacity>
                    </View>
                    {Object.keys(eventDetails).length > 0 ? (
                      <MapView
                        zoomControlEnabled={true}
                        style={styles.mapImage}
                        showsUserLocation={true}
                        onPress={() => {
                          handleOpenMap();
                        }}
                        initialRegion={{
                          latitude: parseInt(eventDetails?.latitude, 10),
                          longitude: parseInt(eventDetails?.longitude, 10),
                          latitudeDelta: 0.5,
                          longitudeDelta: 0.5,
                        }}>
                        <Marker
                          draggable={false}
                          coordinate={{
                            latitude: parseInt(eventDetails?.latitude, 10),
                            longitude: parseInt(eventDetails?.longitude, 10),
                          }}
                          title={eventDetails?.eventAddress}
                        />
                      </MapView>
                    ) : null}
                  </View>
                ) : buttonText == 'P' ? (
                  <View style={{height: 'auto'}}>
                    {eventDetails?.image?.length > 0 ? (
                      <View style={{marginTop: 10}}>
                        <FlatList
                          data={eventDetails?.image}
                          numColumns={3}
                          renderItem={renderEventImagesItem}
                          keyExtractor={(item: any, index: any) =>
                            String(index)
                          }
                        />
                        <View style={{backgroundColor: 'red', height: 'auto'}}>
                          <FlatList
                            data={eventDetails?.video}
                            numColumns={3}
                            renderItem={renderEventVideosItem}
                            keyExtractor={(item: any, index: any) =>
                              String(index)
                            }
                          />
                        </View>
                      </View>
                    ) : (
                      <View style={styles.noDataContainer}>
                        <Text style={styles.noDataText}>No Photos Added.</Text>
                      </View>
                    )}
                  </View>
                ) : (
                  <View style={styles.creatorContainer}>
                    <View style={styles.direction}>
                      {/* image section */}
                      {eventDetails?.eventprofile ? (
                        <View style={styles.imageContainer}>
                          <Image
                            style={styles.image}
                            resizeMode="contain"
                            source={{uri: `${eventDetails?.eventprofile}`}}
                          />
                        </View>
                      ) : (
                        <View style={styles.noGroupImageContainer}>
                          <View style={styles.noGroupImage}>
                            <Image
                              resizeMode="contain"
                              style={styles.image}
                              source={require('../../assets/pngImage/noImage.png')}
                            />
                          </View>
                        </View>
                      )}

                      <Text style={styles.organizedBy}>
                        {eventDetails?.name}
                      </Text>
                    </View>
                    <Text style={styles.descriptionText}>
                      {eventDetails?.details}
                    </Text>

                    <View style={styles.direction}>
                      <View style={styles.emailImageContainer}>
                        <Image
                          resizeMode="contain"
                          style={styles.image}
                          source={require('../../assets/pngImage/EnvelopeSimple.png')}
                        />
                      </View>
                      <View>
                        <Text style={styles.disableButtonText}>Email ID</Text>
                        <Text style={styles.dateText}>
                          {eventDetails?.email}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.direction}>
                      <View style={styles.emailImageContainer}>
                        <Image
                          resizeMode="contain"
                          style={styles.image}
                          source={require('../../assets/pngImage/Phone.png')}
                        />
                      </View>
                      <View>
                        <Text style={styles.disableButtonText}>
                          Contact Number
                        </Text>
                        <Text style={styles.dateText}>
                          {eventDetails?.contactno}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </>
        ) : (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.THEME_ORANGE} />
          </View>
        )}
      </ScrollView>
      {buttonText == 'P' ? (
        <LinearGradient
          colors={['#F28520', '#F5BD35']}
          style={styles.createIconContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('StackNavigation', {
                screen: 'UploadImageOnEvent',
                params: {
                  id: eventId,
                  name: eventDetails?.title,
                },
              });
            }}>
            <Image
              style={styles.createIconImage}
              resizeMode="contain"
              tintColor={colors.WHITE}
              source={require('../../assets/pngImage/UploadMedia.png')}
            />
            <Text style={styles.uploadMediaText}>Upload</Text>
          </TouchableOpacity>
        </LinearGradient>
      ) : null}

      {/* bottom section for like comment and share  */}
      {!pageLoader ? (
        <View style={styles.bottomButtonDirection}>
          {eventDetails?.youlike === 'Not Liked' ? (
            <TouchableOpacity
              style={styles.direction}
              onPress={() => {
                handleLike();
              }}>
              <Image
                resizeMode="contain"
                tintColor={colors.WHITE}
                style={styles.icon}
                source={require('../../assets/pngImage/like.png')}
              />
              <Text style={styles.descriptionText}>Like</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.direction}
              onPress={() => {
                handleUnLike();
              }}>
              <Image
                resizeMode="contain"
                style={styles.icon}
                source={require('../../assets/pngImage/redLike.png')}
              />
              <Text style={styles.descriptionText}>Unlike</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.direction}
            onPress={() => {
              navigation.navigate('StackNavigation', {
                screen: 'EventAllComments',
                params: {
                  data: eventId,
                },
              });
            }}>
            <Image
              resizeMode="contain"
              tintColor={colors.WHITE}
              style={styles.icon}
              source={require('../../assets/pngImage/chat.png')}
            />
            <Text style={styles.descriptionText}>Comment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.direction}
            onPress={() => {
              setMemberIdModal(true);
            }}>
            <Image
              resizeMode="contain"
              tintColor={colors.WHITE}
              style={styles.icon}
              source={require('../../assets/pngImage/ShareIcon.png')}
            />
            <Text style={styles.descriptionText}>Share</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Member Email Id modal  */}
      <InviteMemberOnEventModal
        visibleModal={memberIdModal}
        onClose={() => {
          setMemberIdModal(false);
        }}
        onSubmitClick={handleMemberIdAddClick}
        selectedMembersId={selectedMembersId}
      />

      {/* Delete alert modal for delete event */}
      <DeleteAlertModal
        visibleModal={deleteModal}
        onRequestClosed={() => {
          setDeleteModal(false);
        }}
        onPressRightButton={() => {
          handleDelete();
        }}
        subHeading={'Are you sure you want to delete this event ?'}
      />

      {/* image enlarge modal */}
      <Modal
        visible={imageModal}
        transparent={true}
        onRequestClose={() => {
          setImageModal(false);
        }}>
        <View style={styles.centeredView}>
          {/* cross button section  */}
          <TouchableOpacity
            style={styles.crossContainer}
            onPress={() => {
              setImageModal(false);
            }}>
            <Image
              style={styles.image}
              resizeMode="contain"
              source={require('../../assets/pngImage/cross.png')}
            />
          </TouchableOpacity>
          <ImageViewer imageUrls={imageData} />
        </View>
      </Modal>

      {/* toaster message for error response from API  */}
      <CommonToast ref={toastRef} />
    </View>
  );
};

export default EventDetails;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {
    backgroundColor: colors.BLACK,
    padding: 10,
  },
  bannerImageContainer: {
    height: 220,
    marginTop: 10,
    width: width,
  },
  bannerImage: {
    height: '100%',
    width: '100%',
  },
  direction: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 5,
  },
  imageContainer: {
    borderRadius: 50,
    height: 25,
    width: 25,
  },
  image: {
    borderRadius: 50,
    height: '100%',
    width: '100%',
  },
  iconsContainer: {
    backgroundColor: colors.BLACK,
    height: 30,
    position: 'absolute',
    right: 0,
    width: '20%',
    zIndex: 1,
  },
  editContainer: {
    alignItems: 'center',
    backgroundColor: colors.BLACK3,
    borderRadius: 50,
    justifyContent: 'center',
    marginHorizontal: 3,
    padding: 3,
  },
  noGroupImageContainer: {
    alignItems: 'center',
    backgroundColor: colors.THEME_WHITE,
    borderColor: colors.BLACK3,
    borderRadius: 50,
    borderWidth: 3,
    height: 25,
    justifyContent: 'center',
    width: 25,
  },
  noGroupImage: {
    height: 20,
    width: 20,
  },
  pageDetailsContainer: {
    paddingHorizontal: 5,
  },
  eventName: {
    color: colors.WHITE,
    fontSize: 20,
    fontWeight: '400',
    width: '80%',
  },
  organizedByText: {
    color: colors.GRAY,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 10,
    paddingBottom: 3,
  },
  locationLabel: {
    color: colors.WHITE,
    fontSize: 14,
    paddingBottom: 3,
  },
  organizedBy: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
    fontWeight: '500',
    paddingBottom: 3,
    paddingLeft: 5,
    width: '86%',
  },
  dateText: {
    color: colors.THEME_WHITE,
    fontSize: 14,
    fontWeight: '400',
  },
  buttonDirection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  buttonContainer: {
    alignItems: 'center',
    backgroundColor: colors.BLACK3,
    borderRadius: 50,
    elevation: 5,
    height: 40,
    justifyContent: 'center',
    width: 120,
  },
  buttonText: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  disableButtonContainer: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 120,
  },
  disableButtonText: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '500',
  },
  dataContainer: {
    height: 'auto',
    paddingBottom: 40,
  },
  descriptionText: {
    color: colors.WHITE,
    fontSize: 13,
    fontWeight: '400',
    paddingVertical: 10,
    textAlign: 'justify',
  },
  noDataContainer: {
    alignItems: 'center',
    height: '60%',
    justifyContent: 'center',
  },
  noDataText: {
    color: colors.WHITE,
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
  creatorContainer: {
    borderColor: colors.brightGray,
    borderRadius: 15,
    borderWidth: 1,
    height: 'auto',
    marginVertical: 5,
    padding: 10,
  },
  emailImageContainer: {
    borderRadius: 50,
    height: 35,
    marginRight: 10,
    width: 35,
  },
  textDirection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  labelText: {
    color: colors.WHITE,
    fontSize: 17,
    fontWeight: '500',
  },
  noMembersContainer: {
    alignContent: 'center',
    alignItems: 'center',
    height: '16%',
    justifyContent: 'center',
  },
  noMembersText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
    padding: 20,
  },
  viewAllText: {
    color: colors.THEME_ORANGE,
    fontSize: 16,
  },
  mapImage: {
    borderRadius: 20,
    height: 160,
    marginTop: 12,
    width: '100%',
  },
  bottomButtonDirection: {
    alignSelf: 'center',
    backgroundColor: colors.BLACK3,
    borderRadius: 50,
    bottom: 0,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 10,
    position: 'absolute',
    width: '90%',
    zIndex: 1,
  },
  createIconContainer: {
    alignItems: 'center',
    backgroundColor: colors.WHITE,
    borderColor: colors.WHITE,
    borderRadius: 10,
    borderStyle: 'dotted',
    borderWidth: 2,
    bottom: 80,
    height: 60,
    justifyContent: 'center',
    paddingVertical: 10,
    position: 'absolute',
    right: 25,
    width: 60,
    zIndex: 1,
  },
  createIconImage: {
    borderRadius: 100,
    height: 25,
    paddingHorizontal: 15,
    width: 25,
  },
  addMemberIconContainer: {
    alignItems: 'center',
    backgroundColor: colors.WHITE,
    borderRadius: 10,
    height: 60,
    justifyContent: 'center',
    padding: 20,
    width: 60,
  },
  uploadMediaText: {
    color: colors.WHITE,
    fontSize: 10,
    fontWeight: '500',
  },
  loaderContainer: {
    alignSelf: 'center',
    height: '83%',
    justifyContent: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  centeredView: {
    backgroundColor: 'rgba(0, 0, 0, 0.66)',
    flex: 1,
    justifyContent: 'center',
    marginTop: '10%',
  },
  crossContainer: {
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 50,
    height: 30,
    position: 'absolute',
    right: 30,
    top: 30,
    width: 30,
    zIndex: 1,
  },
  icon: {
    height: 15,
    marginHorizontal: 5,
    width: 15,
  },
});
