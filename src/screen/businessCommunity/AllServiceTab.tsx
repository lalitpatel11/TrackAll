// external imports
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
// internal imports
import {colors} from '../../constants/ColorConstant';

const AllServiceTab = ({
  items,
  selectService,
}: {
  items: any;
  selectService: Function;
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        selectService(items);
      }}>
      {/* service title  */}
      <View style={styles.nameContainer}>
        <View style={styles.direction}>
          <Text style={styles.businessHeading}>Service Name: </Text>
          <Text style={styles.businessName}>{items?.servicename}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default AllServiceTab;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.WHITE,
    borderRadius: 8,
    flex: 1,
    flexDirection: 'row',
    margin: 5,
    padding: 10,
    width: 'auto',
    elevation: 2,
  },
  nameContainer: {width: '85%'},
  businessName: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
    fontWeight: '500',
  },
  businessHeading: {
    color: colors.THEME_BLACK,
    fontSize: 14,
    paddingVertical: 3,
  },
  direction: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
