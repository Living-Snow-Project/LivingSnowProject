import { AlgaeRecord } from "@livingsnow/record";
import { PhotosResponseV2 } from "@livingsnow/network";
import { PhotosApi } from "@livingsnow/network";

function TableHeader() {
  return (
    <thead>
      <tr
        style={{
          backgroundColor: "grey",
        }}
      >
        <td>Date</td>
        <td>Name</td>
        <td>Type</td>
        <td>Tube Id</td>
        <td>Coordinates</td>
        <td>Size</td>
        <td>Colors</td>
        <td>Description</td>
        <td>Notes</td>
        <td>Photos</td>
      </tr>
    </thead>
  );
}

function FormatPhotos(photos: PhotosResponseV2) {
  if (!photos.appPhotos) {
    return "";
  }

  return photos.appPhotos.map((item, index) => {
    return (
      <div key={index}>
        <a
          target={"_blank"}
          rel="noopener noreferrer"
          href={PhotosApi.getUrl(item.uri)}
        >
          {index + 1}
        </a>
      </div>
    );
  });
}

type TableRowProps = {
  style: React.CSSProperties;
  item: AlgaeRecord;
  photos: PhotosResponseV2;
};

function TableRow({ style, item, photos }: TableRowProps) {
  let name = item.name || `Anonymous`;
  name = name.concat(item.organization ? ` (${item.organization})` : ``);

  const renderColors = () => {
    if (!item.colors) {
      return "";
    }

    return item.colors.reduce(
      (prev, cur, index) => (index ? `${prev} ${cur}` : cur),
      ""
    );
  };

  return (
    <tr style={style}>
      <td>{item.date.toDateString()}</td>
      <td>{name}</td>
      <td>{item.type}</td>
      <td>{item.tubeId || ``}</td>
      <td>{`${item.latitude}, ${item.longitude}`}</td>
      <td>{item.size || ``}</td>
      <td>{renderColors()}</td>
      <td>{item.locationDescription || ``}</td>
      <td>{item.notes || ``}</td>
      <td>{FormatPhotos(photos)}</td>
    </tr>
  );
}

export { TableHeader, TableRow };
