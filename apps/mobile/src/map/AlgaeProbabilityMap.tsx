import React, { useEffect, useState, useMemo } from "react";
import { View, ActivityIndicator } from "react-native";
import MapView, { LatLng, Marker, Polygon } from "react-native-maps";
import alpsOutline from "./mountain.json";
import predictedAlgae from "./polygones.json";

type GeoJsonGeometry =
  | {
      type: "Polygon";
      // ie. coordinates[0] = outer boundary of polygon
      //     coordinates[1] = hole inside polygon
      //     coordinates[0][0] = 1st coordinate in polygon boundary
      //     coordinates[0][0][0] = longitude of 1st coordinate in polygon ("x")
      //     coordinates[0][0][1] = latitude of 1st coordinate in polygon ("y")
      coordinates: number[][][];
    }
  | {
      type: "MultiPolygon";
      // if type = "MultiPolygon", then this is an array of Polygons with an array of coordinates
      // ie. coordinates[0] = 1st polygon
      //     coordinates[0][0] = outer boundary of 1st polygon
      //     coordinates[0][1] = hole inside 1st polygon
      //     coordinates[0][0][0] = 1st coordinate in 1st polygon
      //     coordinates[0][0][0][0] = longitude of 1st coordinate in 1st polygon ("x")
      //     coordinates[0][0][0][1] = latitude of 1st coordinate in 1st polygon ("y")
      coordinates: number[][][][];
    };

type GeoJson = {
  type: string; // ie. "FeatureCollection"
  features: [
    {
      type: string; // ie. "Feature"
      geometry: GeoJsonGeometry;

      properties: {
        id?: string;
        surface?: number;
        fid?: number;
        ID?: number;
        EVEV?: number;
      };

      id: string;
    },
  ];
};

export default function AlgaeProbabilityMap() {
  const [loading, setLoading] = useState(true);

  const algaeAreas = useMemo(
    () =>
      // inferred type is wrong, probably because json file is very large
      (predictedAlgae as GeoJson).features.map((feature, idx) => {
        if (
          feature.geometry.type == "Polygon" ||
          feature.geometry.type == "MultiPolygon"
        ) {
          const polygons = convertGeoJSONToPolygonCoords(feature.geometry);

          return polygons.map((coords, ringIndex) => (
            <Polygon
              key={`algae-${idx}-${ringIndex}`}
              coordinates={coords}
              fillColor="rgba(160, 0, 0, 0.4)" // updated fill color
              strokeColor="#A00000" // updated stroke color
              strokeWidth={1}
            />
          ));
        }

        return null; // skip lines or points
      }),
    [],
  );

  const alpsPolygon = useMemo(
    () =>
      // typing is goofy but it's a fallout of the predictedAlgae inferred type not being correct
      (alpsOutline as unknown as GeoJson).features.map((feature, idx) => {
        if (
          feature.geometry.type == "Polygon" ||
          feature.geometry.type == "MultiPolygon"
        ) {
          const polygons = convertGeoJSONToPolygonCoords(feature.geometry);

          return polygons.map((coords, ringIndex) => (
            <Polygon
              key={`mountain-${idx}-${ringIndex}`}
              coordinates={coords}
              fillColor="rgba(0, 0, 0, 0.0)" // transparent
              strokeColor="black"
              strokeWidth={2}
            />
          ));
        }

        return null; // skip lines or points
      }),
    [],
  );

  const [sightingFeatures, setSightingFeatures] = useState<
    React.JSX.Element[] | null
  >(null);

  useEffect(() => {
    fetch(
      "https://snowalgaeproductionapp.azurewebsites.net/api/v3/records?data_format=geojson",
    )
      .then((res) => res.json())
      .then((remoteGeojson) => {
        // If the structure is { data: { features: [...] } }, do this:
        const fetchedFeatures = remoteGeojson?.data?.features || [];

        setSightingFeatures(
          fetchedFeatures.map((feature, idx) => {
            const { geometry, properties } = feature;
            if (
              geometry.type == "Point" &&
              Array.isArray(geometry.coordinates)
            ) {
              const [lng, lat] = geometry.coordinates;
              return (
                <Marker
                  key={`sighting-${idx}`}
                  coordinate={{ latitude: lat, longitude: lng }}
                  title={properties?.type || "Sighting"}
                  description={properties?.name || ""}
                />
              );
            }

            return null; // skip polygons/lines
          }),
        );
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching sightings:", err);
        // Even if fetch fails, we'll still show mountains + algae
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView style={{ flex: 1 }}>
        {alpsPolygon}
        {algaeAreas}
        {sightingFeatures}
      </MapView>
    </View>
  );
}

// Helper that takes a Polygon or MultiPolygon geometry
// => returns an array of coordinate arrays in react-native-maps format
function convertGeoJSONToPolygonCoords(geometry: GeoJsonGeometry): LatLng[][] {
  if (geometry.type == "Polygon") {
    return geometry.coordinates.map((ring: number[][]) =>
      ring.map(([lng, lat]) => ({
        latitude: lat,
        longitude: lng,
      })),
    );
  } else if (geometry.type == "MultiPolygon") {
    // even though "MultiPolygon" is encountered, in practice, the files supplied only contain a single polygon under this type
    const allPolygons: LatLng[][] = [];

    geometry.coordinates.forEach((polygon: number[][][]) => {
      polygon.forEach((ring: number[][]) => {
        const ringCoords = ring.map(([lng, lat]) => ({
          latitude: lat,
          longitude: lng,
        }));

        allPolygons.push(ringCoords);
      });
    });

    return allPolygons;
  }

  // ignore lines or points
  return [];
}
