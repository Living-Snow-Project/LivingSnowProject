declare const PhotosApi: {
    appPhotosContainerUrl: string;
    appPhotoThumbnailsContainerUri: string;
    getAppPhotoUrl: (id: string) => string;
    getAppPhotoThumbnailUrl: (id: string) => string;
    micrographsContainerUrl: string;
    micrographThumbnailsContainerUrl: string;
    getMicrographUrl: (filename: string) => string;
    getMicrographThumbnailUrl: (filename: string) => string;
};
export { PhotosApi };
//# sourceMappingURL=photos.d.ts.map