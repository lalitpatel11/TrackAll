// external imports
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ExpansesImage from './ExpansesImage';
import React, {useCallback, useRef, useState} from 'react';
// internal imports
import {colors} from '../../constants/ColorConstant';
import SelectBudgetaryModal from './SelectBudgetaryModal';
import ExpensesManagementService from '../../service/ExpensesManagementService';
import CommonToast from '../../constants/CommonToast';
import moment from 'moment';

const AllExpensesTab = ({
  items,
  onDeleteClick,
  onEditClick,
  navigation,
  onRefresh,
}: {
  items: any;
  onDeleteClick: Function;
  onEditClick: Function;
  navigation: any;
  onRefresh: Function;
}) => {
  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"
  const [addBudgetaryVisible, setAddBudgetaryVisible] = useState(false);
  const toastRef = useRef<any>();

  //To toggle the show text or hide it
  const toggleNumberOfLines = () => {
    setTextShown(!textShown);
  };

  const onTextLayout = useCallback((e: any) => {
    setLengthMore(e.nativeEvent.lines.length >= 2); //to check the text is more than 2 lines or not
  }, []);

  const renderExpensesImage = ({item}: {item: any; index: any}) => {
    return <ExpansesImage expenseImage={item} />;
  };

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
        <Text style={styles.expansesName}>{items?.title}</Text>
        <Text style={styles.amountText}>${items?.amount}</Text>
        <Text style={styles.dateText}>
          Date : {moment(items?.expense_date).format('MM-DD-YYYY')}
        </Text>
        <View style={styles.direction}>
          {items?.categoryname != ' ' ? (
            <Text style={styles.categoryText}>{items?.categoryname}</Text>
          ) : null}
          <Text style={styles.subCategoryText}>{items?.subcategoryname}</Text>
        </View>

        <View style={styles.direction}>
          <Text style={styles.dateText}>Payment mode :</Text>
          <Text style={styles.categoryText}> {items?.payment_type}</Text>
        </View>

        {/* edit and delete icon */}
        <View style={styles.iconContainer}>
          <TouchableOpacity
            style={styles.editDeleteContainer}
            onPress={() => {
              onEditClick(items);
            }}>
            <Image
              resizeMode="contain"
              style={{height: 18, width: 18}}
              source={require('../../assets/pngImage/editIcon.png')}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.editDeleteContainer}
            onPress={() => {
              onDeleteClick(items?.expenseid);
            }}>
            <Image
              resizeMode="contain"
              style={{height: 18, width: 18}}
              source={require('../../assets/pngImage/Trash.png')}
            />
          </TouchableOpacity>
        </View>

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
            <Text style={styles.dateText}>Budget Name :</Text>
            <Text style={styles.categoryText}> {items?.budgetaryname}</Text>
          </View>
        )}
      </View>

      {/* expenses Image section  */}
      {items?.images?.length >= 0 ? (
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={items.images}
          renderItem={renderExpensesImage}
          keyExtractor={(item: any, index: any) => String(index)}
        />
      ) : null}

      {/* description section on basis of read more and read less */}
      <View style={styles.descriptionContainer}>
        <Text
          style={styles.descriptionText}
          onTextLayout={onTextLayout}
          numberOfLines={textShown ? undefined : 2}>
          {items?.description}
        </Text>
        {lengthMore ? (
          <Text onPress={toggleNumberOfLines} style={styles.readMoreText}>
            {textShown ? 'View less...' : 'View more...'}
          </Text>
        ) : null}
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

export default AllExpensesTab;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK3,
    borderRadius: 15,
    flex: 1,
    height: 'auto',
    margin: 5,
    padding: 10,
  },
  direction: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  amountContainer: {paddingHorizontal: 10},
  expansesName: {
    color: colors.WHITE,
    fontSize: 20,
  },
  categoryText: {
    color: colors.THEME_ORANGE,
    fontSize: 16,
    paddingRight: 20,
  },
  subCategoryText: {
    color: colors.lightOrange,
    fontSize: 16,
  },
  amountText: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '500',
  },
  dateText: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '500',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    right: 5,
    width: '18%',
    zIndex: 1,
  },
  editDeleteContainer: {
    alignItems: 'center',
    borderRadius: 50,
    justifyContent: 'center',
    padding: 3,
  },
  descriptionContainer: {
    height: 'auto',
    padding: 10,
  },
  descriptionText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '400',
  },
  readMoreText: {
    color: colors.THEME_ORANGE,
    fontWeight: '500',
    lineHeight: 21,
    width: '35%',
  },
  addBudgetaryContainer: {
    alignItems: 'center',
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 8,
    height: 30,
    justifyContent: 'center',
    width: '36%',
  },
  addBudgetaryText: {
    color: colors.WHITE,
    fontSize: 12,
    fontWeight: '500',
  },
});