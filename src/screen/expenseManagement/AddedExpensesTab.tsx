//external imports
import React, {useRef, useState} from 'react';
import {View, Image, Text, StyleSheet, TouchableOpacity} from 'react-native';
//internal imports
import {colors} from '../../constants/ColorConstant';
import SelectBudgetaryModal from './SelectBudgetaryModal';
import ExpensesManagementService from '../../service/ExpensesManagementService';
import CommonToast from '../../constants/CommonToast';
import moment from 'moment';

const AddedExpensesTab = ({
  items,
  navigation,
  onRefresh,
}: {
  items: any;
  navigation: any;
  onRefresh: Function;
}) => {
  const [addBudgetaryVisible, setAddBudgetaryVisible] = useState(false);
  const toastRef = useRef<any>();

  // on add click  in budget modal
  const onAddClick = (budgetaryId: any) => {
    const data = {
      budgetaryid: budgetaryId[0],
      expenseid: items?.expenseid,
    };

    setAddBudgetaryVisible(false);
    ExpensesManagementService.postAddExpenseToBudgetary(data)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        onRefresh();
      })
      .catch((error: any) => {
        console.log(error, 'error');
      });
  };

  // navigation for subscription plan on click of purchase plan click
  const onAddBudgetClick = () => {
    setAddBudgetaryVisible(false);
    navigation.navigate('StackNavigation', {
      screen: 'AddBudgetary',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.amountContainer}>
        <Text style={styles.expenseName}>{items?.title}</Text>

        {/* date  */}
        <View style={styles.direction}>
          <Image
            resizeMode="contain"
            style={{width: 15, height: 15}}
            source={require('../../assets/pngImage/CalendarBlank.png')}
          />
          <Text style={styles.dateText}>
            {moment(items?.expense_date).format('MM-DD-YYYY')}
          </Text>
        </View>

        {/* category and subcategory */}
        <View style={styles.direction}>
          {items?.categoryname != ' ' ? (
            <Text style={styles.categoryText}>{items?.categoryname}</Text>
          ) : null}
          <View style={styles.direction}>
            <View style={styles.dotContainer} />
            <Text style={styles.subCategoryText}>{items?.subcategoryname}</Text>
          </View>
        </View>

        <View style={styles.direction}>
          <Text style={styles.paymentText}>Payment mode</Text>
          <View style={styles.direction}>
            <View style={styles.dotContainer} />
            <Text style={styles.subCategoryText}>{items?.payment_type}</Text>
          </View>
        </View>

        <Text style={styles.amountText}>${items?.amount}</Text>

        {/* add to budget section in case of null budget id */}
        {items?.budgetaryid == '' ? (
          <TouchableOpacity
            style={styles.addBudgetaryContainer}
            onPress={() => {
              setAddBudgetaryVisible(true);
            }}>
            <Text style={styles.addBudgetaryText}>Add to budget</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.direction}>
            <Text style={styles.paymentText}>Budget Name :</Text>
            <Text style={styles.subCategoryText}> {items?.budgetaryname}</Text>
          </View>
        )}
      </View>

      {/* dollar image section */}
      <View style={styles.imageContainer}>
        <Image
          resizeMode="contain"
          style={styles.image}
          source={
            items?.images
              ? {uri: `${items?.images[0].image}`}
              : require('../../assets/pngImage/budgeticon.png')
          }
        />
      </View>

      {/* select budget modal for select budget  */}
      <SelectBudgetaryModal
        visibleModal={addBudgetaryVisible}
        onClose={() => {
          setAddBudgetaryVisible(false);
        }}
        onAddCLick={onAddClick}
        expenseId={items?.expenseid}
        navigation={navigation}
        onAddBudgetClick={onAddBudgetClick}
      />

      {/* toaster message for error response from API  */}
      <CommonToast ref={toastRef} />
    </View>
  );
};

export default AddedExpensesTab;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK3,
    borderRadius: 15,
    flex: 1,
    flexDirection: 'row',
    height: 'auto',
    justifyContent: 'space-between',
    marginHorizontal: 5,
    padding: 10,
    width: 298,
  },
  direction: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 3,
  },
  amountContainer: {
    paddingHorizontal: 10,
    width: '80%',
  },
  dotContainer: {
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 50,
    height: 10,
    width: 10,
  },
  expenseName: {
    color: colors.WHITE,
    fontSize: 15,
    fontWeight: '500',
    paddingBottom: 3,
  },
  dateText: {
    color: colors.lightGray,
    fontSize: 12,
    fontWeight: '400',
    paddingHorizontal: 5,
  },
  categoryText: {
    color: colors.YELLOW,
    fontSize: 12,
    fontWeight: '400',
    paddingRight: 20,
  },
  subCategoryText: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
    fontWeight: '400',
    paddingHorizontal: 3,
  },
  paymentText:{
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '500',
    paddingHorizontal: 3,
    paddingRight:10
  },
  amountText: {
    color: colors.THEME_ORANGE,
    fontSize: 20,
    fontWeight: '500',
    paddingVertical: 3,
  },
  imageContainer: {
    borderRadius: 50,
    height: 45,
    width: 45,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  addBudgetaryContainer: {
    alignItems: 'center',
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 8,
    height: '20%',
    justifyContent: 'center',
    width: '80%',
  },
  addBudgetaryText: {
    color: colors.WHITE,
    fontSize: 12,
    fontWeight: '500',
  },
});
