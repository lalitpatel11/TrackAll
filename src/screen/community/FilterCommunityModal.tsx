// external imports
import {
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
import CalendarModal from '../expenseManagement/CalendarModal';
import Interests from '../userAuthentication/Interests';
import SubmitButton from '../../constants/SubmitButton';
import UserAuthService from '../../service/UserAuthService';
import {colors} from '../../constants/ColorConstant';

const FilterCommunityModal = ({
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
  const [arrayList, setArrayList] = useState<any[]>([]);
  const [calendarModal, setCalendarModal] = useState(false);
  const [checked, setChecked] = useState(false);
  const [preferenceList, setPreferenceList] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectDate, setSelectDate] = useState(
    moment(new Date()).format('MM-DD-YYYY'),
  );
  useEffect(() => {
    UserAuthService.preferenceList()
      .then((response: any) => {
        setPreferenceList(response.data.preferences);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }, []);

  // modal close on calender close click
  const handleCalendarModalClose = () => {
    setCalendarModal(false);
  };

  // modal close on calender submit click after select date
  const handleCalendarSubmitClick = (selectDate: string) => {
    setCalendarModal(false);
    setSelectedDate(moment(selectDate).format('YYYY-MM-DD'));
    setSelectDate(moment(selectDate).format('MM-DD-YYYY'));
  };

  // list for all interest tab
  const renderInterestItem = ({item}: {item: any; index: any}) => {
    return (
      <Interests
        interests={item}
        handleChecked={handleChecked}
        checked={checked}
        checkedList={arrayList}
      />
    );
  };

  // function for select interests tab
  const handleChecked = async (selectedId: number) => {
    setChecked(true);
    if (arrayList.includes(selectedId)) {
      setArrayList(arrayList.filter(ids => ids !== selectedId));
    } else {
      setArrayList([...arrayList, selectedId]);
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
            <Text style={styles.headerText}>Filter</Text>
          </View>

          <View style={styles.body}>
            {/* preference list section */}
            <Text style={styles.labelText}>Select Your Interests</Text>
            <View style={styles.preferenceListContainer}>
              <FlatList
                data={preferenceList}
                renderItem={renderInterestItem}
                numColumns={3}
                keyExtractor={(item: any, index: any) => String(index)}
              />
            </View>

            {/* calendar filter section with search box */}
            <Text style={styles.labelText}>Select Date</Text>
            <View style={styles.calendarDateContainer}>
              <TextInput
                editable={false}
                placeholder={'MM-DD-YYYY'}
                placeholderTextColor={colors.THEME_BLACK}
                value={selectDate}
                style={{
                  color: colors.THEME_BLACK,
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
                  source={require('../../assets/pngImage/CalendarBlank1.png')}
                />
              </TouchableOpacity>
            </View>

            {/* button section */}
            <View style={{marginVertical: 20}}>
              <SubmitButton
                buttonText={'Submit'}
                submitButton={() => onSubmitClick(arrayList, selectedDate)}
              />

              {/*Cancel section  */}
              <TouchableOpacity
                style={styles.cancelContainer}
                onPress={() => {
                  setArrayList([]);
                  setSelectedDate('');
                  onResetClick();
                }}>
                <Text style={styles.cancelText}>Reset</Text>
              </TouchableOpacity>
            </View>

            {/* Calender modal  */}
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

export default FilterCommunityModal;

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
  labelText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
    paddingHorizontal: 10,
  },
  preferenceListContainer: {
    alignSelf: 'center',
    height: '55%',
    justifyContent: 'center',
    marginVertical: 10,
  },
  calendarDateContainer: {
    backgroundColor: colors.WHITE,
    borderRadius: 5,
    flexDirection: 'row',
    height: 'auto',
    justifyContent: 'space-between',
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 3,
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
});
