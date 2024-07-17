//external imports
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
//internal imports
import Interests from '../userAuthentication/Interests';
import SubmitButton from '../../constants/SubmitButton';
import UserAuthService from '../../service/UserAuthService';
import {colors} from '../../constants/ColorConstant';

const ChangePreferencesModal = ({
  onClose,
  onSubmitClick,
  preferences,
  visibleModal,
}: {
  onClose: Function;
  onSubmitClick: Function;
  preferences: any[];
  visibleModal: boolean;
}) => {
  const [arrayList, setArrayList] = useState<any[]>([]);
  const [checked, setChecked] = useState(true);
  const [err, setErr] = useState(false);
  const [loader, setLoader] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [preferenceList, setPreferenceList] = useState<any[]>([]);

  useEffect(() => {
    // for pre selected preference list
    let result = preferences.map((e: any) => e.id);
    setArrayList(result);
    setErr(false);
    setPageLoader(true);
    UserAuthService.preferenceList()
      .then((response: any) => {
        setPageLoader(false);
        setPreferenceList(response.data.preferences);
      })
      .catch(error => {
        setPageLoader(false);
        console.log(error);
      });
  }, [visibleModal]);

  // list for interest tab
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

  // function on select interest click
  const handleChecked = async (selectedId: number) => {
    setErr(false);
    setChecked(true);
    if (arrayList.includes(selectedId)) {
      setArrayList(arrayList.filter(ids => ids !== selectedId));
    } else {
      setArrayList([...arrayList, selectedId]);
    }
  };

  // function for submit button click
  const handleSubmit = () => {
    setLoader(true);
    if (arrayList.length > 0) {
      setLoader(false);
      setErr(false);
      onSubmitClick(arrayList);
    } else {
      setErr(true);
      setLoader(false);
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

            <Text style={styles.groupLabel}>Select your preferences</Text>
            {!pageLoader ? (
              <View
                style={{
                  width: '100%',
                  paddingHorizontal: 5,
                  alignSelf: 'center',
                  height: 350,
                }}>
                <FlatList
                  data={preferenceList}
                  renderItem={renderInterestItem}
                  numColumns={3}
                  keyExtractor={(item: any, index: any) => String(index)}
                />
                {err ? (
                  <Text style={styles.errorText}>
                    Please select any preferences.
                  </Text>
                ) : null}
              </View>
            ) : (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={colors.THEME_ORANGE} />
              </View>
            )}

            {/* button with loader  */}
            <View style={styles.buttonContainer}>
              <SubmitButton
                loader={loader}
                submitButton={handleSubmit}
                buttonText={'Save'}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ChangePreferencesModal;

const styles = StyleSheet.create({
  centeredView: {
    backgroundColor: 'rgba(0, 0, 0, 0.66)',
    flex: 1,
    justifyContent: 'center',
  },
  modalViewGroup: {
    backgroundColor: colors.THEME_WHITE,
    borderRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 10,
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
  groupLabel: {
    color: colors.BLACK,
    fontSize: 18,
    fontWeight: '500',
    paddingBottom: 20,
  },
  textInput: {
    backgroundColor: colors.WHITE,
    borderColor: colors.brightGray,
    borderRadius: 8,
    borderWidth: 2,
    color: colors.THEME_BLACK,
    fontSize: 16,
    padding: 15,
  },
  errorMessage: {
    color: colors.RED,
    paddingHorizontal: 10,
  },
  buttonContainer: {paddingTop: 30},
  crossContainer: {
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 50,
    height: 30,
    position: 'absolute',
    right: 15,
    top: 30,
    width: 30,
    zIndex: 1,
  },
  imageStyle: {
    borderRadius: 10,
    height: '100%',
    width: '100%',
  },
  loaderContainer: {
    alignSelf: 'center',
    height: 270,
    justifyContent: 'center',
  },
  errorText: {
    color: colors.RED,
    paddingHorizontal: 10,
  },
});
