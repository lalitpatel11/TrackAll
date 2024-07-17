//external imports
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
//internal imports
import CommonToast from '../../constants/CommonToast';
import CustomHeader from '../../constants/CustomHeader';
import OrganizationEmployee from './OrganizationEmployee';
import OrganizationService from '../../service/OrganisationService';
import {colors} from '../../constants/ColorConstant';

const AllOrganizationEmployee = ({navigation}: {navigation: any}) => {
  const [employeeList, setEmployeeList] = useState([]);
  const [noData, setNoData] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [searchText, setSearchText] = useState('');
  const toastRef = useRef<any>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setSearchText('');
      setPageLoader(true);
      getData();
    });
    return unsubscribe;
  }, [navigation]);

  const getData = () => {
    // function for get all my group data on api call
    OrganizationService.postAllEmployeeList()
      .then((response: any) => {
        setPageLoader(false);
        setEmployeeList(response?.data?.employess);
      })
      .catch((error: any) => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // function for search all my group data on api call
  const searchGroup = (text: string) => {
    setPageLoader(true);

    const body = {
      search: text,
    };
    OrganizationService.postSearchAllEmployeeList(body)
      .then((response: any) => {
        if (response?.data?.employess?.length > 0) {
          setNoData(false);
          setEmployeeList(response?.data?.employess);
          setPageLoader(false);
        } else {
          setEmployeeList(response?.data?.employess);
          setPageLoader(false);
          setNoData(true);
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  //   // navigation on group details page after create group
  //   const onGroupCreateClick = (groupDetails: any) => {
  //     setCreateGroupVisible(!createGroupVisible);
  //     navigation.navigate('StackNavigation', {
  //       screen: 'GroupDetails',
  //       params: {
  //         data: groupDetails?.groupid,
  //       },
  //     });
  //   };

  // list for my group
  const renderGroupsItems = ({item}: {item: any; index: any}) => {
    return (
      <OrganizationEmployee
        items={item}
        navigation={navigation}
        onTabClick={handleTabClick}
      />
    );
  };

  // navigation on employee tab click
  const handleTabClick = (data: any) => {
    navigation.navigate('StackNavigation', {
      screen: 'EmployeeDetailsOnOrganization',
      params: {
        data: data,
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'All Employee'}
        backButton={{
          visible: true,
          onClick: () => {
            navigation.goBack();
          },
        }}
      />
      {/* search box */}
      <View style={styles.searchBoxContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Search by Name, Department and Designation"
            placeholderTextColor={colors.textGray}
            style={styles.searchInput}
            value={searchText}
            onChangeText={text => {
              setSearchText(text);
              searchGroup(text);
            }}
          />
        </View>
        <View style={styles.searchContainer}>
          <Image
            resizeMode="contain"
            source={require('../../assets/pngImage/searchIcon.png')}
          />
        </View>
      </View>

      {/* body section */}
      {!pageLoader ? (
        employeeList?.length > 0 ? (
          <View style={styles.body}>
            {/* my groups list  */}
            <View style={{height: '90%'}}>
              <FlatList
                data={employeeList}
                scrollEnabled={true}
                renderItem={renderGroupsItems}
                listKey={'myGroupList'}
                keyExtractor={(item: any, index: any) => String(index)}
              />
            </View>
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            {!noData ? (
              <Text style={styles.noDataText}>No employee added yet.</Text>
            ) : (
              <Text style={styles.noDataText}>No result found</Text>
            )}
          </View>
        )
      ) : (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.THEME_ORANGE} />
        </View>
      )}

      {/* toaster message for error response from API  */}
      <CommonToast ref={toastRef} />
    </View>
  );
};

export default AllOrganizationEmployee;

const styles = StyleSheet.create({
  container: {
    backgroundColor:colors.BLACK,
    flex: 1,
  },
  body: {
    padding: 10,
  },
  searchBoxContainer: {
    flexDirection: 'row',
    height: 65,
    justifyContent: 'space-between',
    padding: 10,
  },
  inputContainer: {
    borderRadius: 8,
    width: '84%',
  },
  searchInput: {
    backgroundColor: colors.BLACK3,
    borderRadius: 8,
    color: colors.WHITE,
    fontSize: 14,
    padding: 10,
    paddingLeft: 10,
  },
  searchContainer: {
    alignItems: 'center',
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 10,
    justifyContent: 'center',
    width: '14%',
  },
  loaderContainer: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  noDataContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  noDataText: {
    color: colors.WHITE,
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
});
