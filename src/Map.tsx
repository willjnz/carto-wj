import React, { useState } from "react";
import DeckGL from "@deck.gl/react/typed";
import StaticMap from "react-map-gl";
import {
  BASEMAP,
  CartoLayer,
  setDefaultCredentials,
  MAP_TYPES,
} from "@deck.gl/carto/typed";
import "./Map.css";
import { IVisualisationLimits, ILayerConfig } from "./react-app-env";

setDefaultCredentials({
  accessToken: process.env.REACT_APP_CARTO_accessToken,
  apiBaseUrl: process.env.REACT_APP_CARTO_apiBaseUrl,
});

function Map(props: {
  retailStoresConfig: ILayerConfig;
  socioDemographicsConfig: ILayerConfig;
  visualisationLimits: IVisualisationLimits;
}) {
  const { retailStoresConfig, socioDemographicsConfig, visualisationLimits } =
    props;
  const [popupInfo, setPopupInfo] = useState<any>(null);
  const initialViewState = {
    latitude: 42,
    longitude: -110,
    zoom: 2,
  };
  const handleFeatureClick = (info: any, event: any) => {
    setPopupInfo(info);
  };

  const renderPopup = () => {
    if (!popupInfo) return null;

    const { object } = popupInfo;

    return (
      <div
        style={{
          position: "absolute",
          top: popupInfo.y,
          left: popupInfo.x,
          background: "white",
          padding: "5px",
        }}
      >
        {Object.entries(object.properties).map(([key, value]: [any, any]) => (
          <div key={key}>
            <strong>{key}:</strong> {value}
          </div>
        ))}
      </div>
    );
  };
  const handleViewStateChange = () => {
    // Check if zoom level has changed
    // Close the popup by setting popupInfo to null
    if (popupInfo) {
      setPopupInfo(null);
    }
  };
  const basicLayerConfig = {
    radiusMinPixels: visualisationLimits.min,
    radiusMaxPixels: visualisationLimits.max,
    lineWidthMinPixels: visualisationLimits.min,
    lineWidthMaxPixels: visualisationLimits.max,
    stroked: true,
    filled: true,
    pickable: true,
    onClick: handleFeatureClick,
  };
  const retailStoresLayer = new CartoLayer({
    ...basicLayerConfig,
    id: "retail_stores",
    name: "retail_stores",
    type: MAP_TYPES.TABLE,
    connection: "carto_dw",
    source: "carto-demo-data.demo_tables.retail_stores",
    geoColumn: "geom",
    getFillColor: (feature: any) => {
      // style by attribute or user selected color
      if (retailStoresConfig.styleByAttribute) {
        const revenue = feature.properties.revenue;
        if (revenue > 1500000) return [255, 136, 0];
        else if (revenue > 1100000) return [255, 175, 85];
        else return [255, 215, 170];
      } else return retailStoresConfig.fillColor;
    },
    getLineColor: retailStoresConfig.lineColor,
    getPointRadius: retailStoresConfig.radius,
    getLineWidth: retailStoresConfig.lineWidth,
    updateTriggers: {
      getFillColor: [
        retailStoresConfig.styleByAttribute,
        retailStoresConfig.fillColor,
      ],
    },
  });
  const socioDemographicsLayer = new CartoLayer({
    ...basicLayerConfig,
    id: "sociodemographics_usa_blockgroup",
    name: "sociodemographics_usa_blockgroup",
    type: MAP_TYPES.TILESET,
    connection: "carto_dw",
    data: "carto-demo-data.demo_tilesets.sociodemographics_usa_blockgroup",
    getFillColor: (feature: any) => {
      // style by attribute or user selected color
      if (socioDemographicsConfig.styleByAttribute) {
        const population = feature.properties.total_pop;
        if (population > 2000) return [255, 136, 0];
        else if (population > 1000) return [255, 175, 85];
        else return [255, 215, 170];
      } else return socioDemographicsConfig.fillColor;
    },
    getLineColor: socioDemographicsConfig.lineColor,
    getPointRadius: socioDemographicsConfig.radius,
    getLineWidth: socioDemographicsConfig.lineWidth,
    updateTriggers: {
      getFillColor: [
        socioDemographicsConfig.styleByAttribute,
        socioDemographicsConfig.fillColor,
      ],
    },
  });
  const layers = [socioDemographicsLayer, retailStoresLayer];

  return (
    <div className="MapContainer">
      <DeckGL
        initialViewState={initialViewState}
        controller={true}
        layers={layers}
        width="100%"
        height="100%"
        onViewStateChange={handleViewStateChange}
      >
        <StaticMap mapStyle={BASEMAP.POSITRON} />
      </DeckGL>
      {renderPopup()}
    </div>
  );
}

export default Map;
