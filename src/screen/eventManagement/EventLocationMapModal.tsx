// external imports
import React, {useEffect, useState} from 'react';
import {
  Image,
  Modal,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import MapView, {Marker} from 'react-native-maps';
// internal imports
import EventService from '../../service/EventService';
import {colors} from '../../constants/ColorConstant';

export default function EventLocationMapModal({
  onRequestClosed,
  selectedLocationAddress,
  visibleModal,
}: {
  onRequestClosed: Function;
  selectedLocationAddress: Function;
  visibleModal: boolean;
}) {
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });

  const [markerCoordinate, setMarkerCoordinate] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [isEnabled, setIsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocationData, setSelectedLocationData] = useState('');

  useEffect(() => {
    shareLocation();
  }, []);

  // function on save button click on selected location
  const handleSaveSelectedLocation = (latLng: any) => {
    EventService.getLocationAddress(latLng.latitude, latLng.longitude)
      .then((response: any) => {
        setSelectedLocationData(response.data.results[0]);
      })
      .catch(() => {});
  };

  // function for share location
  const shareLocation = async () => {
    setIsLoading(true);
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
          setIsLoading(false);
        },
        error => {
          console.log(error.code, error.message);
          setIsLoading(false);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visibleModal}
      onRequestClose={() => {
        onRequestClosed();
      }}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            onRequestClosed();
            selectedLocationAddress(selectedLocationData);
          }}
          disabled={isEnabled}
          style={styles.checkedIconContainer}>
          <Image
            style={styles.checkedIcon}
            resizeMode="contain"
            source={require('../../assets/pngImage/cross.png')}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            onRequestClosed();
          }}
          style={styles.crossIconContainer}>
          <Image
            style={styles.checkedIcon}
            resizeMode="contain"
            source={require('../../assets/pngImage/cross.png')}
          />
        </TouchableOpacity>
        <MapView
          zoomControlEnabled={true}
          onRegionChangeComplete={getRegion => {
            setRegion(getRegion);
          }}
          style={styles.map}
          region={region}
          showsUserLocation={true}
          onPress={item => {
            setMarkerCoordinate(item.nativeEvent.coordinate);
            handleSaveSelectedLocation(item.nativeEvent.coordinate);
            setIsEnabled(false);
          }}>
          <Marker
            draggable={true}
            coordinate={markerCoordinate}
            pinColor={colors.THEME_ORANGE}
            onDragEnd={e => {
              setMarkerCoordinate(e.nativeEvent.coordinate);
              handleSaveSelectedLocation(e.nativeEvent.coordinate);
              setIsEnabled(false);
            }}
          />
        </MapView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: Platform.OS === 'ios' ? 40 : 0,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  checkedIconContainer: {
    alignItems: 'center',
    backgroundColor: colors.WHITE,
    height: 40,
    justifyContent: 'center',
    left: 10,
    position: 'absolute',
    top: 15,
    width: 40,
    zIndex: 2,
  },
  checkedIcon: {width: 15, height: 15},
  crossIconContainer: {
    alignItems: 'center',
    backgroundColor: colors.WHITE,
    height: 40,
    justifyContent: 'center',
    left: 10,
    position: 'absolute',
    top: 50,
    width: 40,
    zIndex: 2,
  },
});
