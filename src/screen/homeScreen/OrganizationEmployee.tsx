// external imports
import React from 'react';
import moment from 'moment';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
// internal imports
import {colors} from '../../constants/ColorConstant';

const OrganizationEmployee = ({
  items,
  navigation,
  onTabClick,
}: {
  items: any;
  navigation: any;
  onTabClick: Function;
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        onTabClick(items);
      }}
      style={styles.container}>
      <View style={styles.employeeNameContainer}>
        {/* organization account image  */}
        {items?.profile_image ? (
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              resizeMode="cover"
              source={{uri: `${items?.profile_image}`}}
            />
          </View>
        ) : (
          <View style={styles.imageContainer}>
            <Image
              resizeMode="contain"
              style={styles.image}
              source={require('../../assets/pngImage/noImage.png')}
            />
          </View>
        )}

        {/* name, and details section */}
        <View style={styles.nameContainer}>
          <Text style={styles.nameText}>{items?.name}</Text>

          <View style={styles.direction}>
            <Text style={styles.labelText}>Id: </Text>
            <Text style={styles.dataText}>{items?.employeid}</Text>
          </View>

          <View style={styles.direction}>
            <Text style={styles.labelText}>Designation: </Text>
            <Text style={styles.dataText}>{items?.designation}</Text>
          </View>
        </View>
      </View>

      {/* experience and joining date  */}
      <View style={styles.bottomSection}>
        <View style={styles.direction}>
          <Image
            style={{height: 25, width: 25, marginRight: 5}}
            resizeMode="contain"
            source={require('../../assets/pngImage/expIcon.png')}
          />
          <Text style={styles.dataText}>{items?.experience}</Text>
        </View>
        <View style={styles.direction}>
          <Image
            style={{height: 20, width: 20, marginRight: 5}}
            resizeMode="contain"
            source={require('../../assets/pngImage/dobIcon.png')}
          />

          <Text style={styles.dataText}>
            {moment(items?.dob).format('MM-DD-YYYY')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OrganizationEmployee;
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK3,
    borderRadius: 10,
    elevation: 3,
    flex: 1,
    margin: 5,
    width: 360,
  },
  employeeNameContainer: {
    backgroundColor: colors.BLACK3,
    borderRadius: 10,
    flexDirection: 'row',
    height: 'auto',
    padding: 10,
  },
  imageContainer: {
    borderColor: colors.textGray,
    borderRadius: 100,
    borderWidth: 1,
    height: 60,
    padding: 5,
    width: 60,
  },
  image: {
    borderRadius: 100,
    height: '100%',
    width: '100%',
  },
  nameContainer: {
    marginHorizontal: 10,
    width: '75%',
  },
  nameText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
  },
  direction: {
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 3,
  },
  labelText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
  },
  dataText: {
    color: colors.THEME_ORANGE,
    fontSize: 16,
    fontWeight: '500',
  },
  bottomSection: {
    alignContent: 'center',
    backgroundColor: colors.lightYellow,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 5,
  },
});
