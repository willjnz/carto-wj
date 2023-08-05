import React, { useState } from "react";
import { RGBColor, ColorResult, TwitterPicker } from "react-color";
import "./App.css";
import Map from "./Map";
import {
  ILayerConfig,
  IVisualisationLimits,
  TLayerConfigDispatch,
} from "./react-app-env";

function App() {
  const visualisationLimits: IVisualisationLimits = { min: 1, max: 10000 };

  const [retailStoresConfig, setRetailStoresConfig] = useState<ILayerConfig>({
    fillColor: [141, 211, 199],
    lineColor: [0, 0, 0],
    lineWidth: 2,
    radius: 1000,
    styleByAttribute: false,
  });
  const [socioDemographicsConfig, setSocioDemographicsConfig] =
    useState<ILayerConfig>({
      fillColor: [251, 128, 114],
      lineColor: [0, 0, 0],
      lineWidth: 500,
      radius: 5,
      styleByAttribute: false,
    });

  const handleColorChange = (
    e: ColorResult,
    property: string,
    state: ILayerConfig,
    setter: TLayerConfigDispatch
  ) => {
    const rgb = e.rgb;
    const update = structuredClone(state);
    setter({ ...update, [property]: [rgb.r, rgb.g, rgb.b] });
  };

  const handleNumericChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    property: string,
    state: ILayerConfig,
    setter: TLayerConfigDispatch
  ) => {
    const newValue = parseInt(event.target.value);
    const update = structuredClone(state);
    setter({ ...update, [property]: newValue });
  };

  const convertDeckColorToRgb = (color: [number, number, number]): RGBColor => {
    return { r: color[0], g: color[1], b: color[2] };
  };

  const handleCheckboxToggle = (
    state: ILayerConfig,
    setter: TLayerConfigDispatch
  ) => {
    const update = structuredClone(state);
    setter({ ...update, styleByAttribute: !update.styleByAttribute });
  };

  const layers = [
    {
      name: "Retail Stores",
      attr: "Revenue",
      legendItems: [1500000, 1100000, 0],
      config: retailStoresConfig,
      setter: setRetailStoresConfig,
    },
    {
      name: "Sociodemographics USA Blockgroup",
      attr: "Population",
      legendItems: [2000, 1000, 0],
      config: socioDemographicsConfig,
      setter: setSocioDemographicsConfig,
    },
  ];
  const colorSettings = ["fillColor", "lineColor"];
  const camelCaseToTitleCase = (str: string): string => {
    // split the camelCase string into words
    const words = str.split(/(?=[A-Z])/);
    // Capitalize the first letter of each word and convert the rest to lowercase
    const result = words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
    return result;
  };

  function Legend(props: { items: number[] }): JSX.Element {
    const { items } = props;
    const colors = ["#ff8800", "#ffaf55", "#ffd7aa"];
    return (
      <div className="Legend">
        {items.map((li, i) => (
          <div key={li} className="LegendItem">
            <div
              className="LegendColor"
              style={{ backgroundColor: colors[i] }}
            ></div>
            <p
              className="LegendText">{li}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="App">
      <div className="PanelLeft">
        <h1>Layers</h1>
        {layers.map((layer) => (
          <div key={JSON.stringify(layer.config)} className="LayerGroup">
            <h3>{camelCaseToTitleCase(layer.name)}</h3>
            {colorSettings.map((cs) => (
              <div key={cs}>
                <p>{camelCaseToTitleCase(cs)}</p>
                <TwitterPicker
                  className="LayerControl"
                  // @ts-ignore
                  color={convertDeckColorToRgb(layer.config[cs])}
                  onChange={(e) =>
                    handleColorChange(e, cs, layer.config, layer.setter)
                  }
                />
              </div>
            ))}
            <div className="LayerControl">
              <label htmlFor={`${layer.name}RadiusInput`}>Radius: </label>
              <input
                type="number"
                id={`${layer.name}RadiusInput`}
                value={layer.config.radius}
                onChange={(e) =>
                  handleNumericChange(e, "radius", layer.config, layer.setter)
                }
                min={visualisationLimits.min}
                max={visualisationLimits.max}
              />
            </div>
            <div className="LayerControl">
              <label htmlFor={`${layer.name}LineWidthInput`}>
                Line Width:{" "}
              </label>
              <input
                type="number"
                id={`${layer.name}LineWidthInput`}
                value={layer.config.lineWidth}
                onChange={(e) =>
                  handleNumericChange(
                    e,
                    "lineWidth",
                    layer.config,
                    layer.setter
                  )
                }
                min={visualisationLimits.min}
                max={visualisationLimits.max}
              />
            </div>
            <div className="LayerControl">
              <label htmlFor="retailStoresConfigAttributeInput">
                {/* // : 'Revenue' ? 'Population'}`? */}
                Style by {layer.attr}:
              </label>
              <input
                type="checkbox"
                checked={layer.config.styleByAttribute}
                onChange={() =>
                  handleCheckboxToggle(layer.config, layer.setter)
                }
              />
              {layer.config.styleByAttribute && (
                <Legend items={layer.legendItems} />
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="PanelRight">
        <Map
          retailStoresConfig={retailStoresConfig}
          socioDemographicsConfig={socioDemographicsConfig}
          visualisationLimits={visualisationLimits}
        />
      </div>
    </div>
  );
}

export default App;
