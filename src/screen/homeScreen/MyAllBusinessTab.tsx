// external imports
import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
// internal imports
import {colors} from '../../constants/ColorConstant';

const MyAllBusinessTab = ({
  items,
  navigation,
  viewBusinessDetails,
}: {
  items: any;
  navigation: any;
  viewBusinessDetails: Function;
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        viewBusinessDetails(items?.businessid);
      }}>
      {/* group title  */}
      <View style={styles.nameContainer}>
        <View style={styles.direction}>
          <Text style={styles.businessHeading}>Business Name: </Text>
          <Text style={styles.businessName}>{items?.businessName}</Text>
        </View>
      </View>

      {/* group image  */}
      {items?.businessProfile ? (
        <View style={styles.businessImageContainer}>
          <Image
            style={styles.image}
            resizeMode="cover"
            source={{uri: `${items?.businessProfile}`}}
          />
        </View>
      ) : (
        <View style={styles.noImageContainer}>
          <View style={styles.noImage}>
            <Image
              style={styles.image}
              resizeMode="cover"
              source={require('../../assets/pngImage/noImage.png')}
            />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default MyAllBusinessTab;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK3,
    borderRadius: 15,
    elevation: 2,
    flex: 1,
    flexDirection: 'row',
    margin: 5,
    padding: 10,
    width: 'auto',
  },
  nameContainer: {
    width: '85%',
  },
  businessName: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
    fontWeight: '500',
  },
  businessHeading: {
    color: colors.WHITE,
    fontSize: 14,
    paddingVertical: 3,
  },
  direction: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  image: {
    borderRadius: 100,
    height: '100%',
    width: '100%',
  },
  businessImageContainer: {
    borderColor: colors.WHITE,
    borderRadius: 100,
    borderWidth: 1,
    height: 30,
    width: 30,
  },
  noImageContainer: {
    alignItems: 'center',
    backgroundColor: colors.THEME_WHITE,
    borderColor: colors.WHITE,
    borderRadius: 100,
    borderWidth: 1,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  noImage: {
    borderRadius: 100,
    height: 20,
    width: 20,
  },
});
