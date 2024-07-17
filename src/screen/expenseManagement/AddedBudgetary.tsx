//external imports
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
//internal imports
import AddedBudgetaryTab from './AddedBudgetaryTab';
import CommonToast from '../../constants/CommonToast';
import CustomHeader from '../../constants/CustomHeader';
import DeleteAlertModal from '../groups/DeleteAlertModal';
import ExpensesManagementService from '../../service/ExpensesManagementService';
import {colors} from '../../constants/ColorConstant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BusinessService from '../../service/BusinessService';
import MonthPicker from 'react-native-month-year-picker';
import moment from 'moment';

const AddedBudgetary = ({navigation}: {navigation: any}) => {
  //variables
  const filterMonth = useRef<Number>(null);
  const filterYear = useRef<Number>(null);
  //hook : states
  const [budgetaryData, setBudgetaryData] = useState({});
  const [budgetaryId, setBudgetaryId] = useState(0);
  const [budgetaryRestriction, setBudgetaryRestriction] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [noData, setNoData] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [warningModal, setWarningModal] = useState(false);
  const toastRef = useRef<any>();
  const [filterBudgetModal, setFilterBudgetModal] = useState(false);
  const [date, setDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState<any>(moment().month() + 1);
  const [currentYear, setCurrentYear] = useState(moment().year());

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
    });
    return unsubscribe;
  }, [navigation]);

  // function for get all budget data on api call
  const getData = async () => {
    const accountId = await AsyncStorage.getItem('accountId');
    const userType = await AsyncStorage.getItem('userType');
    setPageLoader(true);

    if (userType == '2') {
      const body = {
        accountId: accountId,
        month: currentMonth < 10 ? '0' + currentMonth : currentMonth,
        year: currentYear,
      };

      BusinessService.postListBusinessBudgetaryRestriction(body)
        .then((response: any) => {
          setPageLoader(false);
          setBudgetaryRestriction(response?.data?.budgetaryrestrication);
        })
        .catch(error => {
          setPageLoader(false);
          console.log(error);
        });
    } else {
      const body = {
        accountId: accountId,
        month: currentMonth < 10 ? '0' + currentMonth : currentMonth,
        year: currentYear,
      };

      ExpensesManagementService.postListBudgetaryRestriction(body)
        .then((response: any) => {
          setPageLoader(false);
          setBudgetaryRestriction(response?.data?.budgetaryrestrication);
        })
        .catch(error => {
          setPageLoader(false);
          console.log(error);
        });
    }
  };

  // function for search all budget data on api call
  const getAllSearchBudgetary = async (text: string) => {
    setPageLoader(true);
    const accountId = await AsyncStorage.getItem('accountId');
    const userType = await AsyncStorage.getItem('userType');

    if (userType == '2') {
      const data = {
        search: text,
        accountId: accountId,
        month:
          filterMonth.current < 10 ? '0' + filterMonth.current : currentMonth,
        year: filterYear,
      };
      handleSearchApi(data);
    } else {
      const data = {
        search: text,
        month:
          filterMonth.current < 10 ? '0' + filterMonth.current : currentMonth,
        year: filterYear,
      };
      handleSearchApi(data);
    }
  };

  const handleSearchApi = (data: any) => {
    console.log(data);

    ExpensesManagementService.postSearchBudgetaryRestriction(data)
      .then((response: any) => {
        setPageLoader(false);
        if (response?.data?.budgetaryrestrication?.length > 0) {
          setPageLoader(false);
          setNoData(false);
          setBudgetaryRestriction(response?.data?.budgetaryrestrication);
        } else {
          setPageLoader(false);
          setNoData(true);
          setBudgetaryRestriction(response?.data?.budgetaryrestrication);
        }
      })
      .catch((error: any) => {
        setPageLoader(false);
        console.log('error', error);
      });
  };
  // list for pre added budget list
  const renderAddedBudgetary = ({item}: {item: any; index: any}) => {
    return (
      <AddedBudgetaryTab
        items={item}
        addExpensesClick={handleAddExpensesClick}
        viewDetailsClick={handleViewDetailsClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
      />
    );
  };

  // navigation on add expense click
  const handleAddExpensesClick = (item: any) => {
    if (item?.percentage >= 100) {
      setWarningModal(true);
      setBudgetaryData(item);
    } else {
      navigation.navigate('StackNavigation', {
        screen: 'AddExpense',
        params: {
          data: item,
        },
      });
    }
  };

  // navigation on view expense click
  const handleViewDetailsClick = (item: any) => {
    navigation.navigate('StackNavigation', {
      screen: 'ViewExpanses',
      params: {
        data: item,
      },
    });
  };

  // navigation on edit budget click
  const handleEditClick = (data: any) => {
    navigation.navigate('StackNavigation', {
      screen: 'EditBudgetary',
      params: {
        data: data,
      },
    });
  };

  // open modal on delete icon click for budget
  const handleDeleteClick = (id: any) => {
    setDeleteModal(true);
    setBudgetaryId(id);
  };

  // function for delete button click for api call to delete the budget
  const handleDelete = () => {
    setDeleteModal(false);
    ExpensesManagementService.getDeleteBudgetaryRestriction(budgetaryId)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        getData();
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const onValueChange = useCallback(
    (event: any, newDate: Date) => {
      const selectedDate = newDate || date;
      setFilterBudgetModal(false);
      setCurrentMonth(moment(selectedDate).month() + 1);
      console.log('SELECTED MONTH', moment(selectedDate).month() + 1);

      filterMonth.current = moment(selectedDate).month() + 1;
      setCurrentYear(moment(selectedDate).year());
      filterYear.current = moment(selectedDate).year();
      setDate(selectedDate);
      getAllSearchBudgetary('');
    },
    [date, filterBudgetModal],
  );

  return (
    <View style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Added Budget'}
        backButton={{
          visible: true,
          onClick: () => {
            navigation.goBack();
          },
        }}
      />

      {/* search field  */}
      <View style={styles.searchBoxContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Search budget by title"
            placeholderTextColor={colors.textGray}
            style={styles.searchInput}
            value={searchText}
            onChangeText={text => {
              setSearchText(text);
              getAllSearchBudgetary(text);
            }}
          />
        </View>
        <TouchableOpacity
          style={styles.searchContainer}
          onPress={() => {
            setFilterBudgetModal(true);
          }}>
          <Image
            resizeMode="contain"
            source={require('../../assets/pngImage/filter.png')}
          />
        </TouchableOpacity>

        {/* <DatePicker
          modal
          open={filterBudgetModal}
          date={date}
          title={'Select Month'}
          mode={'date'}
          minuteInterval={15}
          onConfirm={date => {
            setDate(date);
            // setFilterBudgetModal(false);
            // setStartTime(startTime);
            // setErrMsg(false);
            // let selectedTime = moment(date).format('hh:mm A');
            // setStartTimeList(selectedTime);
          }}
          onCancel={() => {
            setFilterBudgetModal(false);
          }}
        /> */}
      </View>

      {filterBudgetModal ? (
        <MonthPicker
          onChange={onValueChange}
          value={date}
          autoTheme={false}
          maximumDate={new Date(2090, 11)}
        />
      ) : null}

      {/* body section */}
      <View style={styles.body}>
        {/* add budget and all expense section  */}
        <View style={styles.textDirection}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('StackNavigation', {
                screen: 'AddBudgetary',
              });
            }}>
            <Text style={styles.addEditText}>Add Budget</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('StackNavigation', {
                screen: 'AllExpenses',
              });
            }}>
            <Text style={styles.addEditText}>All Expenses</Text>
          </TouchableOpacity>
        </View>

        {/* all added budget section  */}
        {!pageLoader ? (
          budgetaryRestriction?.length > 0 ? (
            <View style={styles.container}>
              <FlatList
                data={budgetaryRestriction}
                renderItem={renderAddedBudgetary}
                keyExtractor={(item: any, index: any) => String(index)}
              />
            </View>
          ) : (
            <View style={styles.noDataContainer}>
              {!noData ? (
                <Text style={styles.noDataText}>
                  No budget list created yet. {'\n'}Click on the "Add Budget" to
                  set budget.
                </Text>
              ) : (
                <Text style={styles.noDataText}>No result found</Text>
              )}
            </View>
          )
        ) : (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.THEME_ORANGE} />
          </View>
        )}

        {/* Delete alert modal for delete budget */}
        <DeleteAlertModal
          visibleModal={deleteModal}
          onRequestClosed={() => {
            setDeleteModal(false);
          }}
          onPressRightButton={() => {
            handleDelete();
          }}
          subHeading={'Are you sure you want to delete this budget ?'}
        />

        {/* Delete alert modal for limit cross alert*/}
        <DeleteAlertModal
          visibleModal={warningModal}
          onRequestClosed={() => {
            setWarningModal(false);
          }}
          onPressRightButton={() => {
            setWarningModal(false);
            navigation.navigate('StackNavigation', {
              screen: 'AddExpense',
              params: {
                data: budgetaryData,
              },
            });
          }}
          subHeading={
            'You have exceed the budget limit. Are you sure you want add expense ?'
          }
        />

        {/* toaster message for error response from API  */}
        <CommonToast ref={toastRef} />
      </View>
    </View>
  );
};

export default AddedBudgetary;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {
    flex: 1,
    padding: 10,
  },
  textDirection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  addEditText: {
    color: colors.THEME_ORANGE,
    fontSize: 16,
    fontWeight: '500',
    textDecorationColor: colors.THEME_ORANGE,
    textDecorationLine: 'underline',
  },
  searchBoxContainer: {
    flexDirection: 'row',
    height: 65,
    justifyContent: 'space-between',
    padding: 10,
  },
  inputContainer: {
    borderRadius: 8,
    width: '84%',
  },
  searchInput: {
    backgroundColor: colors.BLACK3,
    borderRadius: 8,
    color: colors.WHITE,
    fontSize: 16,
    padding: 10,
    paddingLeft: 10,
  },
  searchContainer: {
    alignItems: 'center',
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 10,
    justifyContent: 'center',
    width: '14%',
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
