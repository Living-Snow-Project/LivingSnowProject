declare const PhotosApi: {
    appPhotosContainerUrl: string;
    appPhotoThumbnailsContainerUrl: string;
    getAppPhotoUrl: (id: string) => string;
    getAppPhotoThumbnailUrl: (id: string) => string;
    deletePhoto: (id: string, accessToken: string) => Promise<Response>;
    micrographsContainerUrl: string;
    micrographThumbnailsContainerUrl: string;
    getMicrographUrl: (filename: string) => string;
    getMicrographThumbnailUrl: (filename: string) => string;
};
export { PhotosApi };
//# sourceMappingURL=photos.d.ts.map