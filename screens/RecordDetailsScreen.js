import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';


function RecordDetailsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View>
        <Text>Hello</Text>
      </View>      
    </ScrollView>
  );
}

export { RecordDetailsScreen };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});