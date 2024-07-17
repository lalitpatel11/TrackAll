//external imports
import {FlatList, Modal, StyleSheet, Text, View} from 'react-native';
import Days from './Days';
import React, {useEffect, useState} from 'react';
//internal imports
import SubmitButton from '../../constants/SubmitButton';
import {colors} from '../../constants/ColorConstant';
import CancelButton from '../../constants/CancelButton';

const CustomModal = ({
  daysList,
  onClose,
  onSubmitClick,
  visibleModal,
}: {
  daysList?: any;
  onClose: Function;
  onSubmitClick: Function;
  visibleModal: boolean;
}) => {
  const [arrayList, setArrayList] = useState<any[]>([]);
  const [checked, setChecked] = useState(true);

  useEffect(() => {
    if (daysList?.length >= 1) {
      setArrayList(daysList);
    }
  }, [visibleModal]);

  const WEEKDAYS = [
    {id: 1, days: 'M', value: 'M'},
    {id: 2, days: 'T', value: 'T'},
    {id: 3, days: 'W', value: 'W'},
    {id: 4, days: 'Th', value: 'TH'},
    {id: 5, days: 'F', value: 'F'},
    {id: 6, days: 'Sa', value: 'SA'},
    {id: 7, days: 'Su', value: 'SU'},
  ];

  // list for custom days
  const renderDays = ({item}: {item: any; index: any}) => {
    return (
      <Days
        item={item}
        handleChecked={handleChecked}
        checked={checked}
        checkedList={arrayList}
      />
    );
  };

  // function on select days
  const handleChecked = (selectedId: number) => {
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
        <View style={styles.centeredView}>
          <View style={styles.modalViewCustom}>
            <Text style={styles.customText}>Custom</Text>
            {/* days list  */}
            <View style={styles.daysContainer}>
              <FlatList
                data={WEEKDAYS}
                renderItem={renderDays}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item: any, index: any) => String(index)}
              />
            </View>

            {/*save button  */}
            <SubmitButton
              buttonText={'Ok'}
              submitButton={() => {
                onSubmitClick(arrayList);
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
      </Modal>
    </View>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  centeredView: {
    backgroundColor: 'rgba(0, 0, 0, 0.66)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalViewCustom: {
    backgroundColor: colors.BLACK3,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    paddingHorizontal: 30,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  customText: {
    color: colors.WHITE,
    fontSize: 22,
    paddingVertical: 15,
  },
  daysContainer: {
    height: 100,
    justifyContent: 'center',
  },
});
