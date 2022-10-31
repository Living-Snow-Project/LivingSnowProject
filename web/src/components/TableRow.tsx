import React from "react";
import { photosBlobStorageEndpoint } from "../constants/service";

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

function FormatPhotos(photos: any[]) {
  return photos.map((item, index) => {
    const first = index === 0;
    return (
      <>
        {!first && <br />}
        <a
          target={"_blank"}
          rel="noopener noreferrer"
          href={`${photosBlobStorageEndpoint}/${item.uri}.jpg`}
        >
          {index + 1}
        </a>
      </>
    );
  });
}

function TableRow(props: any) {
  let name = props.item?.name ? props.item.name : `Anonymous`;
  name = name.concat(
    props.item?.organization ? ` (${props.item.organization})` : ``
  );

  return (
    <tr style={props.style}>
      <td>{props.item.date}</td>
      <td>{`${name}`}</td>
      <td>{props.item.type}</td>
      <td>{props.item?.tubeId ? props.item.tubeId : ``}</td>
      <td>{`${props.item.latitude}, ${props.item.longitude}`}</td>
      <td>{props.item?.size ? props.item.size : ``}</td>
      <td>{props.item?.color ? props.item.color : ``}</td>
      <td>
        {props.item?.locationDescription ? props.item.locationDescription : ``}
      </td>
      <td>{props.item?.notes ? props.item.notes : ``}</td>
      <td>{props.item?.photos ? FormatPhotos(props.item.photos) : ``}</td>
    </tr>
  );
}

export { TableHeader, TableRow };
