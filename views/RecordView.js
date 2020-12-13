import React from 'react';
import {
  Alert, Platform, StyleSheet, Text, TextInput, TouchableHighlight, View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import RNPickerSelect from 'react-native-picker-select';
import PropTypes from 'prop-types';
import Storage from '../lib/Storage';
import Network from '../lib/Network';
import {serviceEndpoint} from '../constants/Service';
import KeyboardShift from '../components/KeyboardShift';

export default class RecordView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

      //
      // visibility states and data tracking for components
      //

      recordTypeVisible: false,
      datePickerVisible: false,
      gpsCoordinatesEditable: Platform.OS === 'ios' ? !global.appConfig.showGpsWarning : false,
      gpsCoordinatesFirstTap: true,
      gpsCoordinateString: undefined,
      watchID: undefined,
      isUploading: false,

      //
      // data collected and sent to the service
      //

      recordType: 'Sample', // sample or sighting
      date: undefined, // YYYY/MM/DD
      latitude: undefined, // GPS
      longitude: undefined, // GPS
      tubeId: undefined, // (optional) id of the tube
      locationDescription: undefined, // (optional) short description of the location
      notes: undefined, // (optional) any other pertinent information
    };

    //
    // initialize date, keeping the format used by Calendar component
    //

    const date = new Date();
    let day = date.getDate();
    if (day < 10) {
      day = `0${day}`;
    }

    let month = date.getMonth() + 1;
    if (month < 10) {
      month = `0${month}`;
    }

    const year = date.getFullYear();
    this.state.date = `${year}-${month}-${day}`;
  }

  componentDidMount() {
    //
    // set callback when "upload-record icon" tapped
    // it is done this way to render its header icon without delay
    //

    const { navigation } = this.props;

    navigation.setParams({ handleUpload: this.handleUploadRecord.bind(this) });

    //
    // start the gps
    //

    this.startGps();
  }

  componentWillUnmount() {
    this.stopGps();
  }

  render() {
    return (
      <KeyboardShift>
        {() => (
          <View style={styles.container}>
            <Text style={styles.optionStaticText}>
              Are you Taking a Sample or Reporting a Sighting?
            </Text>
            <RNPickerSelect
              style={pickerSelectStyles}
              useNativeAndroidPickerStyle={false}
              placeholder={{}}
              items={[{label: 'I\'m Taking a Sample', value: 'Sample'}, {label: 'I\'m Reporting a Sighting', value: 'Sighting'}]}
              onValueChange={value => {this.setRecordType(value)}}
              value={this.state.recordType}
            />
            
            <Text style={styles.optionStaticText}>
              Date
            </Text>
            <TouchableHighlight onPress={() => this.toggleDatePickerVisible()}>
              <View>
                {
                this.state.datePickerVisible && (
                <Calendar
                  current={this.state.date}
                  onDayPress={this.setDay.bind(this)}
                  markedDates={{[this.state.date]: {selected: true}}}
                />
              )}
              {
                !this.state.datePickerVisible && <Text style={styles.optionInputText}>{this.state.date}</Text>
              }
              </View>
            </TouchableHighlight>

            {/* don't show tubeId when recording a sighting */}
            {this.state.recordType === "Sample" && <View>
              <Text style={styles.optionStaticText}>
                Tube Id
              </Text>
              <TextInput
                style={styles.optionInputText}
                placeholder="Leave blank if the tube does not have an id"
                onChangeText={(tubeId) => this.setState({tubeId})}
                maxLength={40}
                returnKeyType="done"
              />
            </View>}

            {/* on iOS, TextInput takes precedence over TouchableHighlight.
                on Android, onTouchStart does nothing and editable also behaves differently.
                Workaround with TouchableHighlight, which takes precedence over TextInput. */}
            <Text style={styles.optionStaticText}>
              GPS Coordinates (latitude, longitude)
            </Text>
            {Platform.OS === 'ios' &&
            <TextInput
              style={styles.optionInputText}
              ref={(view) => this.GpsCoordinates = view}
              defaultValue={this.state.gpsCoordinateString}
              onChangeText={(value) => this.updateGpsCoordinateString(value)}
              onTouchStart={() => this.toggleCoordinateEntry()}
              maxLength={40}
              returnKeyType="done"
              editable={this.state.gpsCoordinatesEditable}
            />}

            {Platform.OS !== 'ios' &&
            <TouchableHighlight onPress={() => this.toggleCoordinateEntry()}>
              <TextInput
                style={styles.optionInputText}
                ref={(view) => this.GpsCoordinates = view}
                defaultValue={this.state.gpsCoordinateString}
                onChangeText={(value) => this.updateGpsCoordinateString(value)}
                maxLength={40}
                returnKeyType="done"
                editable={this.state.gpsCoordinatesEditable}
              />
            </TouchableHighlight>}

            <Text style={styles.optionStaticText}>
              Location Description (limit 255 characters)
            </Text>
            <TextInput
              style={styles.optionInputText}
              placeholder="ie: Blue Lake, North Cascades, WA"
              onChangeText={(locationDescription) => this.setState({locationDescription})}
              //onSubmitEditing={(event) => {this.Notes.focus()}}
              maxLength={255}
              returnKeyType="done"
            />

            <Text style={styles.optionStaticText}>
              Additional Notes (limit 255 characters)
            </Text>
            <TextInput
              style={styles.optionInputText}
              //ref={(view) => this.Notes = view}
              placeholder="ie. algae growing on glacial ice"
              onChangeText={(notes) => this.setState({notes})}
              maxLength={255}
              returnKeyType="done"
            />
          </View>
        )}
      </KeyboardShift>
    );
  }

  //
  // Record type functions and state
  //
  
  setRecordType(newRecordType) {
    this.setState({recordType: newRecordType});
    this.toggleRecordType();
  }

  toggleRecordType() {
    this.setState({recordTypeVisible: !this.state.recordTypeVisible});
  }

  //
  // Date functions and state
  //

  setDay(day) {
    this.toggleDatePickerVisible();

    this.setState({date: day.dateString});
  }

  toggleDatePickerVisible() {
    this.setState({datePickerVisible: !this.state.datePickerVisible});
  }

  //
  // GPS functions and state
  //

  startGps() {
    var watchID = navigator.geolocation.watchPosition(
      (position) => {
        this.parsePosition(position);
      },
      (error) => {
        alert(error.message)
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000
      }
    );

    this.setState({watchID});
  }

  stopGps() {
    navigator.geolocation.stopObserving();
    navigator.geolocation.clearWatch(this.state.watchID);
  }

  enableManualGpsCoordinates() {
    this.stopGps();
    
    //
    // reset coordinate string, make the coordinate input editable, set focus
    //

    this.updateGpsCoordinateString('');
    this.setState({gpsCoordinatesEditable: true});
    this.GpsCoordinates.focus();
  }

  parsePosition(position) {
    var latitude = JSON.stringify(position.coords.latitude.toFixed(6)).replace('"','').replace('"','');
    var longitude = JSON.stringify(position.coords.longitude.toFixed(6)).replace('"','').replace('"','');
    this.updateGpsCoordinateString(latitude + ', ' + longitude);
  }

  updateGpsCoordinateString(value) {
    this.setState({gpsCoordinateString: value});

    var coordinates = value.split(',');

    if (coordinates[0]) {
      this.setState({latitude: coordinates[0].trim()});
    } else {
      this.setState({latitude: undefined});
    }

    if (coordinates[1]) {
      this.setState({longitude: coordinates[1].trim()});
    } else {
      this.setState({longitude: undefined});
    }
  }

  toggleCoordinateEntry() {
    if (global.appConfig.showGpsWarning && !this.state.gpsCoordinatesEditable) {
      Alert.alert(
        'Confirmation',
        'Do you want to enter GPS coordinates manually? If Yes, don\'t worry, we\'ll ' +
        'start using the GPS again with the next record.',
        [
          {
            text: 'Yes, disable this message',
            onPress: () => {
              global.appConfig.showGpsWarning = false;
              Storage.saveAppConfig();
              this.enableManualGpsCoordinates();
            }
          },
          {
            text: 'Yes',
            onPress: () => this.enableManualGpsCoordinates()
          },
          {
            text: 'No',
            style: 'cancel'
          }
        ]
      )
    } else if (this.state.gpsCoordinatesFirstTap) {
      this.enableManualGpsCoordinates();
      this.setState({gpsCoordinatesFirstTap: false});
    }
  }

  //
  // Input validation
  //

  validateInput() {
    if (!global.appConfig.name || global.appConfig.name === '') {
      global.appConfig.name = 'Anonymous';
      Storage.saveAppConfig();
    }

    if (!this.state.latitude || !this.state.longitude) {
      Alert.alert(
        'Invalid record',
        'Your record does not have a valid GPS coordinate and cannot be uploaded.',
        [
          {
            text: 'Ok'
          }
        ]
      );

      return false;
    }

    return true;
  }

  //
  // Service functions and state
  //

  handleFailedUpload(record) {
    Storage.saveSingleRecord(record);
    Alert.alert('Upload failed', 'Thanks for your submission and service to Living Snow Project! Unfortunately, ' +
                'we could not upload the record at this time (most likely you are in the backcountry without data service). ' +
                'Don\'t worry - we have saved the record. Please re-open the app once you\'re back in town to submit the data.');
  }

  handleUploadRecord() {
    if (!this.validateInput()) {
      return;
    }

    if (this.state.isUploading) {
      return;
    }

    this.setState({isUploading: true});

    var record = JSON.stringify({
      Type: this.state.recordType,
      Name: global.appConfig.name,
      Date: this.state.date,
      Organization: global.appConfig.organization,
      Latitude: this.state.latitude,
      longitude: this.state.longitude,
      TubeId: this.state.tubeId,
      LocationDescription: this.state.locationDescription,
      Notes: this.state.notes
    });

    console.log("Handling Upload Request: " + serviceEndpoint + '/api/records');
    console.log("Type: " + this.state.recordType);
    console.log("Name: " + global.appConfig.name);
    console.log("Date: " + this.state.date);
    console.log("Org: " + global.appConfig.organization);
    console.log("TubeId: " + this.state.tubeId);
    console.log("Latitude: " + this.state.latitude);
    console.log("Longitude: " + this.state.longitude);
    console.log("Description: " + this.state.locationDescription);
    console.log("Notes: " + this.state.notes);
    console.log("JSON Body\n", record);

    //
    // TODO: add activity indicator
    //
    
    Network.uploadRecord(record).then(response => {
      if (response.ok) {
        Alert.alert('Upload succeeded', 'Thanks for your submission and service to Living Snow Project!');
      } else {
        console.log("error with POST request:", response.status);

        this.handleFailedUpload(record);
      }
    })
    .catch((error) => {
      console.log(error);

      this.handleFailedUpload(record);
    });

    this.props.navigation.navigate('Home');
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 1,
    paddingHorizontal: 10
  },
  optionStaticText: {
    fontSize: 15,
    marginTop: 3
  },
  optionInputText: {
    backgroundColor: '#efefef',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: styles.optionInputText,
  inputAndroid: styles.optionInputText
});

RecordView.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    setParams: PropTypes.func.isRequired,
  }).isRequired,
};
