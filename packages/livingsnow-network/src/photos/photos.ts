const photosApi = () => {
  const baseUrl = "https://snowalgaestorage.blob.core.windows.net/photos";
  const getUrl = (id: string) => `${baseUrl}/${id}.jpg`;

  return {
    baseUrl,
    getUrl,
  };
};

const PhotosApi = photosApi();

export { PhotosApi };
