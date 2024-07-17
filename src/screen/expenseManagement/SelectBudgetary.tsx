//external imports
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
//internal imports
import {colors} from '../../constants/ColorConstant';

const SelectBudgetary = ({
  checked,
  checkedList,
  handleChecked,
  items,
}: {
  checked: boolean;
  checkedList: number[];
  handleChecked: Function;
  items: any;
}) => {
  return (
    <View style={styles.interestsContainer}>
      <TouchableOpacity
        style={
          checkedList?.includes(items?.id)
            ? checked
              ? styles.interestsTabBorder
              : styles.interestsTab
            : styles.interestsTab
        }
        onPress={() => {
          handleChecked(items?.id, items);
        }}>
        {checkedList?.includes(items?.id) ? (
          checked ? (
            <Image
              style={styles.checkedIcon}
              resizeMode="contain"
              source={require('../../assets/pngImage/checked.png')}
            />
          ) : null
        ) : null}
        <View>
          <Text style={styles.mainCategoryText}>{items.categorytype}</Text>

          <View style={styles.amountDirection}>
            <Text style={styles.budgetaryTitle}>{items.name}</Text>
            <Text style={styles.amountText}>${items.budget}</Text>
          </View>

          {/* category section */}
          <View style={styles.direction}>
            <View>
              <Text style={styles.categoryLabel}>Categories</Text>
              <Text style={styles.categoryText}>{items.categoryname}</Text>
            </View>

            <View>
              <Text style={styles.categoryLabel}>Expense Categories</Text>
              <Text style={styles.categoryText}>{items.subcategoryname}</Text>
            </View>
          </View>

          {/* budget type or monthly and yearly data  */}
          <View>
            {items?.type == 'Y' ? (
              <>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.categoryLabel}>Budget type: </Text>
                  <Text style={styles.categoryText}>Yearly</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.categoryText}>Year: </Text>
                  <Text style={styles.monthYearName}>
                    {items?.interval?.year}
                  </Text>
                </View>
              </>
            ) : (
              <>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.categoryLabel}>Budget type: </Text>
                  <Text style={styles.categoryText}>Monthly</Text>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.categoryText}>Month: </Text>
                  {items?.interval?.month == '01' ? (
                    <Text style={styles.monthYearName}>Jan</Text>
                  ) : items?.interval?.month == '02' ? (
                    <Text style={styles.monthYearName}>Feb</Text>
                  ) : items?.interval?.month == '03' ? (
                    <Text style={styles.monthYearName}>Mar</Text>
                  ) : items?.interval?.month == '04' ? (
                    <Text style={styles.monthYearName}>Apr</Text>
                  ) : items?.interval?.month == '05' ? (
                    <Text style={styles.monthYearName}>May</Text>
                  ) : items?.interval?.month == '06' ? (
                    <Text style={styles.monthYearName}>Jun</Text>
                  ) : items?.interval?.month == '07' ? (
                    <Text style={styles.monthYearName}>Jul</Text>
                  ) : items?.interval?.month == '08' ? (
                    <Text style={styles.monthYearName}>Aug</Text>
                  ) : items?.interval?.month == '09' ? (
                    <Text style={styles.monthYearName}>Sep</Text>
                  ) : items?.interval?.month == '10' ? (
                    <Text style={styles.monthYearName}>Oct</Text>
                  ) : items?.interval?.month == '11' ? (
                    <Text style={styles.monthYearName}>Nov</Text>
                  ) : items?.interval?.month == '12' ? (
                    <Text style={styles.monthYearName}>Dec</Text>
                  ) : null}
                </View>
              </>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SelectBudgetary;

const styles = StyleSheet.create({
  interestsContainer: {
    backgroundColor: colors.BLACK3,
    borderRadius: 15,
    margin: 5,
    elevation: 3,
    height: 'auto',
  },
  interestsTab: {
    borderColor: colors.brightGray,
    borderRadius: 15,
    borderWidth: 1,
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  interestsTabBorder: {
    borderColor: colors.THEME_ORANGE,
    borderRadius: 15,
    borderWidth: 2,
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  interestsLabel: {
    color: colors.BLACK,
  },
  checkedIcon: {
    position: 'absolute',
    right: 5,
    top: 5,
    zIndex: 1,
  },
  direction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  mainCategoryText: {
    color: colors.lightOrange,
    fontSize: 14,
  },
  budgetaryTitle: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
  },
  amountText: {
    color: colors.THEME_ORANGE,
    fontSize: 16,
    fontWeight: '500',
  },
  amountDirection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryLabel: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
    fontWeight: '400',
  },
  categoryText: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '500',
  },
  progressText: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '500',
  },
  limitCrossText: {
    color: colors.RED,
    fontSize: 14,
    fontWeight: '400',
  },
  buttonContainer: {
    alignItems: 'center',
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 5,
    height: 40,
    justifyContent: 'center',
    width: 130,
  },
  buttonText: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '500',
  },
  monthYearName: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '500',
  },
});
