import React, { useState } from "react";
import { RGBColor, ColorResult, TwitterPicker } from "react-color";
import "./App.css";
import Map from "./Map";
import { ILayerConfig, TLayerConfigDispatch } from "./react-app-env";

function App() {
  const [retailStoresConfig, setRetailStoresConfig] = useState<ILayerConfig>({
    fillColor: [141, 211, 199],
    lineColor: [0, 0, 0],
    lineWidth: 200,
    radius: 1000,
    styleByAttribute: false,
  });
  const [socioDemographicsConfig, setSocioDemographicsConfig] =
    useState<ILayerConfig>({
      fillColor: [251, 128, 114],
      lineColor: [0, 0, 0],
      lineWidth: 500,
      radius: 1,
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

  const convertDeckColorToRgb = (color: [number, number, number]): RGBColor => {
    return { r: color[0], g: color[1], b: color[2] };
  };

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

  function Legend(props: {
    items: { color: string; value: number }[];
  }): JSX.Element {
    const { items } = props;
    return (
      <div className="Legend">
        {items.map((li, i) => (
          <div key={li.color + li.value} className="LegendItem">
            <div
              className="LegendColor"
              style={{ backgroundColor: li.color }}
            ></div>
            <p className="LegendText">&gt;{li.value}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="App">
      <div className="PanelLeft">
        <h1>Layers</h1>
        <div className="LayerGroup">
          <h3>Retail Stores</h3>
          {colorSettings.map((cs) => (
            <div key={cs}>
              <p>{camelCaseToTitleCase(cs)}</p>
              <TwitterPicker
                className="LayerControl"
                // @ts-ignore
                color={convertDeckColorToRgb(retailStoresConfig[cs])}
                onChange={(e) =>
                  handleColorChange(
                    e,
                    cs,
                    retailStoresConfig,
                    setRetailStoresConfig
                  )
                }
              />
            </div>
          ))}
          <div className="LayerControl">
            <label htmlFor="retailStoresRadiusInput">Radius: </label>
            <input
              type="number"
              id="retailStoresRadiusInput"
              value={retailStoresConfig.radius}
              onChange={(e) =>
                setRetailStoresConfig({
                  ...retailStoresConfig,
                  radius: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div className="LayerControl">
            <label htmlFor="retailStoresRadiusInputLineWidthInput">
              Line Width:{" "}
            </label>
            <input
              type="number"
              id="retailStoresRadiusInputLineWidthInput"
              value={retailStoresConfig.lineWidth}
              onChange={(e) =>
                setRetailStoresConfig({
                  ...retailStoresConfig,
                  lineWidth: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div className="LayerControl">
            <label htmlFor="retailStoresConfigAttributeInput">
              Style by Revenue:
            </label>
            <input
              id="retailStoresConfigAttributeInput"
              type="checkbox"
              checked={retailStoresConfig.styleByAttribute}
              onChange={() => {
                setRetailStoresConfig({
                  ...retailStoresConfig,
                  styleByAttribute: !retailStoresConfig.styleByAttribute,
                });
              }}
            />
            {retailStoresConfig.styleByAttribute && (
              <Legend
                items={[
                  { color: "#ff8800", value: 1500000 },
                  { color: "#ffaf55", value: 1100000 },
                  { color: "#ffd7aa", value: 0 },
                ]}
              />
            )}
          </div>
        </div>
        <div className="LayerGroup">
          <h3>Sociodemographics USA Blockgroup</h3>
          {colorSettings.map((cs) => (
            <div key={cs}>
              <p>{camelCaseToTitleCase(cs)}</p>
              <TwitterPicker
                className="LayerControl"
                // @ts-ignore
                color={convertDeckColorToRgb(socioDemographicsConfig[cs])}
                onChange={(e) =>
                  handleColorChange(
                    e,
                    cs,
                    socioDemographicsConfig,
                    setSocioDemographicsConfig
                  )
                }
              />
            </div>
          ))}
          <div className="LayerControl">
            <label htmlFor="socioDemographicsRadiusInput">Radius: </label>
            <input
              type="number"
              id="socioDemographicsRadiusInput"
              value={socioDemographicsConfig.radius}
              onChange={(e) =>
                setSocioDemographicsConfig({
                  ...socioDemographicsConfig,
                  radius: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div className="LayerControl">
            <label htmlFor="socioDemographicsRadiusInputLineWidthInput">
              Line Width:{" "}
            </label>
            <input
              type="number"
              id="socioDemographicsRadiusInputLineWidthInput"
              value={socioDemographicsConfig.lineWidth}
              onChange={(e) =>
                setSocioDemographicsConfig({
                  ...socioDemographicsConfig,
                  lineWidth: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div className="LayerControl">
            <label htmlFor="socioDemographicsConfigAttributeInput">
              Style by Population:
            </label>
            <input
              id="socioDemographicsConfigAttributeInput"
              type="checkbox"
              checked={socioDemographicsConfig.styleByAttribute}
              onChange={() => {
                setSocioDemographicsConfig({
                  ...socioDemographicsConfig,
                  styleByAttribute: !socioDemographicsConfig.styleByAttribute,
                });
              }}
            />
            {socioDemographicsConfig.styleByAttribute && (
              <Legend
                items={[
                  { color: "#03b6fc", value: 2000 },
                  { color: "#60d0fc", value: 1000 },
                  { color: "#a8e7ff", value: 0 },
                ]}
              />
            )}
          </div>
        </div>
      </div>
      <div className="PanelRight">
        <Map
          retailStoresConfig={retailStoresConfig}
          socioDemographicsConfig={socioDemographicsConfig}
        />
      </div>
    </div>
  );
}

export default App;
