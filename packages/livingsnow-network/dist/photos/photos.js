const photosApi = () => {
    const blobUrl = "https://snowalgaestorage.blob.core.windows.net";
    const appPhotosUrl = `${blobUrl}/photos`;
    const getAppPhotoUrl = (id) => `${appPhotosUrl}/${id}.jpg`;
    const micrographsUrl = `${blobUrl}/micrographs`;
    const getMicrographUrl = (name) => `${micrographsUrl}/${name}.jpg`;
    return {
        appPhotosUrl,
        getAppPhotoUrl,
        micrographsUrl,
        getMicrographUrl,
    };
};
const PhotosApi = photosApi();
export { PhotosApi };
