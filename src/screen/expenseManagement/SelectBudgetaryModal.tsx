//external imports
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
//internal imports
import CommonToast from '../../constants/CommonToast';
import SubmitButton from '../../constants/SubmitButton';
import {colors} from '../../constants/ColorConstant';
import ExpensesManagementService from '../../service/ExpensesManagementService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SelectBudgetary from './SelectBudgetary';

const SelectBudgetaryModal = ({
  onClose,
  onAddCLick,
  visibleModal,
  expenseId,
  navigation,
  onAddBudgetClick,
}: {
  onClose: Function;
  onAddCLick: Function;
  visibleModal: boolean;
  expenseId: string;
  navigation: any;
  onAddBudgetClick: Function;
}) => {
  const [loader, setLoader] = useState(false);
  const [allBudget, setAllBudget] = useState([]);
  const toastRef = useRef<any>();
  const [checked, setChecked] = useState(true);
  const [arrayList, setArrayList] = useState<any[]>([]);

  useEffect(() => {
    getData();
  }, [visibleModal]);

  const getData = async () => {
    const accountId = await AsyncStorage.getItem('accountId');
    const userType = await AsyncStorage.getItem('userType');

    if (userType == '2') {
      const data = {
        expenseid: expenseId,
        accountId: accountId,
      };
      ExpensesManagementService.postListAllBudget(data)
        .then((response: any) => {
          setLoader(false);
          if (response.data.status === 1) {
            setAllBudget(response.data.allbudgets);
          } else if (response.data.status === 0) {
            setAllBudget(response.data.allbudgets);
          }
        })
        .catch((error: any) => {
          setLoader(false);
          console.log(error, 'error');
        });
    } else {
      const data = {
        expenseid: expenseId,
      };
      ExpensesManagementService.postListAllBudget(data)
        .then((response: any) => {
          setLoader(false);
          if (response.data.status === 1) {
            setAllBudget(response.data.allbudgets);
          } else if (response.data.status === 0) {
            setAllBudget(response.data.allbudgets);
          }
        })
        .catch((error: any) => {
          setLoader(false);
          console.log(error, 'error');
        });
    }
  };

  const renderAddedBudgetary = ({item}: {item: any; index: any}) => {
    return (
      <SelectBudgetary
        items={item}
        checked={checked}
        checkedList={arrayList}
        handleChecked={handleChecked}
      />
    );
  };

  // function on select preferences click
  const handleChecked = async (selectedId: number) => {
    setChecked(true);
    setArrayList([selectedId]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={styles.body}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={visibleModal}
          onRequestClose={() => {
            onClose();
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalViewGroup}>
              {/* cross button section  */}
              <TouchableOpacity
                style={styles.crossContainer}
                onPress={() => {
                  onClose();
                }}>
                <Image
                  style={styles.imageStyle}
                  resizeMode="contain"
                  source={require('../../assets/pngImage/cross.png')}
                />
              </TouchableOpacity>

              {/* budget list */}
              {allBudget?.length > 0 ? (
                <View style={{height: 530}}>
                  <Text style={styles.heading}>Select Budget</Text>
                  <FlatList
                    data={allBudget}
                    renderItem={renderAddedBudgetary}
                    keyExtractor={(item: any, index: any) => String(index)}
                  />
                  {/* button with loader  */}
                  <View style={styles.buttonContainer}>
                    <SubmitButton
                      loader={loader}
                      submitButton={() => {
                        onAddCLick(arrayList);
                      }}
                      buttonText={'Add'}
                    />
                  </View>
                </View>
              ) : (
                <View>
                  <Text style={styles.heading}>
                    No budget available. Click on Add Budget to add budget.
                  </Text>
                  <View style={styles.buttonContainer}>
                    <SubmitButton
                      loader={loader}
                      submitButton={() => {
                        onAddBudgetClick();
                      }}
                      buttonText={'Add Budget'}
                    />
                  </View>
                </View>
              )}
              {/* </View> */}
            </View>
          </View>
        </Modal>

        {/* toaster message for error response from API  */}
        <CommonToast ref={toastRef} />
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

export default SelectBudgetaryModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    padding: 5,
  },
  centeredView: {
    backgroundColor: 'rgba(0, 0, 0, 0.66)',
    flex: 1,
    justifyContent: 'center',
  },
  modalViewGroup: {
    backgroundColor: colors.BLACK2,
    borderRadius: 30,
    padding: 20,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  heading: {
    color: colors.WHITE,
    fontSize: 18,
    paddingVertical: 10,
    fontWeight: '500',
  },
  buttonContainer: {paddingTop: 10},
  crossContainer: {
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 50,
    height: 30,
    position: 'absolute',
    right: 15,
    top: 10,
    width: 30,
    zIndex: 1,
  },
  imageStyle: {
    borderRadius: 10,
    height: '100%',
    width: '100%',
  },
  addBudgetaryContainer: {
    alignItems: 'center',
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 8,
    height: 60,
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 30,
  },
  addBudgetaryText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
  },
});
