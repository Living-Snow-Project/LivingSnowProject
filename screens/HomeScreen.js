import React from 'react';
import { Alert, Platform, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PictureIcon, RecordIcon } from '../components/TabBarIcon';
import { Network } from '../lib/Network';
import { Storage } from '../lib/Storage';
import { serviceEndpoint } from '../constants/Service';
import {} from '../constants/Service';

//
// TODO: Figure out a better name than Home and rename component\file names
// TODO: Separate out the render code into a View file
//

export default class HomeScreen extends React.Component {
  state = {
    records: '',
    refreshing: false
  }

  componentDidMount() {

    //
    // TODO: consider some kind of "last sync'd" storage strategy or use pagination request
    //
    this.handleFetchRecord();
  }

  handleRetry(records) {
    if (!records) {
      return;
    }
    
    let currentRecords = records;
    let newRecords = [];

    currentRecords.reduce((promise, record) => {
      return promise.then(() => {
        return Network.uploadRecord(record)
        .then(response => {
          if (!response.ok) {
            newRecords.push(record);
          }
        })
        .catch((error) => {
          console.log("record failed to upload, will try again later", error);
          newRecords.push(record);
        });
      });
    }, Promise.resolve())
    .then(() => {
      Storage.saveRecords(newRecords);
    })
    .catch((error) => {
      console.log("error in reducer", error);
    });
  }

  handleFetchRecord() {
    this.setState({refreshing: true});

    //
    // see if there are any pending records to upload
    //

    Storage.loadRecords().then(records => {
      this.handleRetry(records);
    })
    .catch((error) => {
      console.log("error loading records", error);
    });

    let uri = `${serviceEndpoint}/api/records`;
    console.log(`Handling GET Request: ${uri}`);

    fetch(uri)
    .then(response => {
      if (!response.ok) {
        this.handleFailedDownload();
      } else {
        response.json()
        .then(responseJson => {
          //console.log(responseJson);
          this.setState({records: responseJson});
          this.setState({refreshing: false});
        })
      }
    })
    .catch((error) => {
      this.handleFailedDownload();

      console.log(error);
    });
  }

  handleFailedDownload() {
    this.setState({refreshing: false});
    Alert.alert(
      'Download failed',
      'Could not download records. Please try again later.'
    )
  }

  topText(record) {
    let result = record.date.slice(0, 10) + '\n';
    
    if (record.name && record.name != '' ) {
      result += record.name;

      if (record.organization && record.organization != '') {
        result += ' (' + record.organization + ')';
      }
    } else {
      result += 'unknown Scientist';
    }

    result += '\nLocation: ' + record.latitude + ', ' + record.longitude;

    return result;
  }

  notEmpty(text) {
    return text && text != '';
  }

  bottomText({locationDescription, notes}) {
    let result = '';
    let newline = '';

    if (this.notEmpty(locationDescription)) {
      result += `Description: ${locationDescription}`;
      newline = '\n';
    }

    if (this.notEmpty(notes)) {
      result += `${newline}Notes: ${notes}`;
    }

    return result;
  }

  renderRecords() {
    let records = (
      <Text style={{textAlign:'center', marginTop:20}}>No records to display</Text>
    );

    if (this.state.records.length > 0) {
      records = this.state.records.map((record, index) => (
        <View key={index} style={styles.recordContainer}>
          <View style={styles.recordTop}>
            <View style={styles.topText}>
              <Text>{this.topText(record)}</Text>
            </View>
            <View style={styles.topIcon}>
              <RecordIcon type={record.type}/>
            </View>
            <View style={styles.topIcon}>
              <PictureIcon/>
            </View>
          </View>
          {(this.notEmpty(record.locationDescription) || this.notEmpty(record.notes)) && <Text style={styles.bottomText}>{this.bottomText(record)}</Text>}
        </View>
    ))}

    return records;
  }
  
  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleFetchRecord.bind(this)}/>}
        >
          {this.renderRecords()}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center'
  },
  contentContainer: {
    paddingTop: 0
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50
  },
  homeScreenFilename: {
    marginVertical: 7
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)'
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center'
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      android: {
        elevation: 20
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center'
  },
  navigationFilename: {
    marginTop: 5
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center'
  },
  helpLink: {
    paddingVertical: 15
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7'
  },
  recordContainer: {
    borderColor: '#000000',
    borderStyle: 'solid',
    borderBottomWidth: 1
  },
  recordTop: {
    flexDirection: 'row',
    flex:1
  },
  topText: {
    marginLeft: 1,
    flex: .7
  },
  topIcon: {
    marginLeft: 1,
    flex: .15
  }
});
