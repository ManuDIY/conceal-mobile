import React, { useContext } from 'react';
import { Icon, Header, Overlay } from 'react-native-elements';
import NavigationService from '../helpers/NavigationService';
import ConcealTextInput from '../components/ccxTextInput';
import ConcealButton from '../components/ccxButton';
import { AppContext } from '../components/ContextProvider';
import EStyleSheet from 'react-native-extended-stylesheet';
import { maskAddress } from '../helpers/utils';
import AppStyles from '../components/Style';
import { AppColors } from '../constants/Colors';
import { getAspectRatio } from '../helpers/utils';
import {
  Alert,
  Text,
  View,
  FlatList,
  Clipboard
} from 'react-native';

readLabelromClipboard = async () => {
  const clipboardContent = await Clipboard.getString();
  setAppData({
    addressEntry: {
      label: clipboardContent
    }
  });
};

readAddressFromClipboard = async () => {
  const clipboardContent = await Clipboard.getString();
  setAppData({
    addressEntry: {
      address: clipboardContent
    }
  });
};

readPaymentIdFromClipboard = async () => {
  const clipboardContent = await Clipboard.getString();
  setAppData({
    addressEntry: {
      paymentId: clipboardContent
    }
  });
};

const AddressBook = () => {
  const { actions, state } = useContext(AppContext);
  const { deleteContact, setAppData } = actions;
  const { layout, user } = state;

  return (
    <View style={AppStyles.pageWrapper}>
      <Header
        placement="left"
        containerStyle={AppStyles.appHeader}
        leftComponent={<Icon
          onPress={() => NavigationService.goBack()}
          name='md-return-left'
          type='ionicon'
          color='white'
          size={32 * getAspectRatio()}
        />}
        centerComponent={{ text: 'Address Book', style: AppStyles.appHeaderText }}
        rightComponent={<Icon
          onPress={() => {
            setAppData({
              addressEntry: {
                headerText: "Create Address",
                label: '',
                address: '',
                paymentId: '',
                entryId: null
              }
            });
            NavigationService.navigate('EditAddress', { callback: null });
          }}
          name='md-add-circle-outline'
          type='ionicon'
          color='white'
          size={32 * getAspectRatio()}
        />}
      />
      <View style={styles.walletsWrapper}>
        {layout.userLoaded && user.addressBook.length === 0
          ? (<View style={styles.emptyAddressBookWrapper}>
            <Text style={styles.emptyAddressBookText}>
              You have no contacts saved in your address book.
              Add one by clicking on the button or when you are sending funds.
            </Text>
          </View>)
          : (<FlatList
            data={user.addressBook}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.entryID.toString()}
            renderItem={({ item }) =>
              <View style={styles.flatview}>
                <View>
                  <Text style={styles.addressLabel}>{item.label}</Text>
                  <Text style={styles.address}>Address: {maskAddress(item.address)}</Text>
                  {item.paymentID ? (<Text style={styles.data}>Payment ID: {item.paymentID}</Text>) : null}
                </View>
                <View style={styles.walletFooter}>
                  <ConcealButton
                    style={[styles.footerBtn, styles.footerBtnLeft]}
                    buttonStyle={styles.btnStyle}
                    onPress={() => {
                      Alert.alert(
                        'Delete Contact',
                        'You are about to delete this contact! Do you really wish to proceed?',
                        [
                          { text: 'OK', onPress: () => deleteContact(item) },
                          { text: 'Cancel', style: 'cancel' },
                        ],
                        { cancelable: false },
                      );
                    }}
                    text="DELETE"
                  />

                  <ConcealButton
                    style={[styles.footerBtn, styles.footerBtnRight]}
                    buttonStyle={styles.btnStyle}
                    onPress={() => {
                      setAppData({
                        addressEntry: {
                          headerText: "Edit Address",
                          label: item.label,
                          address: item.address,
                          paymentId: item.paymentID,
                          entryId: item.entryID
                        }
                      });
                      NavigationService.navigate('EditAddress');
                    }}
                    text="EDIT"
                  />
                </View>
              </View>
            }
          />)
        }
      </View>
    </View>
  );
};

const styles = EStyleSheet.create({
  buttonsWrapper: {
    position: 'absolute',
    right: 20
  },
  icon: {
    color: 'orange'
  },
  flatview: {
    backgroundColor: '#212529',
    justifyContent: 'center',
    borderRadius: '10rem',
    marginBottom: '5rem',
    marginTop: '5rem',
    padding: '20rem',
  },
  addressLabel: {
    color: '#FFFFFF',
    fontSize: '18rem'
  },
  address: {
    color: '#FFA500'
  },
  data: {
    color: '#AAAAAA'
  },
  buttonContainer: {
    margin: 5
  },
  walletsWrapper: {
    top: '90rem',
    left: '10rem',
    right: '10rem',
    bottom: 0,
    position: 'absolute'
  },
  footer: {
    bottom: '10rem',
    left: '20rem',
    right: '20rem',
    position: 'absolute',
    flex: 1,
    alignItems: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  walletFooter: {
    flex: 1,
    alignItems: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  footerBtn: {
    flex: 1,
    height: '40rem',
    marginTop: '10rem',
    borderWidth: 0,
    borderRadius: 0,
    borderBottomWidth: 2,
    borderColor: '#FFA500',
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  btnStyle: {
    borderWidth: 0
  },
  footerBtnRight: {
    marginLeft: '5rem'
  },
  footerBtnLeft: {
    marginRight: '5rem'
  },
  buttonText: {
    color: '#FFFFFF'
  },
  emptyAddressBookWrapper: {
    flex: 1,
    padding: '20rem',
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyAddressBookText: {
    fontSize: '18rem',
    color: '#FFFFFF',
    textAlign: 'center'
  },
});

export default AddressBook;
