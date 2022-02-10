// global types

type AppSettings = {
  name: string | undefined;
  organization: string | undefined;
  showFirstRun: boolean;
  showGpsWarning: boolean;
  showAtlasRecords: boolean;
  showOnlyAtlasRecords: boolean;
};

// TODO: this will need to change to {id, {uri, height, width}}
type Photo = {
  id: string;
  photoStream: string;
};
