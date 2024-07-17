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
import CommonToast from '../../../constants/CommonToast';
import CustomHeader from '../../../constants/CustomHeader';
import SettleSplitBillCompleteModal from './SettleSplitBillCompleteModal';
import SettleSplitBillTab from './SettleSplitBillTab';
import SplitService from '../../../service/SplitService';
import {colors} from '../../../constants/ColorConstant';

const SettleSplitBill = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const [arrayList, setArrayList] = useState<any[]>([]);
  const [memberList, setMemberList] = useState<any[]>([]);
  const [noData, setNoData] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedData, setSelectedData] = useState([]);
  const [settleAmount, setSettleAmount] = useState(0);
  const [settleModal, setSettleModal] = useState(false);
  const [settleSplitBillList, setSettleSplitBillList] = useState<any[]>([]);
  const [splitGroupId, setSplitGroupId] = useState(route?.params?.data);
  const [totalAmount, setTotalAmount] = useState('');
  const toastRef = useRef<any>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setSplitGroupId(route?.params?.data);
      setArrayList([]);
      getData();
    });
    return unsubscribe;
  }, [navigation]);

  // function for get all split bill data on api call
  const getData = () => {
    const data = {
      groupid: splitGroupId,
    };

    setPageLoader(true);
    SplitService.postSettleSplitBillList(data)
      .then((response: any) => {
        setPageLoader(false);
        setTotalAmount(response?.data?.totalamoutduetosette);
        setSettleSplitBillList(response?.data?.splitexpenses);
      })
      .catch(error => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // function for search all split bill data on api call
  const getAllSearchSplit = (text: string) => {
    setPageLoader(true);
    const data = {
      groupid: splitGroupId,
      search: text,
    };
    SplitService.postSearchSettleSplitBillList(data)
      .then((response: any) => {
        setPageLoader(false);
        if (response?.data?.splitexpenses.length > 0) {
          setPageLoader(false);
          setNoData(false);
          setSettleSplitBillList(response?.data?.splitexpenses);
        } else {
          setPageLoader(false);
          setNoData(true);
          setSettleSplitBillList(response?.data?.splitexpenses);
        }
      })
      .catch((error: any) => {
        setPageLoader(false);
        console.log('error', error);
      });
  };

  // list for added split bill
  const renderAddedSettleSplit = ({item}: {item: any; index: any}) => {
    return (
      <SettleSplitBillTab
        items={item}
        onSelect={handleSelect}
        selectedList={arrayList}
      />
    );
  };

  // function for select split bill on click
  const handleSelect = (selectedId: any, item: any) => {
    if (arrayList.includes(selectedId)) {
      setArrayList(arrayList.filter(ids => ids !== selectedId));
    } else {
      setArrayList([...arrayList, selectedId]);
    }

    // for member list
    const objWithIdIndex = memberList.findIndex(
      (obj: any) => obj.id === selectedData.id,
    );

    const index = selectedData.findIndex((e: any) => e.id === item.id);
    if (index > -1) {
      const filter = selectedData.filter((e: any) => e.id !== item.id);
      setSelectedData(filter);
      const FinalAmount = settleAmount - parseFloat(item.amount);
      setSettleAmount(FinalAmount);
    } else {
      setSelectedData([...selectedData, item]);
      const FinalAmount = settleAmount + parseFloat(item.amount);
      setSettleAmount(FinalAmount);
    }
  };

  // function for submit button click for api call to settle split bill
  const handleSettleSplitBill = () => {
    const data = new FormData();
    arrayList.map((e: any, index: any) => {
      data.append(`billid[${index}]`, e);
    });

    SplitService.postMarkSettleSplitBill(data)
      .then((response: any) => {
        setSettleModal(false);
        toastRef.current.getToast(response.data.message, 'success');
        setSettleAmount([]);
        setArrayList([]);
        getData();
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Settle Split Bill'}
        backButton={{
          visible: true,
          onClick: () => {
            navigation.goBack();
          },
        }}
      />

      {/* body section */}
      <View style={styles.body}>
        {/* spend and total amount section  */}
        <View style={styles.spendContainer}>
          <View style={styles.direction}>
            <View>
              <Text style={styles.spendText}>Amount due to settle</Text>
              <Text style={styles.spendAmountText}>${totalAmount}</Text>
            </View>

            {arrayList?.length > 0 ? (
              <TouchableOpacity
                style={styles.settleContainer}
                onPress={() => {
                  setSettleModal(true);
                }}>
                <Text style={styles.settleText}>Settle Bill</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.settleContainerDisable}>
                <Text style={styles.settleText}>Settle Bill</Text>
              </View>
            )}
          </View>

          <View style={styles.backgroundImageContainer}>
            {/* <Image
                resizeMode="contain"
              style={styles.image}
              source={require('../../../assets/pngImage/CurrencyCircleDollar.png')}
            /> */}
          </View>
        </View>

        {/* search field */}
        <View style={styles.searchBoxContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Search Split By Title"
              placeholderTextColor={colors.textGray}
              style={styles.searchInput}
              value={searchText}
              onChangeText={text => {
                setSearchText(text);
                getAllSearchSplit(text);
              }}
            />
          </View>
          <View style={styles.searchContainer}>
            <Image
              resizeMode="contain"
              source={require('../../../assets/pngImage/searchIcon.png')}
            />
          </View>
        </View>

        {/* all added split section  */}
        {!pageLoader ? (
          settleSplitBillList?.length > 0 ? (
            <View style={styles.container}>
              <FlatList
                data={settleSplitBillList}
                renderItem={renderAddedSettleSplit}
                keyExtractor={(item: any, index: any) => String(index)}
              />
            </View>
          ) : (
            <View style={styles.noDataContainer}>
              {!noData ? (
                <Text style={styles.noDataText}>
                  No Split bill for settle yet.
                </Text>
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
      </View>

      {/* modal for settle bill modal  */}
      <SettleSplitBillCompleteModal
        visibleModal={settleModal}
        onClose={() => {
          setSettleModal(false);
        }}
        onSubmitClick={handleSettleSplitBill}
        settleAmount={settleAmount}
      />

      {/* toaster message for error response from API  */}
      <CommonToast ref={toastRef} />
    </View>
  );
};

export default SettleSplitBill;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {
    height: '90%',
    padding: 10,
  },
  direction: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
  },
  spendContainer: {
    backgroundColor: colors.BLACK3,
    borderRadius: 15,
    padding: 5,
    paddingHorizontal: 20,
    width: '100%',
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
    bottom: -18,
    height: 90,
    position: 'absolute',
    right: -18,
    width: 90,
    zIndex: 1,
  },
  image: {
    height: '100%',
    width: '100%',
    opacity: 0.2,
  },
  settleContainer: {
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 30,
    zIndex: 2,
  },
  settleText: {
    color: colors.WHITE,
    fontSize: 13,
    fontWeight: '500',
    paddingHorizontal: 15,
    paddingVertical: 6,
  },
  settleContainerDisable: {
    backgroundColor: colors.textGray,
    borderRadius: 30,
    zIndex: 2,
  },
  searchBoxContainer: {
    flexDirection: 'row',
    height: 65,
    justifyContent: 'space-between',
    paddingVertical: 10,
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
    height: '90%',
    justifyContent: 'center',
  },
  noDataContainer: {
    alignItems: 'center',
    height: '90%',
    justifyContent: 'center',
  },
  noDataText: {
    color: colors.WHITE,
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
});
