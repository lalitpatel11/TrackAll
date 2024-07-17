//external imports
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
//internal imports
import CustomHeader from '../../constants/CustomHeader';
import Interests from '../userAuthentication/Interests';
import SubmitButton from '../../constants/SubmitButton';
import UserAuthService from '../../service/UserAuthService';
import {colors} from '../../constants/ColorConstant';

const CreateRoutine = ({navigation, route}: {navigation: any; route: any}) => {
  const [arrayList, setArrayList] = useState<any[]>([]);
  const [businessId, setBusinessId] = useState(route?.params?.id);
  const [checked, setChecked] = useState(false);
  const [err, setErr] = useState(false);
  const [loader, setLoader] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [preferenceList, setPreferenceList] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setBusinessId(route?.params?.id);
      setPageLoader(true);

      //  api call for get all preference list
      UserAuthService.preferenceList()
        .then((response: any) => {
          setPageLoader(false);
          setPreferenceList(response.data.preferences);
        })
        .catch(error => {
          setPageLoader(false);
          console.log(error);
        });
    });
    return unsubscribe;
  }, [navigation]);

  // list for all preferences
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

  // function on select preferences click
  const handleChecked = async (selectedId: number) => {
    setChecked(true);
    setErr(false);
    setArrayList([selectedId]);
  };

  // function for submit click
  const handleSubmit = () => {
    setLoader(true);
    if (arrayList.length > 0) {
      setLoader(false);
      setErr(false);
      navigation.navigate('StackNavigation', {
        screen: 'CreateRoutineDetails',
        params: {
          preferenceId: arrayList,
          businessId: businessId,
          screenName: route?.params?.screenName,
        },
      });
    } else {
      setErr(true);
      setLoader(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Create Your Routine'}
        backButton={{
          visible: true,
          onClick: () => {
            navigation.goBack();
          },
        }}
      />

      {/* body section */}
      {!pageLoader ? (
        <View style={styles.body}>
          <Text style={styles.focusText}>Select a category:</Text>

          <View
            style={{
              height: '60%',
              alignSelf: 'center',
            }}>
            <FlatList
              data={preferenceList}
              renderItem={renderInterestItem}
              numColumns={3}
              keyExtractor={(item: any, index: any) => String(index)}
            />
          </View>
          {err ? (
            <Text style={styles.errorText}>Please select any prefrence.</Text>
          ) : null}

          <View style={styles.submitButton}>
            <SubmitButton
              loader={loader}
              submitButton={handleSubmit}
              buttonText={'Continue'}
            />
          </View>
        </View>
      ) : (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.THEME_ORANGE} />
        </View>
      )}
    </View>
  );
};

export default CreateRoutine;
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {padding: 10},
  focusText: {
    color: colors.WHITE,
    fontSize: 20,
    fontWeight: '400',
    marginBottom: 20,
    paddingVertical: 10,
  },
  submitButton: {
    marginTop: 50,
  },
  loaderContainer: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  errorText: {
    color: colors.RED,
    paddingHorizontal: 10,
  },
});
