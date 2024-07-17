// external imports
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import moment from 'moment';
// internal imports
import AllCategoryTab from './AllCategoryTab';
import AllSubCategoryTab from './AllSubCategoryTab';
import CalendarModal from './CalendarModal';
import ExpensesManagementService from '../../service/ExpensesManagementService';
import SubmitButton from '../../constants/SubmitButton';
import {colors} from '../../constants/ColorConstant';

const FilterExpensesModal = ({
  onClose,
  onResetClick,
  onSubmitClick,
  visibleModal,
}: {
  onClose: Function;
  onResetClick: Function;
  onSubmitClick: Function;
  visibleModal: boolean;
}) => {
  const [allExpenseCategory, setAllExpenseCategory] = useState([]);
  const [allExpenseSubCategory, setAllExpenseSubCategory] = useState([]);
  const [arrayList, setArrayList] = useState<any[]>([]);
  const [calendarModal, setCalendarModal] = useState(false);
  const [checked, setChecked] = useState(false);
  const [date, setDate] = useState('');
  const [err, setErr] = useState(false);
  const [mainCategory, setMainCategory] = useState('P');
  const [pageLoader, setPageLoader] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [subCategoryChecked, setSubCategoryChecked] = useState(false);
  const [subCategoryList, setSubCategoryList] = useState<any[]>([]);

  useEffect(() => {
    getData('P');
  }, []);

  // function for get all category data on api call
  const getData = (value: string) => {
    setArrayList([]);
    setSubCategoryList([]);
    setAllExpenseSubCategory([]);

    setPageLoader(true);
    const data = {
      category: value,
    };
    ExpensesManagementService.postListExpensesCategory(data)
      .then((response: any) => {
        setPageLoader(false);
        setAllExpenseCategory(response.data.allexpensecategory);
      })
      .catch(error => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // list for category
  const renderCategoryTab = ({item}: {item: any; index: any}) => {
    return (
      <AllCategoryTab
        item={item}
        handleChecked={handleChecked}
        checked={checked}
        checkedList={arrayList}
      />
    );
  };

  // function for select category
  const handleChecked = async (selectedId: number) => {
    setChecked(true);
    setArrayList([selectedId]);
    getListExpensesSubCategory(selectedId); //for sub category according to category
  };

  // function for get all sub category data on api call
  const getListExpensesSubCategory = (selectedId: number) => {
    setSubCategoryChecked(false);
    setSubCategoryList([]);

    setPageLoader(true);
    const data = {
      categoryid: selectedId,
    };
    ExpensesManagementService.postListExpensesSubCategory(data)
      .then((response: any) => {
        setPageLoader(false);
        setAllExpenseSubCategory(response.data.allexpensesubcategory);
      })
      .catch(error => {
        console.log(error);
        setPageLoader(false);
      });
  };

  // list for subcategory
  const renderSubCategoryTab = ({item}: {item: any; index: any}) => {
    return (
      <AllSubCategoryTab
        items={item}
        handleChecked={handleSubCategoryChecked}
        checked={subCategoryChecked}
        checkedList={subCategoryList}
      />
    );
  };

  // function for reset button click on filter
  const handleResetClick = () => {
    setArrayList([]);
    setSelectedDate('');
    onResetClick();
    setSubCategoryList([]);
  };

  // function for select sub category
  const handleSubCategoryChecked = (selectedSubCategoryId: number) => {
    setErr(false);
    setSubCategoryChecked(true);
    setSubCategoryList([selectedSubCategoryId]);
  };

  // function on calender close
  const handleCalendarModalClose = () => {
    setCalendarModal(false);
  };

  // function on calender submit click with selected date
  const handleCalendarSubmitClick = (selectDate: string) => {
    setCalendarModal(false);
    setSelectedDate(moment(selectDate).format('MM-DD-YYYY'));
    setDate(selectDate);
  };

  // function for submit button click
  const handleSubmitClick = () => {
    if (subCategoryList[0] != null) {
      setErr(false);
      onSubmitClick(subCategoryList[0], date);
    } else {
      setErr(true);
    }
  };

  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={visibleModal}
        onRequestClose={() => {
          onClose();
        }}>
        <View style={styles.container}>
          {/* cross button section  */}
          <View style={styles.backArrowContainer}>
            <TouchableOpacity
              style={styles.backArrow}
              onPress={() => {
                onClose();
              }}>
              <Image
                resizeMode="contain"
                tintColor={colors.WHITE}
                source={require('../../assets/pngImage/backArrow.png')}
              />
            </TouchableOpacity>
            <Text style={styles.headerText}>Filters</Text>
          </View>

          <View style={styles.body}>
            {/* preference list section */}
            <Text style={styles.labelText}>Select your category</Text>
            {/* main category section  */}
            <View style={styles.categoryContainer}>
              <TouchableOpacity
                onPress={() => {
                  setMainCategory('P');
                  getData('P');
                }}
                style={
                  mainCategory === 'P'
                    ? styles.categoryTabBorder
                    : styles.categoryTab
                }>
                <Text style={styles.categoryText}>Personal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setMainCategory('O');
                  getData('O');
                }}
                style={
                  mainCategory === 'O'
                    ? styles.categoryTabBorder
                    : styles.categoryTab
                }>
                <Text style={styles.categoryText}>Official</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setMainCategory('S');
                  getData('S');
                }}
                style={
                  mainCategory === 'S'
                    ? styles.categoryTabBorder
                    : styles.categoryTab
                }>
                <Text style={styles.categoryText}>Shared</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.textDirection}>
              <Text style={styles.labelText}>Categories</Text>
            </View>

            {/* category tab section  */}
            {!pageLoader ? (
              <View style={{height: 110}}>
                <FlatList
                  data={allExpenseCategory}
                  renderItem={renderCategoryTab}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item: any, index: any) => String(index)}
                />
              </View>
            ) : (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={colors.THEME_ORANGE} />
              </View>
            )}

            {allExpenseSubCategory?.length > 0 ? (
              <>
                <View style={styles.textDirection}>
                  <Text style={styles.labelText}>Sub Categories</Text>
                </View>

                {/* sub category tab section */}
                <View>
                  <FlatList
                    data={allExpenseSubCategory}
                    renderItem={renderSubCategoryTab}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item: any, index: any) => String(index)}
                  />
                </View>
              </>
            ) : null}

            {err ? (
              <Text style={styles.errorMessage}>
                *Please select category and sub category.
              </Text>
            ) : null}

            {/* calendar filter section with search box */}
            <Text style={styles.labelText}>Select Date</Text>
            <View style={styles.calendarDateContainer}>
              <TextInput
                editable={false}
                placeholder={'MM-DD-YYYY'}
                placeholderTextColor={colors.WHITE}
                value={selectedDate}
                style={{
                  color: colors.WHITE,
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  setCalendarModal(!calendarModal);
                }}
                style={styles.calendarIcon}>
                <Image
                  resizeMode="contain"
                  style={styles.image}
                  tintColor={colors.WHITE}
                  source={require('../../assets/pngImage/CalendarBlank1.png')}
                />
              </TouchableOpacity>
            </View>

            {/* button section */}
            <View style={{marginVertical: 20}}>
              <SubmitButton
                buttonText={'Submit'}
                submitButton={() => handleSubmitClick()}
              />

              {/*Cancel section */}
              <TouchableOpacity
                style={styles.cancelContainer}
                onPress={() => {
                  handleResetClick();
                }}>
                <Text style={styles.cancelText}>Reset</Text>
              </TouchableOpacity>
            </View>

            {/* Calender modal */}
            <CalendarModal
              visibleModal={calendarModal}
              onClose={handleCalendarModalClose}
              onSubmitClick={handleCalendarSubmitClick}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FilterExpensesModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {
    flex: 1,
    paddingHorizontal: 15,
  },
  backArrowContainer: {
    flexDirection: 'row',
    padding: 20,
  },
  backArrow: {alignSelf: 'center'},
  headerText: {
    color: colors.WHITE,
    fontSize: 20,
    fontWeight: '500',
    marginLeft: 20,
    textAlign: 'center',
    width: '80%',
  },
  categoryContainer: {
    borderRadius: 15,
    flexDirection: 'row',
  },
  categoryTab: {width: '33%'},
  categoryTabBorder: {
    borderBottomColor: colors.THEME_ORANGE,
    borderBottomWidth: 3,
    width: '33%',
  },
  categoryText: {
    backgroundColor: colors.BLACK3,
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
    padding: 10,
    textAlign: 'center',
  },
  textDirection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingVertical: 3,
  },
  labelText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
    marginTop: 15,
    padding: 3,
  },
  calendarDateContainer: {
    backgroundColor: colors.BLACK3,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 3,
    height: 50,
  },
  calendarIcon: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 20,
    width: 20,
  },
  cancelContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    height: 50,
    justifyContent: 'center',
  },
  cancelText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  errorMessage: {
    color: colors.RED,
    fontSize: 14,
    paddingHorizontal: 10,
  },
  loaderContainer: {
    alignSelf: 'center',
    height: 50,
    justifyContent: 'center',
  },
});
