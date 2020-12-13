import React from 'react';
import PropTypes from 'prop-types';
import Touchable from 'react-native-platform-touchable';
import { Platform, StyleSheet, Text, View, TextInput } from 'react-native';
import { StockIcon } from '../components/TabBarIcon';
import Storage from '../lib/Storage';

export default class FirstRunScreen extends React.Component {
  //
  // Checks to see if the app has run already
  //

  componentDidMount() {
    if (!global.appConfig.showFirstRun) {
      this.props.navigation.navigate('Home');
    } else {
      navigator.geolocation.getCurrentPosition(() => {});
    }
  }

  //
  // Saves name, organization, and first run completion to disk
  //

  completeFirstRunExperience() {
    //console.log('completeFirstRunExperience');
    //const { navigation } = this.props;
    global.appConfig.showFirstRun = false;
    Storage.saveAppConfig();
    //console.log(navigation);

    this.props.navigation.navigate('Home');
  }

  render() {
    return (
      <View style={styles.ftreContainer}>
        <View style={styles.welcomeContainer}>
          <StockIcon style={{ marginRight: 30 }} name={Platform.OS === 'ios' ? 'ios-snow' : 'md-snow'} />
          <Text style={styles.welcomeText}>Living Snow Project</Text>
          <StockIcon style={{ marginLeft: 30 }} name={Platform.OS === 'ios' ? 'ios-snow' : 'md-snow'} />
        </View>

        <Text style={styles.descriptionText}>
          {
          'Enter your name and organization you are associated with, if any, so we don\'t have to keep asking.'
          + ' You can change these at any time in the Settings tab.'
        }
        </Text>

        <Text style={styles.optionText}>Name</Text>
        <TextInput
          style={styles.optionInputText}
          placeholder="Enter your name"
          onChangeText={(name) => { global.appConfig.name = name; }}
          maxLength={50}
          returnKeyType="done"
        />

        <Text style={styles.optionText}>Organization</Text>
        <TextInput
          style={styles.optionInputText}
          placeholder="Enter the organization you belong to (if any)"
          onChangeText={(organization) => { global.appConfig.organization = organization; }}
          maxLength={50}
          returnKeyType="done"
        />

        <View style={styles.exitContainer}>
          <Touchable onPress={() => { this.completeFirstRunExperience(); }}>
            <View style={styles.exitButtonContainer}>
              <Text style={styles.exitButtonText}>Let&apos;s get started!</Text>
            </View>
          </Touchable>
        </View>
      </View>
    );
  }
}

FirstRunScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  ftreContainer: {
    flex: 1,
    marginTop: 30,
    paddingHorizontal: 10,
  },
  welcomeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  exitContainer: {
    flex: 2,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 30,
  },
  exitButtonContainer: {
    backgroundColor: 'lightpink',
    width: 200,
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
  },
  exitButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 25,
    marginTop: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 12,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
    color: 'red',
    textAlign: 'center'
  },
  optionInputText: {
    backgroundColor: '#efefef',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4
  },
  optionText: {
    fontSize: 15,
    marginTop: 3
  },
});
