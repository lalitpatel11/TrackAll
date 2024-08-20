// external imports
import {
  ActivityIndicator,
  Alert,
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
import React, {useEffect, useRef, useState} from 'react';
// internal imports
import CommonToast from '../../../constants/CommonToast';
import CustomHeader from '../../../constants/CustomHeader';
import EventService from '../../../service/EventService';
import {colors} from '../../../constants/ColorConstant';
import EventTab from '../../eventManagement/EventTab';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BusinessService from '../../../service/BusinessService';

const BusinessEventManagement = ({navigation}: {navigation: any}) => {
  const [eventCount, setEventCount] = useState(0);
  const [myEvent, setMyEvent] = useState<any[]>([]);
  const [myEventSharedEvent, setMyEventSharedEvent] = useState('MyEvents');
  const [noData, setNoData] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [sharedEvent, setSharedEvent] = useState<any[]>([]);
  const toastRef = useRef<any>();
  const [allNearByEventList, setAllNearByEventList] = useState<any[]>([]);

  const [region, setRegion] = useState({
    latitude: 10,
    longitude: 10,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setPageLoader(true);
      setMyEventSharedEvent('MyEvents');
      getLocation();
    });
    return unsubscribe;
  }, [navigation]);

  // function for open side menu
  const handleOpenDrawer = () => {
    navigation.openDrawer();
  };

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
          getPublicEventData(metadata);
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
    const accountId = await AsyncStorage.getItem('accountId');

    const data = {
      lat: metadata ? metadata?.latitude : region.latitude,
      long: metadata ? metadata?.longitude : region.longitude,
      accountId: accountId,
    };

    BusinessService.postMyBusinessEvents(data)
      .then((response: any) => {
        setMyEvent(response?.data?.myevents);
        setEventCount(response?.data?.nearbyeventcounts);
        setPageLoader(false);
      })
      .catch(error => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // function for get all shared event data api call
  const getPublicEventData = async (metadata?: any) => {
    const data = {
      lat: metadata ? metadata?.latitude : region.latitude,
      long: metadata ? metadata?.longitude : region.longitude,
      nearbyeventfilter: '100',
    };

    EventService.postNearByEvent(data)
      .then((response: any) => {
        setPageLoader(false);
        setAllNearByEventList(response?.data?.nearbyevents);
      })
      .catch(error => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // function for search all my event data api call
  const getSearchEventData = async (text: any, metadata: any) => {
    const accountId = await AsyncStorage.getItem('accountId');

    setPageLoader(true);

    if (myEventSharedEvent == 'MyEvents') {
      const data = {
        lat: metadata ? metadata?.latitude : region.latitude,
        long: metadata ? metadata?.longitude : region.longitude,
        search: text,
        accountId: accountId,
      };
      EventService.postSearchMyEvents(data)
        .then((response: any) => {
          setPageLoader(false);
          if (response?.data?.myevents.length > 0) {
            setPageLoader(false);
            setNoData(false);
            setMyEvent(response?.data?.myevents);
          } else {
            setPageLoader(false);
            setNoData(true);
            setMyEvent(response?.data?.myevents);
          }
        })
        .catch((error: any) => {
          setPageLoader(false);
          console.log('error', error);
        });
    } else {
      const data = {
        lat: metadata ? metadata?.latitude : region.latitude,
        long: metadata ? metadata?.longitude : region.longitude,
        nearbyeventfilter: '100',
        search: text,
      };

      // function for search all shared event data api call
      EventService.postNearByEvent(data)
        .then((response: any) => {
          setPageLoader(false);
          if (response?.data?.nearbyevents.length > 0) {
            setPageLoader(false);
            setNoData(false);
            setSharedEvent(response?.data?.nearbyevents);
          } else {
            setPageLoader(false);
            setNoData(true);
            setSharedEvent(response?.data?.nearbyevents);
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
          getPublicEventData();
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
        getPublicEventData();
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
        getPublicEventData();
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Business Events'}
        drawerButton={{
          visible: true,
          onClick: () => {
            handleOpenDrawer();
          },
        }}
        bellButton={{
          visible: true,
          onClick: () => {
            navigation.navigate('StackNavigation', {
              screen: 'Notifications',
            });
          },
        }}
      />

      {/* search field  */}
      <View style={styles.searchBoxContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Search by name, city, state, zip code"
            placeholderTextColor={colors.THEME_WHITE}
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
            source={require('../../../assets/pngImage/searchIcon.png')}
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
            source={require('../../../assets/pngImage/myevent.png')}
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
            getPublicEventData();
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
            source={require('../../../assets/pngImage/sharedevent.png')}
          />
          <Text
            style={
              myEventSharedEvent === 'SharedEvents'
                ? styles.selectedCategoryText
                : styles.unSelectedCategoryText
            }>
            Public Events
          </Text>
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
                      <Text style={styles.noDataText}>No event added yet.</Text>
                    ) : (
                      <Text style={styles.noDataText}>No result found</Text>
                    )}
                  </View>
                )}
              </>
            ) : (
              <>
                {allNearByEventList?.length > 0 ? (
                  <FlatList
                    data={allNearByEventList}
                    renderItem={renderPageList}
                    keyExtractor={(item: any, index: any) => String(index)}
                  />
                ) : (
                  <View style={styles.noDataContainer}>
                    {!noData ? (
                      <Text style={styles.noDataText}>
                        No public events yet.
                      </Text>
                    ) : (
                      <Text style={styles.noDataText}>No result found</Text>
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
      <View style={styles.createIconContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('StackNavigation', {
              screen: 'CreateEvent',
            });
          }}>
          <Image
            style={styles.createIconImage}
            resizeMode="contain"
            source={require('../../../assets/pngImage/Plus.png')}
          />
        </TouchableOpacity>
      </View>

      {/* toaster message for error response from API  */}
      <CommonToast ref={toastRef} />
    </View>
  );
};

export default BusinessEventManagement;

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
    backgroundColor: colors.THEME_ORANGE,
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
    width: '50%',
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
