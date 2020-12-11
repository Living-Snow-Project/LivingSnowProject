export default class Network {
  static uploadRecord(record) {
    return fetch(serviceEndpoint + '/api/records', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: record
    });
  }
}
