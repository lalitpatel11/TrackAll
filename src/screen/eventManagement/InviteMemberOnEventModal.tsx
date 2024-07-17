// external imports
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Divider} from 'react-native-paper';
import {Formik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// internal imports
import AllMembersTab from '../groups/AllMembersTab';
import CommonToast from '../../constants/CommonToast';
import GroupServices from '../../service/GroupServices';
import SubmitButton from '../../constants/SubmitButton';
import {colors} from '../../constants/ColorConstant';
import {searchMemberValidation} from '../../constants/SchemaValidation';

const InviteMemberOnEventModal = ({
  onClose,
  onSubmitClick,
  selectedMembersId,
  visibleModal,
}: {
  onClose: Function;
  onSubmitClick: Function;
  selectedMembersId?: number[];
  visibleModal: boolean;
}) => {
  const [allMembersData, setAllMembersData] = useState<any[]>([]);
  const [arrayList, setArrayList] = useState<any[]>([]);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [checked, setChecked] = useState(true);
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState('');
  const [searchBox, setSearchBox] = useState(false);
  const toastRef = useRef<any>();

  useEffect(() => {
    getAllMembers('');
    setAllMembersData([]);
    setSearchBox(false);
    setMessage('');
    if (selectedMembersId) {
      setArrayList(selectedMembersId);
    }
  }, [visibleModal]);

  // function for get all members data with searching on api call
  const getAllMembers = (text: any) => {
    let data = {
      search: text.trim(),
    };
    setLoader(true);
    GroupServices.postAllMembers(data)
      .then((response: any) => {
        setLoader(false);
        setAllMembersData(response.data.allmembers);
      })
      .catch((error: any) => {
        console.log(error);
        setLoader(false);
      });
  };

  // list for all previously added members
  const renderAddedMembers = ({item}: {item: any; index: any}) => {
    return (
      <AllMembersTab
        item={item}
        handleChecked={handleChecked}
        checked={checked}
        checkedList={arrayList}
      />
    );
  };

  // function on select members click
  const handleChecked = (selectedId: number, selectedData: any) => {
    setChecked(true);
    if (arrayList.includes(selectedId)) {
      setArrayList(arrayList.filter(ids => ids !== selectedId));
    } else {
      setArrayList([...arrayList, selectedId]);
    }
  };

  // function for submit button click for api call to invite the user on event
  const onSubmit = (values: any) => {
    Keyboard.dismiss();
    setButtonLoader(true);
    var data = {
      email: values.email,
      firstname: values.firstName,
      lastname: values.secondName,
    };

    GroupServices.postInviteUser(data)
      .then((response: any) => {
        setButtonLoader(false);
        if (response.data.status === 0) {
          setMessage(response.data.message);
        } else {
          setMessage(response.data.message);
          getAllMembers(''); //for refresh all member list
        }
      })
      .catch((error: any) => {
        setButtonLoader(false);
        console.log(error);
      });
  };

  const initialValues = {
    email: '',
    firstName: '',
    secondName: '',
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={styles.body}>
        <Formik
          validationSchema={searchMemberValidation}
          initialValues={initialValues}
          onSubmit={values => {
            onSubmit(values);
          }}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldTouched,
          }) => (
            <Modal
              animationType="fade"
              transparent={true}
              visible={visibleModal}
              onRequestClose={() => {
                onClose();
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalViewEmailId}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    {/* cross button section  */}
                    <TouchableOpacity
                      style={styles.crossContainer}
                      onPress={() => {
                        onClose();
                      }}>
                      <Image
                        style={styles.image}
                        resizeMode="contain"
                        source={require('../../assets/pngImage/cross.png')}
                      />
                    </TouchableOpacity>

                    <View style={styles.imageContainer}>
                      <Image
                        resizeMode="contain"
                        source={require('../../assets/pngImage/memberEmailId.png')}
                      />
                    </View>
                    {/* user invite section  */}
                    <Text style={styles.groupLabel}>Enter Member Email ID</Text>
                    <TextInput
                      placeholder="Johndoe@gmail.com"
                      placeholderTextColor={colors.textGray}
                      style={styles.textInput}
                      onChangeText={handleChange('email')}
                      onBlur={() => {
                        handleBlur('email');
                        setFieldTouched('email');
                      }}
                      value={values.email.trim()}
                    />

                    <Text style={styles.errorMessage}>
                      {touched.email && errors.email}
                    </Text>

                    <View style={styles.direction}>
                      {/* first name section */}
                      <View style={styles.nameInputContainer}>
                        <TextInput
                          style={styles.nameInput}
                          placeholder="John"
                          placeholderTextColor={colors.textGray}
                          onChangeText={handleChange('firstName')}
                          onBlur={() => {
                            handleBlur('firstName');
                            setFieldTouched('firstName');
                          }}
                          value={values.firstName.trim()}
                        />

                        <Text style={styles.errorMessage}>
                          {touched.firstName && errors.firstName}
                        </Text>
                      </View>

                      {/* second name section */}
                      <View style={styles.nameInputContainer}>
                        <TextInput
                          style={styles.nameInput}
                          placeholder="Doe"
                          placeholderTextColor={colors.textGray}
                          onChangeText={handleChange('secondName')}
                          onBlur={() => {
                            handleBlur('secondName');
                            setFieldTouched('secondName');
                          }}
                          value={values.secondName.trim()}
                        />

                        <Text style={styles.errorMessage}>
                          {touched.secondName && errors.secondName}
                        </Text>
                      </View>
                    </View>

                    {/* invite button section  */}
                    <View style={styles.buttonContainer}>
                      <SubmitButton
                        loader={buttonLoader}
                        submitButton={() => {
                          handleSubmit();
                        }}
                        buttonText={'Share'}
                      />
                    </View>

                    <View>
                      {message !== '' ? (
                        <Text style={styles.successMessage}>{message}</Text>
                      ) : (
                        <Text style={styles.successMessage} />
                      )}
                    </View>

                    <Divider style={styles.divider} />

                    <View>
                      <View style={styles.searchLabelContainer}>
                        <Text style={styles.addedMemberLabel}>
                          Listed Members
                        </Text>

                        <TouchableOpacity
                          style={styles.searchContainer}
                          onPress={() => setSearchBox(true)}>
                          <Image
                            resizeMode="contain"
                            source={require('../../assets/pngImage/searchIcon.png')}
                          />
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.addedMemberNote}>
                        Please select members from the list to add to the group
                      </Text>

                      {/* display search box on search icon click  */}
                      {searchBox ? (
                        <TextInput
                          placeholder="Search By Member Name"
                          placeholderTextColor={colors.textGray}
                          style={styles.textInput}
                          onChangeText={text => {
                            getAllMembers(text);
                          }}
                        />
                      ) : null}

                      {/*recently added members  */}
                      {!loader ? (
                        allMembersData?.length > 0 ? (
                          <FlatList
                            data={allMembersData}
                            renderItem={renderAddedMembers}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item: any, index: any) =>
                              String(index)
                            }
                          />
                        ) : (
                          <View style={styles.noMembersContainer}>
                            <Text style={styles.noMembersText}>
                              No Members Available
                            </Text>
                          </View>
                        )
                      ) : (
                        <View style={styles.loaderContainer}>
                          <ActivityIndicator
                            size="large"
                            color={colors.THEME_ORANGE}
                          />
                        </View>
                      )}
                    </View>

                    <View style={styles.buttonContainer}>
                      <SubmitButton
                        submitButton={() => {
                          onSubmitClick(arrayList);
                        }}
                        buttonText={'Share'}
                      />
                    </View>
                  </ScrollView>
                </View>
              </View>

              {/* toaster message for error response from API  */}
              <CommonToast ref={toastRef} />
            </Modal>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

export default InviteMemberOnEventModal;

const styles = StyleSheet.create({
  container: {flex: 1},
  body: {flex: 1, padding: 5},
  centeredView: {
    backgroundColor: 'rgba(0, 0, 0, 0.66)',
    flex: 1,
    justifyContent: 'center',
  },
  modalViewEmailId: {
    backgroundColor: colors.BLACK2,
    borderRadius: 30,
    elevation: 5,
    margin: 10,
    padding: 20,
  },
  imageContainer: {
    alignSelf: 'center',
    height: 150,
    justifyContent: 'center',
    marginBottom: 10,
    width: 190,
  },
  groupLabel: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '500',
    paddingVertical: 10,
  },
  textInput: {
    backgroundColor: colors.BLACK3,
    borderColor: colors.brightGray,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.WHITE,
    fontSize: 16,
    padding: 10,
  },
  direction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  nameInputContainer: {
    borderRadius: 8,
    height: 50,
    width: '48%',
  },
  nameInput: {
    backgroundColor: colors.BLACK3,
    borderColor: colors.brightGray,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.WHITE,
    fontSize: 16,
    padding: 10,
  },
  addedMemberLabel: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '500',
    paddingVertical: 5,
  },
  addedMemberNote: {
    color: colors.WHITE,
    fontSize: 14,
  },
  buttonContainer: {marginTop: 15},
  searchContainer: {
    alignItems: 'center',
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 10,
    justifyContent: 'center',
    width: '10%',
  },
  searchLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  errorMessage: {
    color: colors.RED,
  },
  inviteUserContainer: {
    alignSelf: 'center',
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 10,
    justifyContent: 'center',
    width: '28%',
  },
  inviteUserText: {
    color: colors.WHITE,
    fontSize: 15,
    fontWeight: '500',
    paddingVertical: 5,
    textAlign: 'center',
  },
  successMessage: {
    color: colors.GREEN,
    fontSize: 16,
    fontWeight: '500',
    padding: 5,
    textAlign: 'center',
    width: '100%',
  },
  crossContainer: {
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 50,
    height: 30,
    position: 'absolute',
    right: 0,
    top: 0,
    width: 30,
    zIndex: 1,
  },
  image: {
    borderRadius: 50,
    height: '100%',
    width: '100%',
  },
  loaderContainer: {
    alignSelf: 'center',
    height: 50,
    justifyContent: 'center',
  },
  noMembersContainer: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noMembersText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
    padding: 20,
  },
  divider: {
    backgroundColor: colors.GRAY,
    height: 2,
    marginVertical: 10,
  },
});
