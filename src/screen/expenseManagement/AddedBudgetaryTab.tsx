// external imports
import * as Progress from 'react-native-progress';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
// internal imports
import {colors} from '../../constants/ColorConstant';
import YearAndMonth from './YearAndMonth';

const AddedBudgetaryTab = ({
  addExpensesClick,
  items,
  onDeleteClick,
  onEditClick,
  viewDetailsClick,
}: {
  addExpensesClick: Function;
  items: any;
  onDeleteClick: Function;
  onEditClick: Function;
  viewDetailsClick: Function;
}) => {
  let percent = items?.percentage / 100;

  // list for all expenses
  const renderAddedYearMonthName = ({item}: {item: any; index: any}) => {
    return <YearAndMonth items={item} monthYear={items?.type} />;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.mainCategoryText}>{items.categorytype}</Text>

      {/* edit and delete icon */}
      <View style={styles.iconContainer}>
        <TouchableOpacity
          style={styles.editDeleteContainer}
          onPress={() => {
            onEditClick(items);
          }}>
          <Image
            resizeMode="contain"
            style={styles.icon}
            source={require('../../assets/pngImage/editIcon.png')}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editDeleteContainer}
          onPress={() => {
            onDeleteClick(items?.budgetaryid);
          }}>
          <Image
            resizeMode="contain"
            style={styles.icon}
            source={require('../../assets/pngImage/Trash.png')}
          />
        </TouchableOpacity>
      </View>

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
          <Text style={styles.categoryLabel}>Sub Categories</Text>
          <Text style={styles.categoryText}>{items.subcategoryname}</Text>
        </View>
      </View>

      {/* process bar section  */}
      <View>
        {items?.percentage <= 25 && items?.percentage >= 0 ? (
          <Progress.Bar progress={percent} width={300} color={colors.GREEN} />
        ) : items?.percentage <= 50 && items?.percentage > 25 ? (
          <Progress.Bar progress={percent} width={300} color={colors.YELLOW} />
        ) : items?.percentage <= 75 && items?.percentage > 50 ? (
          <Progress.Bar progress={percent} width={300} color={colors.AMBER} />
        ) : items?.percentage <= 100 && items?.percentage > 75 ? (
          <Progress.Bar progress={percent} width={300} color={colors.RED} />
        ) : (
          <Progress.Bar progress={percent} width={300} color={colors.RED} />
        )}
        <Text style={styles.progressText}>Use : {items.percentage}%</Text>

        {/* exceed limit warning msg  */}
        {items?.percentage >= 100 ? (
          <Text style={styles.limitCrossText}>You have exceeded the limit</Text>
        ) : null}
      </View>

      {/* budget type or monthly and yearly data  */}
      <View>
        {items?.type == 'Y' ? (
          <>
            <Text style={styles.categoryText}>Budget type: Yearly</Text>

            <View style={{flexDirection: 'row', marginTop: 5}}>
              <Text style={styles.categoryText}>Year: </Text>
              <FlatList
                data={items?.intervals}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                renderItem={renderAddedYearMonthName}
                keyExtractor={(item: any, index: any) => String(index)}
              />
            </View>
          </>
        ) : (
          <>
            <Text style={styles.categoryText}>Budget type: Monthly</Text>
            <View style={{flexDirection: 'row', marginTop: 5}}>
              <Text style={styles.categoryText}>Month: </Text>
              <FlatList
                data={items?.intervals}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                renderItem={renderAddedYearMonthName}
                keyExtractor={(item: any, index: any) => String(index)}
              />
            </View>
          </>
        )}
      </View>

      {/* button section */}
      <View style={styles.direction}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => {
            addExpensesClick(items);
          }}>
          <Text style={styles.buttonText}>Add Expense</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => {
            viewDetailsClick(items);
          }}>
          <Text style={styles.buttonText}>View Expenses</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddedBudgetaryTab;
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK3,
    borderRadius: 15,
    elevation: 3,
    flex: 1,
    height: 'auto',
    margin: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  direction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    right: 5,
    top: 3,
    width: '18%',
    zIndex: 1,
  },
  editDeleteContainer: {
    alignItems: 'center',
    borderRadius: 50,
    justifyContent: 'center',
    padding: 3,
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
    color: colors.brightGray,
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
  icon: {
    height: 18,
    width: 18,
  },
});
