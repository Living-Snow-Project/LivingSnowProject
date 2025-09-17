// TODO: this should all be ImagesApi or Micrograph should have its own API
const photosApi = () => {
    const storageUrl = "https://snowalgaestorage.blob.core.windows.net";
    const baseApiUrl = `https://snowalgaeproductionapp.azurewebsites.net/api/photos`;
    const appPhotosContainerUrl = `${storageUrl}/photos`;
    const appPhotoThumbnailsContainerUrl = `${storageUrl}/photo-thumbnails`;
    // id = Photo.uri => filename without .jpg extension
    const getAppPhotoUrl = (id) => `${appPhotosContainerUrl}/${id}.jpg`;
    const getAppPhotoThumbnailUrl = (id) => `${appPhotoThumbnailsContainerUrl}/${id}_thumb.jpg`;
    const deletePhoto = (id, accessToken) => {
        return fetch(`${baseApiUrl}/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
    };
    // though micrographs are JPG, they are stored in their own blob container
    const micrographsContainerUrl = `${storageUrl}/micrographs`;
    const micrographThumbnailsContainerUrl = `${storageUrl}/micrograph-thumbnails`;
    // filename = Micrograph.uri => with .jpg extension
    const getMicrographUrl = (filename) => `${micrographsContainerUrl}/${filename}`;
    // extract the filename from the URL and add "_thumb" before the file extension
    const getMicrographThumbnailUrl = (filename) => {
        const lastSlashIndex = filename.lastIndexOf("/");
        filename = filename.substring(lastSlashIndex + 1);
        const dotIndex = filename.lastIndexOf(".");
        if (dotIndex === -1) {
            // No extension found, just append "_thumb"
            return filename + "_thumb.jpg";
        }
        const nameWithoutExt = filename.substring(0, dotIndex);
        const extension = filename.substring(dotIndex);
        const thumbnailFilename = nameWithoutExt + "_thumb" + extension;
        return `${micrographThumbnailsContainerUrl}/${filename.substring(0, lastSlashIndex + 1)}${thumbnailFilename}`;
    };
    return {
        appPhotosContainerUrl,
        appPhotoThumbnailsContainerUrl,
        getAppPhotoUrl,
        getAppPhotoThumbnailUrl,
        deletePhoto,
        micrographsContainerUrl,
        micrographThumbnailsContainerUrl,
        getMicrographUrl,
        getMicrographThumbnailUrl,
    };
};
const PhotosApi = photosApi();
export { PhotosApi };
