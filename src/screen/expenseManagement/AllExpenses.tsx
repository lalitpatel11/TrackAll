//external imports
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import moment from 'moment';
//internal imports
import AllExpensesTab from './AllExpensesTab';
import CommonToast from '../../constants/CommonToast';
import CustomHeader from '../../constants/CustomHeader';
import DeleteAlertModal from '../groups/DeleteAlertModal';
import ExpensesManagementService from '../../service/ExpensesManagementService';
import FilterExpensesModal from './FilterExpensesModal';
import {colors} from '../../constants/ColorConstant';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AllExpenses = ({navigation}: {navigation: any}) => {
  const [allExpensesList, setAllExpensesList] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [expanseId, setExpanseId] = useState(0);
  const [filterExpensesModal, setFilterExpensesModal] = useState(false);
  const [noData, setNoData] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [searchText, setSearchText] = useState('');
  const toastRef = useRef<any>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setSearchText('');
      setPageLoader(true);
      getData();
    });
    return unsubscribe;
  }, [navigation]);

  // function for get all expense data on api call
  const getData = async () => {
    const accountId = await AsyncStorage.getItem('accountId');
    const userType = await AsyncStorage.getItem('userType');
    setPageLoader(true);

    const data = {
      accountId: accountId,
    };

    if (userType == '2') {
      ExpensesManagementService.postAllUserExpenses(data)
        .then((response: any) => {
          setPageLoader(false);
          setAllExpensesList(response?.data?.expenses);
        })
        .catch(error => {
          setPageLoader(false);
          console.log(error);
        });
    } else {
      ExpensesManagementService.postAllUserExpenses()
        .then((response: any) => {
          setPageLoader(false);
          setAllExpensesList(response?.data?.expenses);
        })
        .catch(error => {
          setPageLoader(false);
          console.log(error);
        });
    }
  };

  // function for search all expense data on api call
  const getAllSearchExpenses = async (text: string) => {
    const accountId = await AsyncStorage.getItem('accountId');
    const userType = await AsyncStorage.getItem('userType');

    setPageLoader(true);

    if (userType == '2') {
      const data = {
        searchtitle: text,
        accountId: accountId,
      };
      handleSearchApi(data);
    } else {
      const data = {
        searchtitle: text,
      };
      handleSearchApi(data);
    }
  };

  // function for filter all expense data on api call
  const handleFilterCommunityApplyClick = async (
    selectedId: number[],
    selectDate: string,
  ) => {
    const accountId = await AsyncStorage.getItem('accountId');
    const userType = await AsyncStorage.getItem('userType');
    let date = moment(selectDate).format('YYYY-MM-DD');
    setFilterExpensesModal(false);
    setPageLoader(true);

    if (userType == '2') {
      const data = {
        categoryid: selectedId,
        date: date,
        accountId: accountId,
      };

      handleSearchApi(data);
    } else {
      const data = {
        categoryid: selectedId,
        date: date,
      };

      handleSearchApi(data);
    }
  };

  const handleSearchApi = (data: any) => {
    ExpensesManagementService.postSearchAllUserExpenses(data)
      .then((response: any) => {
        setPageLoader(false);
        if (response?.data?.expenses?.length > 0) {
          setPageLoader(false);
          setNoData(false);
          setAllExpensesList(response?.data?.expenses);
        } else {
          setPageLoader(false);
          setNoData(true);
          setAllExpensesList(response?.data?.expenses);
        }
      })
      .catch((error: any) => {
        setPageLoader(false);
        console.log('error', error);
      });
  };

  // function on reset button click to reset the data
  const handleFilterCommunityResetClick = () => {
    getData();
  };

  // list for all expenses
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

  // navigation on edit click to edit expense
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

  // function for delete button click on api call to delete the expense
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
      {/* heading section */}
      <CustomHeader
        headerText={'All Expenses'}
        backButton={{
          visible: true,
          onClick: () => {
            navigation.goBack();
          },
        }}
      />

      {/* search box and filter*/}
      <View>
        <View style={styles.searchBoxContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Search By Title"
              placeholderTextColor={colors.textGray}
              style={styles.searchInput}
              value={searchText}
              onChangeText={(text: string) => {
                setSearchText(text);
                getAllSearchExpenses(text);
              }}
            />
          </View>

          <TouchableOpacity
            style={styles.searchContainer}
            onPress={() => {
              setFilterExpensesModal(true);
            }}>
            <Image
              resizeMode="contain"
              source={require('../../assets/pngImage/filter.png')}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* body section */}
      {!pageLoader ? (
        allExpensesList?.length > 0 ? (
          <View style={styles.body}>
            {/* my groups list  */}
            <View style={{height: '90%'}}>
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
              <Text style={styles.noDataText}>No Expenses added yet.</Text>
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

      {/* Filter expense Modal modal  */}
      <FilterExpensesModal
        visibleModal={filterExpensesModal}
        onClose={() => {
          setFilterExpensesModal(false);
        }}
        onSubmitClick={handleFilterCommunityApplyClick}
        onResetClick={handleFilterCommunityResetClick}
      />

      {/* Delete alert modal for delete expense */}
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

export default AllExpenses;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {
    padding: 10,
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
