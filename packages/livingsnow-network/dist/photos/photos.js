const photosApi = () => {
    const blobUrl = "https://snowalgaestorage.blob.core.windows.net";
    const appPhotosUrl = `${blobUrl}/photos`;
    // id = Photo.uri => filename without .jpg extension
    const getAppPhotoUrl = (id) => `${appPhotosUrl}/${id}.jpg`;
<<<<<<< HEAD
    // though micrographs are JPG and same as AppPhotos, they are stored in a separate blob container
=======
    // though micrographs are JPG, they are stored in their own blob container
>>>>>>> ec434b603b552a78f61af0942bb07363fd906605
    const micrographsUrl = `${blobUrl}/micrographs`;
    // filename = Micrograph.uri => with .jpg extension
    const getMicrographUrl = (filename) => `${micrographsUrl}/${filename}`;
    return {
        appPhotosUrl,
        getAppPhotoUrl,
        micrographsUrl,
        getMicrographUrl,
    };
};
const PhotosApi = photosApi();
export { PhotosApi };
