//external imports
import React from 'react';
import {Divider} from 'react-native-paper';
import {View, Text, StyleSheet, Image} from 'react-native';
//internal imports
import SubmitButton from '../../constants/SubmitButton';
import {colors} from '../../constants/ColorConstant';

const SubscriptionPlanTab = ({
  currentPlan,
  item,
  submitButtonClick,
}: {
  currentPlan: any;
  item: any;
  submitButtonClick: Function;
}) => {
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.planTitle}>{item?.name}</Text>

        {/* divider */}
        <Divider style={styles.dividerStyle} />

        <View style={styles.descriptionContainer}>
          <View style={styles.direction}>
            <Image
              resizeMode="contain"
              source={require('../../assets/pngImage/CheckCircle.png')}
            />
            <Text style={styles.descriptionText}>{item?.user_invites}</Text>
          </View>

          <View style={styles.direction}>
            <Image
              resizeMode="contain"
              source={require('../../assets/pngImage/CheckCircle.png')}
            />
            <Text style={styles.descriptionText}>{item?.group}</Text>
          </View>
        </View>

        {/* divider */}
        <Divider style={styles.dividerStyle} />

        <Text style={styles.priceText}>({item?.price})</Text>
      </View>

      {/* button section */}
      <View style={styles.buttonContainer}>
        {currentPlan !== item?.price ? (
          <SubmitButton
            buttonText={'Upgrade Plan'}
            submitButton={() => {
              submitButtonClick(item?.planid);
            }}
          />
        ) : null}
      </View>
    </>
  );
};

export default SubscriptionPlanTab;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    backgroundColor: colors.BLACK3,
    borderRadius: 50,
    height: 270,
    width: 310,
  },
  planTitle: {
    color: colors.WHITE,
    fontSize: 25,
    fontWeight: '300',
    paddingVertical: 10,
    textAlign: 'center',
  },
  descriptionContainer: {
    height: 120,
    padding: 10,
  },
  dividerStyle: {
    backgroundColor: colors.orange,
    height: 2,
    margin: 10,
  },
  direction: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  descriptionText: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '300',
    padding: 6,
  },
  priceText: {
    color: colors.lightOrange,
    fontSize: 22,
    fontWeight: '500',
    paddingVertical: 8,
    textAlign: 'center',
  },
  buttonContainer: {
    marginVertical: 5,
    padding: 20,
  },
});
