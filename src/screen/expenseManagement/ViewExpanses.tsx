//external imports
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
//internal imports
import AllExpensesTab from './AllExpensesTab';
import CommonToast from '../../constants/CommonToast';
import CustomHeader from '../../constants/CustomHeader';
import DeleteAlertModal from '../groups/DeleteAlertModal';
import ExpensesManagementService from '../../service/ExpensesManagementService';
import {colors} from '../../constants/ColorConstant';

const ViewExpanses = ({navigation, route}: {navigation: any; route: any}) => {
  const [allExpensesList, setAllExpensesList] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [expanseId, setExpanseId] = useState(0);
  const [noData, setNoData] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [spendAmount, setSpendAmount] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const toastRef = useRef<any>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setPageLoader(true);
      getData();
    });
    return unsubscribe;
  }, [navigation]);

  // function for get all expense data on api call with search and filter
  const getData = () => {
    const filterData = {
      categoryid: route?.params?.data?.subcategoryid,
      userbudgetaryid: route?.params?.data?.budgetaryid,
    };
    ExpensesManagementService.postSearchAllUserExpenses(filterData)
      .then((response: any) => {
        if (response.data.expenses.length > 0) {
          setPageLoader(false);
          setNoData(false);
          setAllExpensesList(response.data.expenses);
          setTotalAmount(response.data.totalamount);
          setSpendAmount(response.data.spendamount);
        } else {
          setPageLoader(false);
          setAllExpensesList(response.data.expenses);
        }
      })
      .catch((error: any) => {
        setPageLoader(false);
        console.log('error', error);
      });
  };

  // list for all expense
  const renderGroupsItems = ({item}: {item: any; index: any}) => {
    return (
      <AllExpensesTab
        items={item}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        navigation={navigation}
        onRefresh={getData}
      />
    );
  };

  // navigation on edit expense click
  const handleEditClick = (data: any) => {
    navigation.navigate('StackNavigation', {
      screen: 'EditExpanse',
      params: {
        data: data,
      },
    });
  };

  // function for open modal on delete icon click
  const handleDeleteClick = (id: any) => {
    setDeleteModal(true);
    setExpanseId(id);
  };

  // function for delete button click on api call to delete budgetary
  const handleDelete = () => {
    setDeleteModal(false);
    ExpensesManagementService.getDeleteExpanse(expanseId)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        getData();
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Expenses List'}
        backButton={{
          visible: true,
          onClick: () => {
            navigation.goBack();
          },
        }}
      />

      {/* body section */}
      {!pageLoader ? (
        allExpensesList?.length > 0 ? (
          <View style={styles.body}>
            {/* spend and total amount section  */}
            <View style={styles.textDirection}>
              <View style={styles.spendContainer}>
                <Text style={styles.spendText}>Total Amount</Text>
                <Text style={styles.spendAmountText}>${totalAmount}</Text>
                <View style={styles.backgroundImageContainer}>
                  {/* <Image
                    resizeMode="contain"
                    style={styles.image}
                    source={require('../../assets/pngImage/CurrencyCircleDollar.png')}
                  /> */}
                </View>
              </View>

              <View style={styles.spendContainer}>
                <Text style={styles.spendText}>Spent Amount</Text>
                <Text style={styles.spendAmountText}>${spendAmount}</Text>
                <View style={styles.backgroundImageContainer}>
                  {/* <Image
                    resizeMode="contain"
                    style={styles.image}
                    source={require('../../assets/pngImage/CurrencyCircleDollar.png')}
                  /> */}
                </View>
              </View>
            </View>

            {/* my groups list  */}
            <View style={{height: '80%'}}>
              <FlatList
                data={allExpensesList}
                scrollEnabled={true}
                renderItem={renderGroupsItems}
                listKey={'myGroupList'}
                keyExtractor={(item: any, index: any) => String(index)}
              />
            </View>
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            {!noData ? (
              <Text style={styles.noDataText}>No Expenses added.</Text>
            ) : (
              <Text style={styles.noDataText}>No Result Found</Text>
            )}
          </View>
        )
      ) : (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.THEME_ORANGE} />
        </View>
      )}

      {/* Delete alert modal for delete task */}
      <DeleteAlertModal
        visibleModal={deleteModal}
        onRequestClosed={() => {
          setDeleteModal(false);
        }}
        onPressRightButton={() => {
          handleDelete();
        }}
        subHeading={'Are you sure you want to delete this expense ?'}
      />

      {/* toaster message for error response from API  */}
      <CommonToast ref={toastRef} />
    </View>
  );
};

export default ViewExpanses;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {
    padding: 10,
  },
  textDirection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  spendContainer: {
    backgroundColor: colors.BLACK3,
    borderRadius: 15,
    height: 70,
    marginVertical: 10,
    padding: 5,
    width: '48%',
  },
  spendText: {
    color: colors.THEME_ORANGE,
    fontSize: 16,
    fontWeight: '400',
    padding: 5,
    zIndex: 2,
  },
  spendAmountText: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '500',
    paddingHorizontal: 5,
  },
  backgroundImageContainer: {
    borderRadius: 50,
    bottom: -15,
    height: 80,
    position: 'absolute',
    right: -15,
    width: 80,
    zIndex: 1,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  loaderContainer: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  noDataContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  noDataText: {
    color: colors.WHITE,
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
});
