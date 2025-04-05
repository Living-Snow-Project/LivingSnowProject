import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import MapView, { Marker, Polygon } from "react-native-maps";

export default function AlgaeProbabilityMap() {
  const [loading, setLoading] = useState(true);

  // We'll store each data source in separate arrays
  const [mountainFeatures, setMountainFeatures] = useState<any[]>([]);
  const [algaeFeatures, setAlgaeFeatures] = useState<any[]>([]);
  const [sightingFeatures, setSightingFeatures] = useState<any[]>([]);

  useEffect(() => {
    // 1) Load mountain outlines (black)
    const mountainGeojson = require("./mountain.json");
    setMountainFeatures(mountainGeojson.features || []);

    // 2) Load red algae polygons
    const algaeGeojson = require("./red_algae_in_alpine_snow.json");
    setAlgaeFeatures(algaeGeojson.features || []);

    // 3) Fetch the sightings from the remote API
    fetch("https://snowalgaeproductionapp.azurewebsites.net/api/v3/records?data_format=geojson")
      .then((res) => res.json())
      .then((remoteGeojson) => {
        // If the structure is { data: { features: [...] } }, do this:
        const fetchedFeatures = remoteGeojson?.data?.features || [];
        setSightingFeatures(fetchedFeatures);``
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
        {/* 1) Render mountain polygons (black outline, no fill) */}
        {mountainFeatures.map((feature, idx) => {
          if (feature.geometry.type === "Polygon" || feature.geometry.type === "MultiPolygon") {
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
        })}

        {/* 2) Render red algae polygons (semi‐transparent red fill) */}
        {algaeFeatures.map((feature, idx) => {
          if (feature.geometry.type === "Polygon" || feature.geometry.type === "MultiPolygon") {
            const polygons = convertGeoJSONToPolygonCoords(feature.geometry);
            return polygons.map((coords, ringIndex) => (
              <Polygon
                key={`algae-${idx}-${ringIndex}`}
                coordinates={coords}
                fillColor="rgba(160, 0, 0, 0.4)"   // updated fill color
                strokeColor="#A00000"             // updated stroke color
                strokeWidth={1}
              />
            ));
          }
          return null;
        })}

        {/* 3) Render sighting points as Markers */}
        {sightingFeatures.map((feature, idx) => {
          const { geometry, properties } = feature;
          if (geometry.type === "Point" && Array.isArray(geometry.coordinates)) {
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
          return null; // skip polygons/lines in sightings
        })}
      </MapView>
    </View>
  );
}

// Helper that takes a Polygon or MultiPolygon geometry
// => returns an array of coordinate arrays in react-native-maps format
function convertGeoJSONToPolygonCoords(
  geometry: { type: string; coordinates: any }
): { latitude: number; longitude: number }[][] {
  if (geometry.type === "Polygon") {
    // geometry.coordinates = [ [ [lng, lat], ...], [Ring2], ... ]
    return geometry.coordinates.map((ring: number[][]) =>
      ring.map(([lng, lat]) => ({
        latitude: lat,
        longitude: lng,
      }))
    );
  } else if (geometry.type === "MultiPolygon") {
    // geometry.coordinates = [ [Ring1, Ring2], [Polygon2], ... ]
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
  // for lines or points, ignore
  return [];
}