const photosApi = () => {
    const blobUrl = "https://snowalgaestorage.blob.core.windows.net";
    const appPhotosUrl = `${blobUrl}/photos`;
    // id = Photo.uri => filename without .jpg extension
    const getAppPhotoUrl = (id) => `${appPhotosUrl}/${id}.jpg`;
    // though micrographs are JPG, they are stored in their own blob container
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
