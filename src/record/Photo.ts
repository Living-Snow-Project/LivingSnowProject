const randomInteger = (): number => Math.floor(Math.random() * 1_000_000);

const makeExamplePhoto = ({
  isLocal = false,
  uri = `${randomInteger()}`,
  size = randomInteger(),
  width = randomInteger(),
  height = randomInteger(),
} = {}): Photo => ({
  uri: isLocal ? `file://${uri}` : uri,
  size,
  width,
  height,
});

const makeExamplePendingPhoto = ({
  isLocal = false,
  id = randomInteger(),
  uri = `${randomInteger()}`,
  size = randomInteger(),
  width = randomInteger(),
  height = randomInteger(),
} = {}): PendingPhoto => ({
  id,
  ...makeExamplePhoto({ isLocal, uri, size, width, height }),
});

export { makeExamplePhoto, makeExamplePendingPhoto };
