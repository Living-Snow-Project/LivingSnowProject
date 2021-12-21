import React, { createRef } from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { Storage } from '../lib/Storage';
import { RecordManager } from '../lib/RecordManager';
import KeyboardShift from '../components/KeyboardShift';
import Touchable from 'react-native-platform-touchable';
import { StockIcon } from '../components/TabBarIcon';
import { PhotoControl} from '../components/PhotoControl';
import { Routes } from '../navigation/Routes';
import { AtlasTypes } from '../lib/Atlas';
import { TypeSelector } from '../components/forms/TypeSelector';
import { DateSelector } from '../components/forms/DateSelector';
import { CustomTextInput } from '../components/forms/CustomTextInput';
import { GpsCoordinatesInput } from '../components/forms/GpsCoordinatesInput';
import { AtlasSelector } from '../components/forms/AtlasSelector';

export class RecordView extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
      goBack: PropTypes.func.isRequired,
      setOptions: PropTypes.func.isRequired,
    }).isRequired,
    route: PropTypes.object,
  }

  isUploading = false;

  // TODO: much of this can be moved to a useRef once we finish re-factoring
  state = {
    uploading: false,

    // data collected and sent to the service
    recordType: 'Sample', // sample or sighting
    date: undefined, // YYYY/MM/DD
    latitude: undefined, // GPS
    longitude: undefined, // GPS
    tubeId: undefined, // (optional) id of the tube
    locationDescription: undefined, // (optional) short description of the location
    notes: undefined, // (optional) any other pertinent information
    atlasType: AtlasTypes.Undefined,
    photos: []
  }

  constructor(props) {
    super(props);

    // keep format used by Calendar component
    this.state.date = new Date().toLocaleDateString('en-CA');

    // moving focus between text input form fields
    this.locationDescriptionRef = createRef();
    this.notesRef = createRef();
  }

  componentDidMount() {
    // callback when "upload-record icon" tapped
    // TODO: not super happy about this, maybe when we refactor to functional components and use hooks we can clean this up
    const handleUploadRecord = function() {
      if (!this.validateInput()) {
        return;
      }
  
      if (this.isUploading) {
        return;
      }
  
      this.isUploading = true;
      this.setState({uploading: true});
  
      const record = {
        type: this.state.recordType,
        name: global.appConfig.name,
        date: this.state.date,
        organization: global.appConfig.organization,
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        tubeId: this.state.tubeId,
        locationDescription: this.state.locationDescription,
        notes: this.state.notes,
        atlasType: this.state.recordType.includes(`Atlas`) ? this.state.atlasType : AtlasTypes.Undefined
      };
    
      RecordManager.uploadRecord(record, this.state.photos).then(() => {
        Alert.alert(`Upload succeeded`, `Thanks for your submission.`);
      })
      .catch(error => {
        console.log(error);
        Alert.alert(`Record Saved`, `We will upload it later.`);
      })
      .finally(() => {
        this.isUploading = false;
        this.setState({uploading: false});
        this.props.navigation.navigate(Routes.TimelineScreen);
      });
    }.bind(this);

    const { navigation } = this.props;
    navigation.setOptions({
      headerRight: function RecordRight() {
        return (
          <Touchable onPress={handleUploadRecord}>
            <StockIcon name={Platform.OS === 'ios' ? 'ios-cloud-upload' : 'md-cloud-upload'} />
          </Touchable>
        )},
      headerRightContainerStyle: { marginRight: 20 },
    });
  }

  componentDidUpdate() {

    //
    // TODO: not super happy about this, and it should probably be in one of the navigation listeners
    // need to better understand React lifecycles, hooks, etc
    //

    // route prop passed by navigation
    const { route } = this.props;
    if (route !== undefined && route.params?.data !== undefined) {
      if (JSON.stringify(this.state.photos) !== JSON.stringify(route.params.data)) {
        this.setState({photos: route.params?.data});
      }
    }
  }

  render() {
    const { navigation } = this.props;
    
    return (
      <KeyboardShift>
        {() => (
          <ScrollView style={styles.container}>
            {this.isUploading && 
            <View style={{marginTop: 3}}>
              <ActivityIndicator animating={this.state.uploading} size={'large'} color="#0000ff"/>
            </View>}
            
            {/* Sample, Sighting, Atlas, etc */}
            <TypeSelector recordType={this.state.recordType} setRecordType={type => this.setState({recordType: type})} />

            {/* Date of Sample, Sighting, Atlas, etc */}
            <DateSelector date={this.state.date} setDate={date => this.setState({date: date})}/>

            {/* Tube Id: only show Tube Id when recording a Sample */}
            {this.state.recordType.includes(`Sample`) &&
            <CustomTextInput
              description={`Tube Id`}
              placeholder={`Leave blank if the tube does not have an id`}
              maxLength={20}
              onChangeText={tubeId => this.setState({tubeId})}
              onSubmitEditing={() => this.locationDescriptionRef.current.focus()}
            />}
            
            <GpsCoordinatesInput
              setGpsCoordinates={(lat, long) => this.setState({latitude: lat, longitude: long})}
              onSubmitEditing={() => this.locationDescriptionRef.current.focus()}
            />

            <AtlasSelector
              recordType={this.state.recordType}
              atlasType={this.state.atlasType}
              setAtlasType={type => this.setState({atlasType: type})}
            />
            
            <CustomTextInput
              description={`Location Description (limit 255 characters)`}
              placeholder={`ie: Blue Lake, North Cascades, WA`}
              onChangeText={locationDescription => this.setState({locationDescription})}
              onSubmitEditing={() => this.notesRef.current.focus()}
              ref={this.locationDescriptionRef}
            />
            
            <CustomTextInput
              description={`Additional Notes (limit 255 characters)`}
              placeholder={`ie. algae growing on glacial ice`}
              onChangeText={notes => this.setState({notes})}
              ref={this.notesRef}
            />
            
            <Text style={styles.optionStaticText}>
              Select Photos (limit 4)
            </Text>
            <PhotoControl navigation={navigation} photos={this.state.photos}/>
          </ScrollView>
        )}
      </KeyboardShift>
    );
  }

  isNumber(value) {
    return !isNaN(Number(value));
  }

  // form input validation
  validateInput() {
    if (!global.appConfig.name || global.appConfig.name === ``) {
      global.appConfig.name = `Anonymous`;
      Storage.saveAppConfig();
    }

    if (!this.state.latitude || 
        !this.state.longitude || 
        !this.isNumber(this.state.latitude) || 
        !this.isNumber(this.state.longitude)) {
      Alert.alert(
        `Invalid GPS coordinates`,
        `Coordinates must be in "lat, long" format. ie. 12.345678, -123.456789`,
        [{
            text: `Ok`
        }]
      );

      return false;
    }

    return true;
  }
}

// TODO: delete when all form fields become their own component
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
    borderRadius: 4,
    minHeight: '8%'
  },
  multilineTextInput: {
    paddingTop: 15
  }
});
