// external imports
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
// internal imports
import AllExpensesTab from './AllExpensesTab';
import CommonToast from '../../constants/CommonToast';
import CustomHeader from '../../constants/CustomHeader';
import DeleteAlertModal from '../groups/DeleteAlertModal';
import ExpensesManagementService from '../../service/ExpensesManagementService';
import FilterExpensesModal from './FilterExpensesModal';
import {colors} from '../../constants/ColorConstant';

const UpcomingExpenses = ({navigation}: {navigation: any}) => {
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

  // function for get all up coming expense data on api call
  const getData = () => {
    ExpensesManagementService.postAllUpComingExpenses()
      .then((response: any) => {
        setPageLoader(false);
        setAllExpensesList(response.data.allupcommingexpenses);
      })
      .catch(error => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // function for search all up coming expense data on api call
  const getAllSearchExpenses = (text: string) => {
    setPageLoader(true);
    const data = {
      searchtitle: text,
    };
    ExpensesManagementService.postSearchAllUpComingExpenses(data)
      .then((response: any) => {
        setPageLoader(false);
        if (response.data.allupcommingexpenses.length > 0) {
          setPageLoader(false);
          setNoData(false);
          setAllExpensesList(response.data.allupcommingexpenses);
        } else {
          setPageLoader(false);
          setNoData(true);
          setAllExpensesList(response.data.allupcommingexpenses);
        }
      })
      .catch((error: any) => {
        setPageLoader(false);
        console.log('error', error);
      });
  };

  // function for filter all up coming expense data on api call
  const handleFilterCommunityApplyClick = (
    selectedId: number[],
    selectDate: string,
  ) => {
    const filterData = {
      categoryid: selectedId,
      date: selectDate,
    };
    setFilterExpensesModal(false);
    setPageLoader(true);

    ExpensesManagementService.postSearchAllUpComingExpenses(filterData)
      .then((response: any) => {
        if (response.data.allupcommingexpenses.length > 0) {
          setPageLoader(false);
          setNoData(false);
          setAllExpensesList(response.data.allupcommingexpenses);
        } else {
          setPageLoader(false);
          setNoData(true);
          setAllExpensesList(response.data.allupcommingexpenses);
        }
      })
      .catch((error: any) => {
        setPageLoader(false);
        console.log('error', error);
      });
  };

  // function for reset filter click
  const handleFilterCommunityResetClick = () => {
    getData();
  };

  // list for expense
  const renderExpensesItems = ({item}: {item: any; index: any}) => {
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

  // function for delete expense on api call
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
        headerText={'Upcoming Expenses'}
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
                renderItem={renderExpensesItems}
                listKey={'myGroupList'}
                keyExtractor={(item: any, index: any) => String(index)}
              />
            </View>
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            {!noData ? (
              <Text style={styles.noDataText}>No Upcoming Expenses Added.</Text>
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

export default UpcomingExpenses;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.BLACK
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
