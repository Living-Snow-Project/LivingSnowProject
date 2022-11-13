import { AlgaeRecord, Photo } from "@livingsnow/record";
import { photosBlobStorageEndpoint } from "@livingsnow/network";

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
        <td>Color</td>
        <td>Description</td>
        <td>Notes</td>
        <td>Photos</td>
      </tr>
    </thead>
  );
}

function FormatPhotos(photos: Photo[]) {
  return photos.map((item, index) => {
    return (
      <div key={index}>
        <a
          target={"_blank"}
          rel="noopener noreferrer"
          href={`${photosBlobStorageEndpoint}/${item.uri}.jpg`}
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
};

function TableRow({ style, item }: TableRowProps) {
  let name = item.name || `Anonymous`;
  name = name.concat(item.organization ? ` (${item.organization})` : ``);
  const photos = item.photos ? FormatPhotos(item.photos) : ``;

  return (
    <tr style={style}>
      <td>{item.date.toDateString()}</td>
      <td>{name}</td>
      <td>{item.type}</td>
      <td>{item.tubeId || ``}</td>
      <td>{`${item.latitude}, ${item.longitude}`}</td>
      <td>{item.size || ``}</td>
      <td>{item.color || ``}</td>
      <td>{item.locationDescription || ``}</td>
      <td>{item.notes || ``}</td>
      <td>{photos}</td>
    </tr>
  );
}

export { TableHeader, TableRow };
