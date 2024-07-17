// external imports
import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
// internal imports
import {colors} from '../../constants/ColorConstant';

const SavedEftExpanse = ({
  handleSelectCard,
  items,
  selectedCard,
}: {
  handleSelectCard: Function;
  items: any;
  selectedCard: string;
}) => {
  return (
    <>
      <TouchableOpacity
        style={styles.radioDirection}
        onPress={() => {
          handleSelectCard(items);
        }}>
        <View
          style={
            items?.bankname === selectedCard
              ? styles.selectedRadio
              : styles.unSelectedRadio
          }>
          <View
            style={
              items?.bankname === selectedCard ? styles.selectedRadioFill : null
            }
          />
        </View>
        <Text style={styles.cardName}>
          {items?.bankname}: {items?.accountnumber}
        </Text>
      </TouchableOpacity>
    </>
  );
};

export default SavedEftExpanse;

const styles = StyleSheet.create({
  radioDirection: {
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 20,
  },
  unSelectedRadio: {
    alignItems: 'center',
    borderColor: colors.WHITE,
    borderRadius: 12,
    borderWidth: 2,
    height: 24,
    justifyContent: 'center',
    marginHorizontal: 3,
    width: 24,
  },
  selectedRadio: {
    alignItems: 'center',
    borderColor: colors.THEME_ORANGE,
    borderRadius: 12,
    borderWidth: 2,
    height: 24,
    justifyContent: 'center',
    marginHorizontal: 3,
    width: 24,
  },
  selectedRadioFill: {
    alignItems: 'center',
    backgroundColor: colors.THEME_ORANGE,
    borderColor: colors.WHITE,
    borderRadius: 12,
    borderWidth: 2,
    height: 20,
    justifyContent: 'center',
    marginHorizontal: 3,
    width: 20,
  },
  cardName: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '400',
    paddingHorizontal: 5,
  },
});
