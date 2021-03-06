import { StyleSheet } from 'react-native';
import { AppColors } from '../constants/Colors';
import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: AppColors.concealBlack,
  },
  viewContainer: {
    flex: 1,
    padding: '15rem',
    backgroundColor: AppColors.concealBlack,
  },
  pageWrapper: {
    flex: 1,
    backgroundColor: 'rgb(40, 45, 49)'
  },
  '@media (max-width: 499)': {
    appHeader: {
      borderBottomWidth: 1,
      backgroundColor: '#212529',
      borderBottomColor: '#343a40',
    }
  },
  '@media (min-width: 500)': {
    appHeader: {
      height: '50rem',
      borderBottomWidth: 1,
      backgroundColor: '#212529',
      borderBottomColor: '#343a40',
    }
  },
  appHeaderText: {
    color: '#fff',
    fontSize: '20rem'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  loginView: {
    flex: 1,
    paddingTop: 60,
    alignItems: 'center',
  },
  contentContainer: {
    paddingTop: 30,
    alignItems: 'center',
    marginHorizontal: 15,
  },
  textRegular: {
    fontFamily: 'Roboto',
    fontSize: 20,
    color: AppColors.text,
  },
  textSmall: {
    fontSize: 16,
  },
  textLarge: {
    fontSize: 20,
  },
  textOrange: {
    fontFamily: 'Roboto',
    fontSize: 24,
    color: AppColors.concealOrange,
  },
  title: {
    fontFamily: 'Roboto',
    fontSize: '36rem',
    textAlign: 'center',
    color: AppColors.concealOrange,
  },
  textDanger: {
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    color: AppColors.errorText,
    backgroundColor: AppColors.errorBackground,
  },
  tabBar: {
    backgroundColor: 'rgb(25, 25, 25)',
    height: 60,
  },
  tabBarLabel: {
    fontFamily: 'Lato',
    fontSize: 14,
    lineHeight: 60,
  },
  tabBarIndicator: {
    backgroundColor: AppColors.concealOrange,
  },
  loginInput: {
    textAlign: 'center'
  },
  inputField: {
    width: '100%',
    height: 40,
    marginTop: 5,
    borderWidth: 0,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderColor: 'rgb(50, 50, 50)',
    color: 'rgb(255, 255, 255)',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: AppColors.concealOrange,
    margin: 10,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  submitButtonDisabled: {
    borderColor: 'rgba(255, 165, 0, 0.3)',
    borderWidth: 1,
    backgroundColor: AppColors.concealBlack,
  },
  submitButtonLoading: {
    borderWidth: 0,
    backgroundColor: AppColors.concealBlack,
  },
  loginButton: {
    width: 100,
    height: 40,
  },
  buttonTitle: {
    color: 'rgb(0, 0, 0)',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  buttonTitleDisabled: {
    color: 'rgb(75, 75, 75)',
  },
});
