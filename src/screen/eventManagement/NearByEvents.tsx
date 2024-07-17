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

const NearByEvents = ({navigation}: {navigation: any}) => {
  const [allNearByEventList, setAllNearByEventList] = useState<any[]>([]);
  const [mile, setMile] = useState('50');
  const [noData, setNoData] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [searchText, setSearchText] = useState('');
  const toastRef = useRef<any>();

  const [region, setRegion] = useState({
    latitude: 10,
    longitude: 10,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getLocation();
      setPageLoader(true);
      setSearchText('');
    });
    return unsubscribe;
  }, []);

  // function for get current location
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
          getData(metadata);
        },
        error => {
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }
  };

  // function for get near by event data on api call with lat long
  const getData = async (metadata?: any) => {
    const data = {
      lat: metadata ? metadata?.latitude : region.latitude,
      long: metadata ? metadata?.longitude : region.longitude,
      nearbyeventfilter: mile,
    };

    EventService.postNearByEvent(data)
      .then((response: any) => {
        setPageLoader(false);
        setAllNearByEventList(response.data.nearbyevents);
      })
      .catch(error => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // function for search near by event data on api call with lat long and mile
  const getSearchEventData = (text: string, mileData: string) => {
    const data = {
      lat: region.latitude,
      long: region.longitude,
      search: text,
      nearbyeventfilter: mileData,
    };
    setPageLoader(true);
    EventService.postNearByEvent(data)
      .then((response: any) => {
        setPageLoader(false);
        if (response.data.nearbyevents.length > 0) {
          setPageLoader(false);
          setNoData(false);
          setAllNearByEventList(response.data.nearbyevents);
        } else {
          setPageLoader(false);
          setNoData(true);
          setAllNearByEventList(response.data.nearbyevents);
        }
      })
      .catch((error: any) => {
        setPageLoader(false);
        console.log('error', error);
      });
  };

  // list for events
  const renderPageList = ({item}: {item: any; index: any}) => {
    return (
      <EventTab
        item={item}
        handleView={handleViewPage}
        onLikeClick={handleLike}
        onUnLikeClick={handleUnLike}
        getData={getData}
        navigation={navigation}
      />
    );
  };

  // navigation on event details page
  const handleViewPage = (id: any) => {
    navigation.navigate('StackNavigation', {
      screen: 'EventDetails',
      params: {id: id},
    });
  };

  // function for api call on like call
  const handleLike = (id: number) => {
    const data = {
      eventid: id,
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

  // function for api call on unlike call
  const handleUnLike = (id: number) => {
    const data = {
      eventid: id,
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

  return (
    <View style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Nearby Event'}
        backButton={{
          visible: true,
          onClick: () => {
            navigation.goBack();
          },
        }}
      />

      {/* search field */}
      <View style={styles.searchBoxContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Search By Name, City, State, Zip Code"
            placeholderTextColor={colors.textGray}
            style={styles.searchInput}
            value={searchText}
            onChangeText={text => {
              setSearchText(text);
              getSearchEventData(text, mile);
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

      {/* mile filter */}
      <View style={styles.monthDirection}>
        <TouchableOpacity
          style={styles.radioDirection}
          onPress={() => {
            setMile('10');
            getSearchEventData(searchText, '10');
          }}>
          <View
            style={
              mile === '10' ? styles.selectedRadio : styles.unSelectedRadio
            }>
            <View style={mile === '10' ? styles.selectedRadioFill : null} />
          </View>
          <Text style={styles.mileNumber}>10 Miles</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.radioDirection}
          onPress={() => {
            setMile('25');
            getSearchEventData(searchText, '25');
          }}>
          <View
            style={
              mile === '25' ? styles.selectedRadio : styles.unSelectedRadio
            }>
            <View style={mile === '25' ? styles.selectedRadioFill : null} />
          </View>
          <Text style={styles.mileNumber}>25 Miles</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.radioDirection}
          onPress={() => {
            setMile('50');
            getSearchEventData(searchText, '50');
          }}>
          <View
            style={
              mile === '50' ? styles.selectedRadio : styles.unSelectedRadio
            }>
            <View style={mile === '50' ? styles.selectedRadioFill : null} />
          </View>
          <Text style={styles.mileNumber}>50 Miles</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.radioDirection}
          onPress={() => {
            setMile('100');
            getSearchEventData(searchText, '100');
          }}>
          <View
            style={
              mile === '100' ? styles.selectedRadio : styles.unSelectedRadio
            }>
            <View style={mile === '100' ? styles.selectedRadioFill : null} />
          </View>
          <Text style={styles.mileNumber}>100 Miles</Text>
        </TouchableOpacity>
      </View>

      {/* Recently Visited Pages section */}
      {!pageLoader ? (
        allNearByEventList?.length > 0 ? (
          <View style={styles.body}>
            {/* page section  */}
            <View style={{height: '88%'}}>
              <FlatList
                data={allNearByEventList}
                renderItem={renderPageList}
                keyExtractor={(item: any, index: any) => String(index)}
              />
            </View>
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            {!noData ? (
              <Text style={styles.noDataText}>
                No Event Found Nearby. {'\n'}Click on the "+" icon to create an
                event.
              </Text>
            ) : (
              <Text style={styles.noDataText}>No Result Found</Text>
            )}
          </View>
        )
      ) : (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.THEME_ORANGE} />
        </View>
      )}

      {/* create notes icon  */}
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

export default NearByEvents;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {padding: 10},
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
  textDirection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  labelText: {
    color: colors.WHITE,
    fontSize: 17,
    fontWeight: '500',
  },
  viewAllText: {
    color: colors.THEME_ORANGE,
    fontSize: 16,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
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
  loaderContainer: {
    alignSelf: 'center',
    height: '83%',
    justifyContent: 'center',
  },
  radioDirection: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  monthDirection: {
    alignContent: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  unSelectedRadio: {
    alignItems: 'center',
    borderColor: colors.WHITE,
    borderRadius: 12,
    borderWidth: 2,
    height: 24,
    justifyContent: 'center',
    marginHorizontal: 3,
    width: 24,
  },
  selectedRadio: {
    alignItems: 'center',
    borderColor: colors.THEME_ORANGE,
    borderRadius: 12,
    borderWidth: 2,
    height: 24,
    justifyContent: 'center',
    marginHorizontal: 3,
    width: 24,
  },
  selectedRadioFill: {
    alignItems: 'center',
    backgroundColor: colors.THEME_ORANGE,
    borderColor: colors.WHITE,
    borderRadius: 12,
    borderWidth: 2,
    height: 20,
    justifyContent: 'center',
    marginHorizontal: 3,
    width: 20,
  },
  mileNumber: {
    color: colors.WHITE,
    fontSize: 13,
    fontWeight: '400',
    marginRight: 5,
  },
});
