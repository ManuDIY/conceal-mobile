import React, { useContext, useEffect } from 'react';
import { StatusBar, View, Text, StyleSheet } from 'react-native';
import { AppContext } from '../components/ContextProvider';
import AuthHelper from '../helpers/AuthHelper';
import NavigationService from '../helpers/NavigationService';
import { logger } from '../helpers/Logger';
import AppStyles from '../components/Style';


const AuthLoading = () => {
  const { state } = useContext(AppContext);
  const Auth = new AuthHelper(state.appSettings.apiURL);

  useEffect(() => {
    logger.log('CHECKING AUTH...');
    Auth.loggedIn().then(loggedIn =>
      loggedIn
        ? (state.layout.userLoaded && state.layout.walletsLoaded) && NavigationService.navigate('App')
        : NavigationService.navigate('Auth')
    );
  }, []);

  return (
    <View style={[AppStyles.appContainer, styles.textWrapper]}>
      <Text style={styles.loadingText}>Loading, please wait...</Text>
    </View>
  )
};

const ForwardRef = React.forwardRef((props, ref) => (
  <AppContext.Consumer>
    {context => <AuthLoading context={context} {...props} />}
  </AppContext.Consumer>
));

const styles = StyleSheet.create({
  textWrapper: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingText: {
    fontSize: 18,
    color: "#FFFFFF"
  }
});

export default ({ navigation }) => (
  <View style={AppStyles.appContainer}>
    <ForwardRef navigation={navigation} />
  </View>
)
