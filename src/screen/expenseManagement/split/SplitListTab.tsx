// external imports
import React, {useCallback, useState} from 'react';
import moment from 'moment';
import {View, Text, StyleSheet, Image} from 'react-native';
// internal imports
import {colors} from '../../../constants/ColorConstant';

const SplitListTab = ({items}: {items: any}) => {
  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"

  //To toggle the show text or hide it
  const toggleNumberOfLines = () => {
    setTextShown(!textShown);
  };

  const onTextLayout = useCallback((e: any) => {
    setLengthMore(e.nativeEvent.lines.length >= 2); //to check the text is more than 2 lines or not
  }, []);

  // change date formate
  const date = moment(items?.expense_date).format('MMM DD, YYYY');
  return (
    <View style={styles.container}>
      <View style={styles.direction}>
        {/* image section */}
        <View style={styles.imageContainer}>
          <Image
            resizeMode="contain"
            source={
              items?.images
                ? {uri: `${items?.images[0]?.image}`}
                : require('../../../assets/pngImage/dollar.png')
            }
            style={styles.image}
          />
        </View>

        <View style={styles.nameContainer}>
          {/* title and amount section */}
          <View style={styles.nameDirection}>
            <Text style={styles.splitTitle}>{items?.title}</Text>
            <Text style={styles.amountText}>${items?.amount}</Text>
          </View>

          <View style={styles.nameDirection}>
            <Text style={styles.dateText}>{date}</Text>
            <Text style={styles.settleText}>{items?.settled}</Text>
          </View>

          {/* description section on basis of read more and read less */}
          <View style={styles.descriptionContainer}>
            <Text
              style={styles.descriptionText}
              onTextLayout={onTextLayout}
              numberOfLines={textShown ? undefined : 2}>
              {items?.description}
            </Text>
            {lengthMore ? (
              <Text onPress={toggleNumberOfLines} style={styles.readMoreText}>
                {textShown ? 'View less...' : 'View more...'}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
};

export default SplitListTab;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK3,
    borderRadius: 15,
    elevation: 5,
    flex: 1,
    height: 'auto',
    marginVertical: 5,
    padding: 10,
  },
  direction: {flexDirection: 'row'},
  imageContainer: {
    backgroundColor: colors.GRAY,
    borderRadius: 50,
    height: 45,
    width: 45,
  },
  image: {
    borderRadius: 50,
    height: '100%',
    width: '100%',
  },
  nameContainer: {
    paddingHorizontal: 5,
    width: '85%',
  },
  nameDirection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  splitTitle: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '500',
    width: '80%',
  },
  amountText: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '500',
  },
  dateText: {
    color: colors.textGray,
    fontSize: 14,
    fontWeight: '500',
    paddingVertical: 3,
  },
  descriptionContainer: {
    height: 'auto',
  },
  descriptionText: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '400',
  },
  readMoreText: {
    color: colors.THEME_ORANGE,
    fontWeight: '500',
    lineHeight: 21,
    width: '35%',
  },
  settleText: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
    fontWeight: '500',
  },
});
