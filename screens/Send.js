import { Icon, Overlay, Header, ListItem } from 'react-native-elements';
import NavigationService from '../helpers/NavigationService';
import { AppContext } from '../components/ContextProvider';
import ConcealTextInput from '../components/ccxTextInput';
import ConcealButton from '../components/ccxButton';
import { AppColors } from '../constants/Colors';
import React, { useContext } from "react";
import { sprintf } from 'sprintf-js';
import {
  maskAddress,
  formatOptions,
  format0Decimals,
  format2Decimals,
  format4Decimals,
  format6Decimals,
  format8Decimals
} from '../helpers/utils';
import {
  Text,
  View,
  FlatList,
  Clipboard,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";

const SendScreen = () => {
  const { state, actions } = useContext(AppContext);
  const { setAppData } = actions;
  const { user, wallets, appData } = state;
  const currWallet = wallets[appData.common.selectedWallet];

  const sendSummaryList = [];

  if (state.appData.sendScreen.toLabel) {
    sendSummaryList.push({
      value: state.appData.sendScreen.toLabel,
      title: 'Label',
      icon: 'md-eye'
    });
  }

  if (state.appData.sendScreen.toAddress) {
    sendSummaryList.push({
      value: maskAddress(state.appData.sendScreen.toAddress),
      title: 'Address',
      icon: 'md-mail'
    });
  }

  if (state.appData.sendScreen.toPaymendId) {
    sendSummaryList.push({
      value: maskAddress(state.appData.sendScreen.toPaymendId),
      title: 'Payment ID',
      icon: 'md-key'
    });
  }

  if (state.appData.sendScreen.toAmount) {
    let totalAmount = parseFloat(state.appData.sendScreen.toAmount);
    totalAmount = totalAmount + 0.0001;

    sendSummaryList.push({
      value: sprintf('%s CCX', totalAmount.toLocaleString(undefined, format6Decimals)),
      title: 'Total Amount',
      icon: 'md-cash'
    });

    sendSummaryList.push({
      value: '0.0001 CCX',
      title: 'Transaction Fee',
      icon: 'md-cash'
    });
  }

  // key extractor for the list
  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item }) => (
    <ListItem
      title={item.value}
      subtitle={item.title}
      titleStyle={styles.summaryText}
      subtitleStyle={styles.summaryLabel}
      containerStyle={styles.summaryItem}
      leftIcon={<Icon
        name={item.icon}
        type='ionicon'
        color='white'
        size={32}
      />}
    />
  );

  isFormValid = () => {
    if (state.appData.sendScreen.toAddress && state.appData.sendScreen.toAmount) {
      var amountAsFloat = parseFloat(state.appData.sendScreen.toAmount);
      return ((amountAsFloat > 0) && (amountAsFloat <= (parseFloat(currWallet.balance) - 0.0001)));
    } else {
      return false;
    }
  }

  clearSend = () => {
    setAppData({
      sendScreen: {
        toAmount: '',
        toAddress: '',
        toPaymendId: '',
        toLabel: ''
      }
    });
  }

  readFromClipboard = async () => {
    const clipboardContent = await Clipboard.getString();
    setAppData({
      sendScreen: {
        toAddress: clipboardContent,
        toPaymendId: '',
        toLabel: ''
      }
    });
  };

  getAmountError = () => {
    var amountAsFloat = parseFloat(state.appData.sendScreen.toAmount || 0);
    if ((amountAsFloat <= 0) && (state.appData.sendScreen.toAmount)) {
      return "Amount must be greater then 0"
    } else if (amountAsFloat > (parseFloat(currWallet.balance) - 0.0001)) {
      return "The amount exceeds wallet balance"
    } else {
      return "";
    }
  }

  setAddress = (label, address, paymentID, entryID) => {
    setAppData({
      sendScreen: {
        toAddress: address,
        toPaymendId: paymentID
      }
    });
  }

  return (
    <View style={styles.pageWrapper}>
      <Header
        placement="left"
        containerStyle={styles.appHeader}
        leftComponent={<Icon
          onPress={() => NavigationService.goBack()}
          name='md-return-left'
          type='ionicon'
          color='white'
          size={32}
        />}
        centerComponent={{ text: 'Send CCX', style: { color: '#fff', fontSize: 20 } }}
        rightComponent={<Icon
          onPress={() => this.clearSend()}
          name='md-trash'
          type='ionicon'
          color='white'
          size={32}
        />}
      />
      <ScrollView contentContainerStyle={styles.walletWrapper}>
        <View style={styles.fromWrapper}>
          <Text style={styles.fromAddress}>{maskAddress(currWallet.addr)}</Text>
          <Text style={styles.fromBalance}>{currWallet.balance.toLocaleString(undefined, format4Decimals)} CCX</Text>
          {currWallet.locked
            ? (<View style={styles.lockedWrapper}>
              <Icon
                containerStyle={styles.lockedIcon}
                name='md-lock'
                type='ionicon'
                color='#FF0000'
                size={16}
              />
              <Text style={currWallet.locked ? [styles.worthBTC, styles.lockedText] : styles.worthBTC}>
                {sprintf('%s CCX', currWallet.locked.toLocaleString(undefined, format4Decimals))}
              </Text>
            </View>)
            : null}
        </View>

        <ConcealTextInput
          label={this.getAmountError()}
          keyboardType='numeric'
          placeholder='Select amount to send...'
          containerStyle={styles.sendInput}
          value={state.appData.sendScreen.toAmount}
          onChangeText={(text) => {
            setAppData({ sendScreen: { toAmount: text } });
          }}
          rightIcon={
            <Icon
              onPress={() => setAppData({ sendScreen: { toAmount: (parseFloat(currWallet.balance) - 0.0001).toLocaleString(undefined, format8Decimals) } })}
              name='md-add'
              type='ionicon'
              color='white'
              size={32}
            />
          }
        />
        <TouchableOpacity onPress={() => setAppData({ sendScreen: { addrListVisible: true } })}>
          <ConcealTextInput
            editable={false}
            placeholder='Select recipient address...'
            containerStyle={styles.sendInput}
            value={state.appData.sendScreen.toAddress}
            rightIcon={
              <Icon
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
                  NavigationService.navigate('EditAddress', { callback: this.setAddress });
                }}
                name='md-add'
                type='ionicon'
                color='white'
                size={32}
              />
            }
          />
        </TouchableOpacity>
        <FlatList
          data={sendSummaryList}
          style={styles.summaryList}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
        />
      </ScrollView>
      <Overlay
        isVisible={state.appData.sendScreen.addrListVisible}
        overlayBackgroundColor={AppColors.concealBackground}
        width="100%"
        height="100%"
      >
        <View style={styles.overlayWrapper}>
          <View style={styles.addressWrapper}>
            <FlatList
              data={user.addressBook}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) =>
                (currWallet.addr !== item.address)
                  ? (<TouchableOpacity onPress={() => setAppData({ sendScreen: { addrListVisible: false, toAddress: item.address, toPaymendId: item.paymentID, toLabel: item.label } })}>
                    <View style={styles.flatview}>
                      <View>
                        <Text style={styles.addressLabel}>{item.label}</Text>
                        <Text style={styles.address}>Address: {maskAddress(item.address)}</Text>
                        {item.paymentID ? (<Text style={styles.data}>Payment ID: {item.paymentID}</Text>) : null}
                      </View>
                    </View>
                  </TouchableOpacity>)
                  : null
              }
              keyExtractor={item => item.entryID.toString()}
            />
          </View>
          <View style={styles.footer}>
            <ConcealButton
              style={[styles.footerBtn]}
              onPress={() => setAppData({ sendScreen: { addrListVisible: false } })}
              text="CLOSE"
            />
          </View>
        </View>
      </Overlay>
      <View style={styles.footer}>
        <ConcealButton
          style={[styles.footerBtn, styles.footerBtnLeft]}
          disabled={!this.isFormValid()}
          onPress={() => NavigationService.navigate('SendConfirm')}
          text="SEND"
        />
        <ConcealButton
          style={[styles.footerBtn, styles.footerBtnRight]}
          onPress={() => NavigationService.navigate('Scanner', { path: ["sendScreen", "toAddress"] })}
          text="SCAN QR"
        />
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: 'rgb(40, 45, 49)'
  },
  appHeader: {
    borderBottomWidth: 1,
    backgroundColor: '#212529',
    borderBottomColor: "#343a40"
  },
  icon: {
    color: "orange"
  },
  flatview: {
    backgroundColor: "#212529",
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 5,
    marginTop: 5,
    padding: 20,
  },
  sendInput: {
    marginTop: 10,
    marginBottom: 20
  },
  addressLabel: {
    color: "#FFFFFF",
    fontSize: 18
  },
  fromAddress: {
    fontSize: 18,
    color: "#FFA500",
    textAlign: 'center'
  },
  toAddress: {
    color: "#FFFFFF",
  },
  fromBalance: {
    textAlign: 'center',
    color: "#AAAAAA",
    fontSize: 24
  },
  address: {
    color: "#FFA500"
  },
  data: {
    color: "#AAAAAA"
  },
  sendSummary: {
    color: "#AAAAAA",
    backgroundColor: '#212529',
    borderColor: '#333',
    borderWidth: 1,
    marginBottom: 2,
    marginTop: 2,
    padding: 10,
    fontSize: 16
  },
  sendSummaryLabel: {
    color: AppColors.concealOrange
  },
  buttonContainer: {
    margin: 5
  },
  walletWrapper: {
    flex: 1,
    top: 0,
    left: 5,
    right: 5,
    bottom: 50,
    margin: 15,
    position: 'absolute',
    flexDirection: 'column'
  },
  sendSummaryWrapper: {
    margin: 10,
    marginTop: 5
  },
  overlayWrapper: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute'
  },
  addressWrapper: {
    top: 10,
    left: 10,
    right: 10,
    bottom: 80,
    borderRadius: 10,
    position: 'absolute'
  },
  footer: {
    bottom: 10,
    left: 20,
    right: 20,
    position: 'absolute',
    flex: 1,
    alignItems: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  footerBtn: {
    flex: 1
  },
  footerBtnRight: {
    marginLeft: 5
  },
  footerBtnLeft: {
    marginRight: 5
  },
  summaryLabel: {
    color: AppColors.concealOrange
  },
  summaryText: {
    color: AppColors.concealTextColor
  },
  summaryList: {
    flex: 1,
    margin: 10,
    backgroundColor: AppColors.concealBackground
  },
  summaryItem: {
    backgroundColor: '#212529',
    borderWidth: 0,
    paddingTop: 5,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.concealBackground
  },
  lockedWrapper: {
    height: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  lockedIcon: {
    marginRight: 5,
    paddingTop: 2
  },
  lockedText: {
    color: '#FF0000'
  }

});


export default SendScreen;
