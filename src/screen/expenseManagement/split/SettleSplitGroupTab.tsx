//external imports
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
//internal imports
import {colors} from '../../../constants/ColorConstant';

const SettleSplitGroupTab = ({
  items,
  onViewClick,
}: {
  items: any;
  onViewClick: Function;
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        onViewClick(items?.groupid);
      }}>
      <View style={styles.direction}>
        <Text style={styles.splitTitle}>{items?.name}</Text>
        <Text style={styles.dateText}>{items?.created_at}</Text>
      </View>

      <Text style={styles.amountText}>
        ${items?.amount ? items?.amount : '0'}
      </Text>
      <Text style={styles.spendText}>Spent</Text>

      {/* user profile section */}
      <View style={styles.imageDirection}>
        <View style={styles.imageContainer1}>
          <Image
            resizeMode="contain"
            source={
              items?.images
                ? {uri: `${items?.images}`}
                : require('../../../assets/pngImage/avatar.png')
            }
            style={styles.profileImage}
          />
        </View>

        <View style={styles.imageContainer2}>
          <Image
            resizeMode="contain"
            source={
              items?.images
                ? {uri: `${items?.images}`}
                : require('../../../assets/pngImage/avatar.png')
            }
            style={styles.profileImage}
          />
        </View>

        <View style={styles.imageContainer3}>
          <Image
            resizeMode="contain"
            source={
              items?.images
                ? {uri: `${items?.images}`}
                : require('../../../assets/pngImage/avatar.png')
            }
            style={styles.profileImage}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SettleSplitGroupTab;
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK3,
    borderRadius: 15,
    flex: 1,
    height: 'auto',
    margin: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  direction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  splitTitle: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '400',
  },
  dateText: {
    color: colors.textGray,
    fontSize: 14,
    fontWeight: '500',
  },
  amountText: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '500',
  },
  spendText: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
    fontWeight: '400',
  },
  imageDirection: {
    flexDirection: 'row',
    paddingVertical: 10,
    width: '25%',
  },
  imageContainer1: {
    backgroundColor: colors.GRAY,
    borderRadius: 50,
    height: 35,
    width: 35,
  },
  imageContainer2: {
    backgroundColor: colors.GRAY,
    borderRadius: 50,
    height: 35,
    right: 15,
    width: 35,
    zIndex: 1,
  },
  imageContainer3: {
    backgroundColor: colors.GRAY,
    borderRadius: 50,
    height: 35,
    right: 30,
    width: 35,
    zIndex: 2,
  },
  profileImage: {
    borderRadius: 50,
    width: '100%',
    height: '100%',
  },
});
