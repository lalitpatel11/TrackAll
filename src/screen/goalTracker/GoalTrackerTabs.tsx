import * as Progress from 'react-native-progress';
import React from 'react';
import {colors} from '../../constants/ColorConstant';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const GoalTrackerTabs = ({
  item,
  onTabClick,
}: {
  item: any;
  onTabClick: Function;
}) => {
  let percent = item?.percentage / 100;

  return (
    <TouchableOpacity
      style={styles.amountPercentContainer}
      onPress={() => {
        onTabClick(item?.goalId);
      }}>
      <View style={styles.amountContainer}>
        <Text style={styles.titleText} numberOfLines={1}>
          {item?.name}
        </Text>

        <View style={styles.direction}>
          <Image
            resizeMode="contain"
            tintColor={colors.WHITE}
            style={styles.iconStyle}
            source={require('../../assets/pngImage/sparkler.png')}
          />

          {item?.percentage < 100 ? (
            <Text style={styles.titleText}>Goal not achieved</Text>
          ) : (
            <Text style={styles.titleText}>Goal achieved</Text>
          )}
        </View>

        <LinearGradient
          colors={['#ED933C', '#E15132']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.goalContainer}>
          <Text style={styles.goalText}>{item?.totalcompletedstatus}</Text>
        </LinearGradient>

        <View style={{paddingBottom: 5}}>
          {item?.percentage <= 25 && item?.percentage >= 0 ? (
            <Progress.Bar progress={percent} width={150} color={colors.GREEN} />
          ) : item?.percentage <= 50 && item?.percentage > 25 ? (
            <Progress.Bar
              progress={percent}
              width={150}
              color={colors.YELLOW}
            />
          ) : item?.percentage <= 75 && item?.percentage > 50 ? (
            <Progress.Bar progress={percent} width={150} color={colors.AMBER} />
          ) : item?.percentage <= 100 && item?.percentage > 75 ? (
            <Progress.Bar progress={percent} width={150} color={colors.RED} />
          ) : (
            <Progress.Bar progress={percent} width={150} color={colors.RED} />
          )}

          <Text style={styles.titleText}> {item?.percentage}% Completed</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default GoalTrackerTabs;

const styles = StyleSheet.create({
  amountPercentContainer: {
    backgroundColor: colors.BLACK2,
    borderRadius: 15,
    height: 'auto',
    justifyContent: 'center',
    marginRight: 10,
    paddingLeft: 10,
    paddingVertical: 10,
    width: '48%',
    alignItems: 'center',
    marginVertical: 5,
  },
  amountContainer: {
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  titleText: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    paddingVertical: 5,
  },
  direction: {
    flexDirection: 'row',
  },
  iconStyle: {
    height: 25,
    marginRight: 10,
    width: 25,
  },
  percentText: {
    color: colors.THEME_ORANGE,
    fontSize: 26,
    fontWeight: '500',
    paddingVertical: 5,
  },
  percentContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
  },
  goalContainer: {
    width: 90,
    height: 'auto',
    borderColor: colors.WHITE,
    borderRadius: 30,
    borderWidth: 2,
    marginVertical: 15,
    alignSelf: 'flex-start',
  },
  goalText: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
});
