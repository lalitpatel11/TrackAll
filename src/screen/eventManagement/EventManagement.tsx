// external imports
import {
  ActivityIndicator,
  FlatList,
  Image,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import LinearGradient from 'react-native-linear-gradient';
import React, {useEffect, useRef, useState} from 'react';
// internal imports
import CommonToast from '../../constants/CommonToast';
import CustomHeader from '../../constants/CustomHeader';
import EventService from '../../service/EventService';
import EventTab from './EventTab';
import {colors} from '../../constants/ColorConstant';

const EventManagement = ({navigation}: {navigation: any}) => {
  const [eventCount, setEventCount] = useState(0);
  const [myEvent, setMyEvent] = useState<any[]>([]);
  const [myEventSharedEvent, setMyEventSharedEvent] = useState('MyEvents');
  const [noData, setNoData] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [sharedEvent, setSharedEvent] = useState<any[]>([]);
  const toastRef = useRef<any>();

  const [region, setRegion] = useState({
    latitude: 10,
    longitude: 10,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setPageLoader(true);
      getLocation();
      setMyEventSharedEvent('MyEvents');
    });
    return unsubscribe;
  }, [navigation]);

  // function for get current location api call
  const getLocation = async () => {
    let granted = null;
    if (Platform.OS === 'android') {
      granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Remindably Permission',
          message: 'Remindably needs access to your location ',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
    } else {
      await Geolocation.requestAuthorization('whenInUse');
    }
    if (
      granted === PermissionsAndroid.RESULTS.GRANTED ||
      Platform.OS === 'ios'
    ) {
      Geolocation.getCurrentPosition(
        position => {
          let metadata = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          };
          setRegion(metadata);
          getMyEventData(metadata);
          getSharedEventData(metadata);
        },
        error => {
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }
  };

  // function for get all my event data api call
  const getMyEventData = async (metadata?: any) => {
    const data = {
      lat: metadata ? metadata?.latitude : region.latitude,
      long: metadata ? metadata?.longitude : region.longitude,
    };
    EventService.postMyEvents(data)
      .then((response: any) => {
        setMyEvent(response.data.myevents);
        setEventCount(response?.data?.nearbyeventcounts);
        setPageLoader(false);
      })
      .catch(error => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // function for get all shared event data api call
  const getSharedEventData = async (metadata?: any) => {
    const data = {
      lat: metadata ? metadata?.latitude : region.latitude,
      long: metadata ? metadata?.longitude : region.longitude,
    };
    EventService.postSharedEvents(data)
      .then((response: any) => {
        setSharedEvent(response.data.sharedEvents);
        setEventCount(response?.data?.nearbyeventcounts);
        setPageLoader(false);
      })
      .catch(error => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // function for search all my event data api call
  const getSearchEventData = (text: any, metadata: any) => {
    setPageLoader(true);
    const data = {
      lat: metadata ? metadata?.latitude : region.latitude,
      long: metadata ? metadata?.longitude : region.longitude,
      search: text,
    };

    if (myEventSharedEvent == 'MyEvents') {
      EventService.postSearchMyEvents(data)
        .then((response: any) => {
          setPageLoader(false);
          if (response.data.myevents.length > 0) {
            setPageLoader(false);
            setNoData(false);
            setMyEvent(response.data.myevents);
          } else {
            setPageLoader(false);
            setNoData(true);
            setMyEvent(response.data.myevents);
          }
        })
        .catch((error: any) => {
          setPageLoader(false);
          console.log('error', error);
        });
    } else {
      // function for search all shared event data api call
      EventService.postSearchSharedEvents(data)
        .then((response: any) => {
          setPageLoader(false);
          if (response.data.sharedEvents.length > 0) {
            setPageLoader(false);
            setNoData(false);
            setSharedEvent(response.data.sharedEvents);
          } else {
            setPageLoader(false);
            setNoData(true);
            setSharedEvent(response.data.sharedEvents);
          }
        })
        .catch((error: any) => {
          setPageLoader(false);
          console.log('error', error);
        });
    }
  };

  // list for event tab
  const renderPageList = ({item}: {item: any; index: any}) => {
    return (
      <EventTab
        item={item}
        handleView={handleViewPage}
        onLikeClick={handleLike}
        onUnLikeClick={handleUnLike}
        getData={() => {
          getMyEventData();
          getSharedEventData();
        }}
        navigation={navigation}
      />
    );
  };

  // navigation for event details
  const handleViewPage = (id: any) => {
    navigation.navigate('StackNavigation', {
      screen: 'EventDetails',
      params: {id: id},
    });
  };

  // function for api call on like click
  const handleLike = (id: number) => {
    const data = {
      eventid: id,
      status: 1,
    };
    EventService.postLikeUnlikeEvent(data)
      .then((response: any) => {
        getMyEventData();
        getSharedEventData();
      })
      .catch(error => {
        console.log(error);
      });
  };

  // function for api call on unlike click
  const handleUnLike = (id: number) => {
    const data = {
      eventid: id,
      status: 0,
    };
    EventService.postLikeUnlikeEvent(data)
      .then((response: any) => {
        getMyEventData();
        getSharedEventData();
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      {/* header section  */}
      <CustomHeader
        headerText={'Events'}
        backButton={{
          visible: true,
          onClick: () => {
            navigation.goBack();
          },
        }}
      />

      {/* search field  */}
      <View style={styles.searchBoxContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Search By Name, City, State, Zip Code"
            placeholderTextColor={colors.textGray}
            style={styles.searchInput}
            value={searchText}
            onChangeText={text => {
              setSearchText(text);
              getSearchEventData(text, region);
            }}
          />
        </View>
        <View style={styles.searchContainer}>
          <Image
            resizeMode="contain"
            source={require('../../assets/pngImage/searchIcon.png')}
          />
        </View>
      </View>

      {/* my events, shared events and near by events button section */}
      <View style={styles.categoryContainer}>
        {/* my events section  */}
        <TouchableOpacity
          onPress={() => {
            setMyEventSharedEvent('MyEvents');
            getMyEventData();
          }}
          style={styles.selectedCategoryTab}>
          <Image
            style={styles.categoryImage}
            tintColor={
              myEventSharedEvent === 'MyEvents'
                ? colors.THEME_ORANGE
                : colors.WHITE
            }
            resizeMode="contain"
            source={require('../../assets/pngImage/myevent.png')}
          />
          <Text
            style={
              myEventSharedEvent === 'MyEvents'
                ? styles.selectedCategoryText
                : styles.unSelectedCategoryText
            }>
            My Events
          </Text>
        </TouchableOpacity>

        {/* shared events section  */}
        <TouchableOpacity
          onPress={() => {
            setMyEventSharedEvent('SharedEvents');
            getSharedEventData();
          }}
          style={styles.selectedCategoryTab}>
          <Image
            style={styles.categoryImage}
            tintColor={
              myEventSharedEvent === 'SharedEvents'
                ? colors.THEME_ORANGE
                : colors.WHITE
            }
            resizeMode="contain"
            source={require('../../assets/pngImage/sharedevent.png')}
          />
          <Text
            style={
              myEventSharedEvent === 'SharedEvents'
                ? styles.selectedCategoryText
                : styles.unSelectedCategoryText
            }>
            Shared Events
          </Text>
        </TouchableOpacity>

        {/* nearby events section  */}
        <TouchableOpacity
          onPress={() => {
            setMyEventSharedEvent('NearByEvents');
            navigation.navigate('StackNavigation', {
              screen: 'NearByEvents',
            });
          }}
          style={styles.selectedCategoryTab}>
          <Image
            style={styles.categoryImage}
            tintColor={
              myEventSharedEvent === 'NearByEvents'
                ? colors.THEME_ORANGE
                : colors.WHITE
            }
            resizeMode="contain"
            source={require('../../assets/pngImage/nearbyevent.png')}
          />
          <Text
            style={
              myEventSharedEvent === 'NearByEvents'
                ? styles.selectedCategoryText
                : styles.unSelectedCategoryText
            }>
            Nearby Event
          </Text>
          {eventCount > 0 ? (
            <Text style={styles.notificationText}>{eventCount}</Text>
          ) : null}
        </TouchableOpacity>
      </View>

      {!pageLoader ? (
        <View style={styles.body}>
          {/* my events and shared events tabs section */}
          <View style={{height: '86%'}}>
            {myEventSharedEvent == 'MyEvents' ? (
              <>
                {myEvent?.length > 0 ? (
                  <FlatList
                    data={myEvent}
                    renderItem={renderPageList}
                    keyExtractor={(item: any, index: any) => String(index)}
                  />
                ) : (
                  <View style={styles.noDataContainer}>
                    {!noData ? (
                      <Text style={styles.noDataText}>No Event Added</Text>
                    ) : (
                      <Text style={styles.noDataText}>No Result Found</Text>
                    )}
                  </View>
                )}
              </>
            ) : (
              <>
                {sharedEvent?.length > 0 ? (
                  <FlatList
                    data={sharedEvent}
                    renderItem={renderPageList}
                    keyExtractor={(item: any, index: any) => String(index)}
                  />
                ) : (
                  <View style={styles.noDataContainer}>
                    {!noData ? (
                      <Text style={styles.noDataText}>No Event Shared.</Text>
                    ) : (
                      <Text style={styles.noDataText}>No Result Found</Text>
                    )}
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      ) : (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.THEME_ORANGE} />
        </View>
      )}

      {/* create notes icon */}
      <LinearGradient
        colors={['#F28520', '#F5BD35']}
        style={styles.createIconContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('StackNavigation', {
              screen: 'CreateEvent',
            });
          }}>
          <Image
            style={styles.createIconImage}
            resizeMode="contain"
            source={require('../../assets/pngImage/Plus.png')}
          />
        </TouchableOpacity>
      </LinearGradient>

      {/* toaster message for error response from API  */}
      <CommonToast ref={toastRef} />
    </View>
  );
};

export default EventManagement;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {
    padding: 10,
  },
  searchBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
  },
  inputContainer: {
    borderRadius: 8,
    width: '84%',
  },
  searchInput: {
    backgroundColor: colors.BLACK3,
    borderRadius: 8,
    color: colors.WHITE,
    fontSize: 14,
    padding: 10,
    paddingLeft: 10,
  },
  searchContainer: {
    alignItems: 'center',
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 10,
    height: 45,
    justifyContent: 'center',
    width: '14%',
  },
  noDataContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  noDataText: {
    color: colors.WHITE,
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
  createIconContainer: {
    alignItems: 'center',
    backgroundColor: colors.WHITE,
    borderRadius: 100,
    bottom: 60,
    height: 60,
    justifyContent: 'center',
    padding: 20,
    position: 'absolute',
    right: 25,
    width: 60,
    zIndex: 1,
  },
  createIconImage: {
    borderRadius: 100,
    height: 25,
    width: 25,
  },
  loaderContainer: {
    alignSelf: 'center',
    height: '83%',
    justifyContent: 'center',
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
    top: -5,
    width: 25,
    zIndex: 1,
  },
  categoryContainer: {
    backgroundColor: colors.BLACK3,
    borderRadius: 15,
    flexDirection: 'row',
    marginHorizontal: 10,
    paddingVertical: 5,
  },
  selectedCategoryTab: {
    alignItems: 'center',
    width: '33%',
  },
  categoryImage: {
    height: 26,
    marginTop: 5,
    width: 26,
  },
  selectedCategoryText: {
    backgroundColor: colors.BLACK3,
    color: colors.THEME_ORANGE,
    fontSize: 14,
    fontWeight: '500',
    padding: 5,
    textAlign: 'center',
  },
  unSelectedCategoryText: {
    backgroundColor: colors.BLACK3,
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '500',
    padding: 5,
    textAlign: 'center',
  },
});
