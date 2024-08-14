const photosApi = () => {
    const blobUrl = "https://snowalgaestorage.blob.core.windows.net";
    const appPhotosUrl = `${blobUrl}/photos`;
    const getAppPhotoUrl = (id) => `${appPhotosUrl}/${id}.jpg`;
    // though micrographs are JPG and same as AppPhotos, they are stored in a separate blob container
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
