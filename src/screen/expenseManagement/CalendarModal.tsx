//external imports
import {Image, Modal, StyleSheet, View} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import React, {useState} from 'react';
//internal imports
import SubmitButton from '../../constants/SubmitButton';
import {colors} from '../../constants/ColorConstant';
import CancelButton from '../../constants/CancelButton';

const CalendarModal = ({
  onClose,
  onSubmitClick,
  visibleModal,
  addedDate,
}: {
  onClose: Function;
  onSubmitClick: Function;
  visibleModal: boolean;
  addedDate?: any;
}) => {
  const [selectedDate, setSelectedDate] = useState(
    addedDate ? new Date(addedDate).toISOString() : new Date(),
  );

  //function : imp func
  const customDayHeaderStylesCallback = (DayOfWeekName: {dayOfWeek: any}) => {
    switch (DayOfWeekName.dayOfWeek) {
      case 7:
        return {
          textStyle: styles.weekEnd,
        };
      default:
        return {};
    }
  };

  // on date change
  const onDateChange = (selectDate: any) => {
    // onClose(selectedDate, type);
    setSelectedDate(selectDate);
  };

  const customDatesStylesCallback = (date: any) => {
    // only weekend styling
    if (date.isoWeekday() === 7) {
      return {
        textStyle: styles.onlyWeekEnd,
      };
    }
    return {};
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
        <View style={styles.centeredView}>
          <View style={styles.modalViewCalendar}>
            <CalendarPicker
              customDayHeaderStyles={customDayHeaderStylesCallback}
              customDatesStyles={customDatesStylesCallback}
              dayLabelsWrapper={styles.days}
              monthTitleStyle={styles.month}
              disabledDatesTextStyle={styles.pastDate}
              nextComponent={
                <View style={styles.nextBtn}>
                  <Image
                    resizeMode="contain"
                    tintColor={colors.WHITE}
                    style={styles.nextImg}
                    source={require('../../assets/pngImage/rightarrow.png')}
                  />
                </View>
              }
              onDateChange={onDateChange}
              previousComponent={
                <View style={styles.previousBtn}>
                  <Image
                    resizeMode="contain"
                    tintColor={colors.WHITE}
                    style={styles.previousImg}
                    source={require('../../assets/pngImage/leftarrow.png')}
                  />
                </View>
              }
              selectedDayStyle={styles.selectedDate}
              selectedDayTextColor={colors.WHITE}
              showDayStragglers={true}
              startFromMonday={true}
              textStyle={styles.allTexts}
              todayBackgroundColor={colors.WHITE}
              todayTextStyle={styles.today}
              yearTitleStyle={styles.year}
              onMonthChange={data => {
                console.log('Changes', data);
              }}
            />

            <View style={styles.buttonSection}>
              {/*save button  */}
              <SubmitButton
                buttonText={'Ok'}
                submitButton={() => {
                  onSubmitClick(selectedDate);
                }}
              />

              {/*Cancel section  */}
              <CancelButton
                buttonText={'Cancel'}
                cancelButton={() => {
                  onClose();
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CalendarModal;

const styles = StyleSheet.create({
  centeredView: {
    backgroundColor: 'rgba(0, 0, 0, 0.66)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalViewCalendar: {
    backgroundColor: colors.BLACK3,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    paddingHorizontal: 30,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  allTexts: {
    color: colors.WHITE,
    fontWeight: '600',
  },
  days: {
    borderBottomWidth: 0,
    borderTopWidth: 0,
  },
  month: {
    color: colors.THEME_ORANGE,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  nextBtn: {
    borderColor: colors.WHITE,
    borderRadius: 5,
    borderWidth: 1,
    marginRight: 25,
    marginTop: 10,
  },
  nextImg: {
    height: 20,
    width: 20,
  },
  onlyWeekEnd: {
    color: colors.RED,
  },
  previousBtn: {
    borderColor: colors.WHITE,
    borderRadius: 5,
    borderWidth: 1,
    marginLeft: 25,
    marginTop: 10,
  },
  previousImg: {
    height: 20,
    width: 20,
  },
  pastDate: {
    color: colors.lightGray,
  },
  selectedDate: {
    backgroundColor: colors.THEME_ORANGE,
    color: colors.BLACK,
  },
  today: {
    color: colors.BLACK,
  },
  weekEnd: {
    color: colors.RED,
  },
  year: {
    color: colors.THEME_ORANGE,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  buttonSection: {paddingTop: 20},
});
