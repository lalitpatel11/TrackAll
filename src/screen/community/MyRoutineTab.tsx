// external imports
import React, {useCallback, useState} from 'react';
import moment from 'moment';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
// internal imports
import {colors} from '../../constants/ColorConstant';

const MyRoutineTab = ({
  item,
  onTabClick,
}: {
  item: any;
  onTabClick: Function;
}) => {
  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"

  //To toggle the show text or hide it
  const toggleNumberOfLines = () => {
    setTextShown(!textShown);
  };

  const onTextLayout = useCallback((e: any) => {
    setLengthMore(e.nativeEvent.lines.length >= 2); //to check the text is more than 2 lines or not
  }, []);

  return (
    <TouchableOpacity
      onPress={() => {
        onTabClick(item.routineid);
      }}
      style={styles.container}>
      <View style={styles.preferenceContainer}>
        <View style={styles.preferenceIcon}>
          <Image
            style={{height: 25, width: 25}}
            resizeMode="contain"
            source={{
              uri: `${item?.preferenceicon}`,
            }}
          />
        </View>
        <Text style={styles.preferenceTitle}>{item?.preferencename}</Text>
        <Text style={styles.date}>
          {moment(item.date).format('MM-DD-YYYY')}
        </Text>
      </View>

      {item?.routinetype ? (
        <Text style={styles.routineType}>({item?.routinetype})</Text>
      ) : null}

      <View style={styles.routineContainer}>
        <Text style={styles.routineTitle}>{item.routinename}</Text>
        <Text style={styles.routineSubTitle}>{item.routinesubtitle}</Text>
      </View>

      {/* description section on basis of read more and read less */}
      <View style={styles.descriptionContainer}>
        <Text
          style={styles.descriptionText}
          onTextLayout={onTextLayout}
          numberOfLines={textShown ? undefined : 2}>
          {item?.description}
        </Text>
        {lengthMore ? (
          <Text onPress={toggleNumberOfLines} style={styles.readMoreText}>
            {textShown ? 'View less...' : 'View more...'}
          </Text>
        ) : null}
      </View>

      {/* background image section  */}
      <View style={styles.backgroundImageContainer}>
        <Image
          style={styles.image}
          tintColor={colors.lightOrange}
          resizeMode="contain"
          source={require('../../assets/pngImage/communityBackground.png')}
        />
      </View>
    </TouchableOpacity>
  );
};

export default MyRoutineTab;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK3,
    borderLeftColor: colors.THEME_ORANGE,
    borderLeftWidth: 3,
    borderRadius: 15,
    borderStyle: 'solid',
    margin: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  preferenceContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  preferenceIcon: {
    alignItems: 'center',
    backgroundColor: colors.brightGray,
    borderRadius: 5,
    height: 33,
    justifyContent: 'center',
    width: 33,
  },
  preferenceTitle: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '400',
    paddingHorizontal: 8,
    width: '70%',
  },
  routineType: {
    color: colors.THEME_ORANGE,
    fontSize: 16,
    paddingVertical: 3,
    width: '70%',
  },
  date: {
    color: colors.THEME_WHITE,
    fontSize: 11,
    fontWeight: '400',
    width: '20%',
    zIndex: 1,
  },
  routineContainer: {
    height: 'auto',
    paddingVertical: 10,
    width: '80%',
  },
  routineTitle: {
    color: colors.THEME_ORANGE,
    fontSize: 18,
    fontWeight: '500',
  },
  routineSubTitle: {
    color: colors.THEME_WHITE,
    fontSize: 16,
    fontWeight: '500',
  },
  image: {
    borderRadius: 50,
    height: '100%',
    opacity: 0.3,
    width: '100%',
  },
  backgroundImageContainer: {
    bottom: 0,
    height: 90,
    position: 'absolute',
    right: 10,
    width: 90,
  },
  descriptionContainer: {
    height: 'auto',
    paddingVertical: 3,
  },
  descriptionText: {color: colors.WHITE},
  readMoreText: {
    color: colors.THEME_ORANGE,
    fontWeight: '500',
    lineHeight: 21,
    width: '35%',
  },
});
