// external imports
import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
// internal imports
import {colors} from '../../constants/ColorConstant';

const RecentMonthData = ({items}: {items: any}) => {
  return (
    <View style={styles.amountPercentContainer}>
      {/* this month and amount section  */}
      <View style={styles.imageContainer}>
        <Image
          resizeMode="contain"
          style={styles.image}
          source={require('../../assets/pngImage/monthlyDollar.png')}
        />
      </View>
      <View style={styles.amountContainer}>
        <Text style={styles.monthText}>{items?.monthname}</Text>
        <Text style={styles.amountText}>
          ${items?.amount} of ${items?.budgetamount}
        </Text>

        {/* percent according to color and uses  */}
        {items?.percentage <= 25 && items?.percentage >= 0 ? (
          <Text style={styles.greenPercentText}>
            {items?.percentage}% of budget
          </Text>
        ) : items?.percentage <= 50 && items?.percentage > 25 ? (
          <Text style={styles.yellowPercentText}>
            {items?.percentage}% of budget
          </Text>
        ) : items?.percentage <= 75 && items?.percentage > 50 ? (
          <Text style={styles.amberPercentText}>
            {items?.percentage}% of budget
          </Text>
        ) : items?.percentage > 75 ? (
          <Text style={styles.redPercentText}>
            {items?.percentage}% of budget
          </Text>
        ) : null}
      </View>
    </View>
  );
};

export default RecentMonthData;

const styles = StyleSheet.create({
  amountPercentContainer: {
    backgroundColor: colors.BLACK3,
    borderRadius: 15,
    height: 150,
    justifyContent: 'center',
    marginRight: 10,
    paddingLeft: 10,
    paddingVertical: 10,
    width: 180,
  },
  imageContainer: {
    borderRadius: 50,
    height: 50,
    marginBottom: 5,
    width: 50,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  amountContainer: {paddingHorizontal: 5},
  amountText: {
    color: colors.THEME_ORANGE,
    fontSize: 16,
    fontWeight: '500',
    paddingVertical: 3,
  },
  monthText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
  },
  greenPercentText: {
    color: colors.GREEN,
    fontSize: 12,
    fontWeight: '500',
  },
  yellowPercentText: {
    color: colors.YELLOW,
    fontSize: 12,
    fontWeight: '500',
  },
  amberPercentText: {
    color: colors.AMBER,
    fontSize: 12,
    fontWeight: '500',
  },
  redPercentText: {
    color: colors.RED,
    fontSize: 12,
    fontWeight: '500',
  },
  textDirection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
