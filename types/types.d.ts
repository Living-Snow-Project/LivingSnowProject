// global types

type AppSettings = {
  name: string | undefined;
  organization: string | undefined;
  showFirstRun: boolean;
  showGpsWarning: boolean;
  showAtlasRecords: boolean;
  showOnlyAtlasRecords: boolean;
};

// TODO: this will need to change to something like "ServicePhoto" {recordId: number, photo: NativePhoto}
type Photo = {
  id: number;
  photoStream: string;
};

type NativePhoto = {
  uri: string;
  width: number;
  height: number;
};
