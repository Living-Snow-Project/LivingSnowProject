import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import MapView, { Marker, Polygon } from "react-native-maps";

export default function AlgaeProbabilityMap() {
  const [loading, setLoading] = useState(true);
  const [features, setFeatures] = useState<any[]>([]);

  useEffect(() => {
    // 1) Fetch the GeoJSON from the API
    fetch("https://snowalgaeproductionapp.azurewebsites.net/api/v3/records?data_format=geojson")
      .then((res) => res.json())
      .then((geojson) => {
        // 2) If your service returns the nested format:
        //    { object: "featureCollection", data: { type: "FeatureCollection", features: [...] } }
        const loadedFeatures = geojson?.data?.features || [];
        setFeatures(loadedFeatures);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching geojson:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView style={{ flex: 1 }}>
        {features.map((feature, index) => {
          const { geometry, properties } = feature;
          const { type, coordinates } = geometry || {};

          // If it's a Point => drop a Marker
          if (type === "Point" && Array.isArray(coordinates)) {
            const [lng, lat] = coordinates;
            return (
              <Marker
                key={index}
                coordinate={{ latitude: lat, longitude: lng }}
                title={properties?.type}
                description={properties?.name}
              />
            );
          }

          // If it’s a Polygon/MultiPolygon => use your polygon helper
          if (type === "Polygon" || type === "MultiPolygon") {
            const polygons = convertGeoJSONToPolygonCoords(geometry);

            return polygons.map((coords, ringIndex) => (
              <Polygon
                key={`${index}-${ringIndex}`}
                coordinates={coords}
                fillColor="rgba(255, 0, 0, 0.4)"
                strokeColor="#fff"
                strokeWidth={1}
              />
            ));
          }

          // Otherwise, ignore or handle other geometry types
          return null;
        })}
      </MapView>
    </View>
  );
}

// Same helper as before
function convertGeoJSONToPolygonCoords(
  geometry: { type: string; coordinates: any }
): { latitude: number; longitude: number }[][] {
  if (geometry.type === "Polygon") {
    return geometry.coordinates.map((ring: number[][]) =>
      ring.map(([lng, lat]) => ({
        latitude: lat,
        longitude: lng,
      }))
    );
  } else if (geometry.type === "MultiPolygon") {
    const allPolygons: { latitude: number; longitude: number }[][] = [];
    geometry.coordinates.forEach((polygon: number[][][]) => {
      polygon.forEach((ring) => {
        const ringCoords = ring.map(([lng, lat]) => ({
          latitude: lat,
          longitude: lng,
        }));
        allPolygons.push(ringCoords);
      });
    });
    return allPolygons;
  }
  return [];
}