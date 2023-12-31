/// <reference types="react-scripts" />

export interface ILayerConfig {
  fillColor: [number, number, number];
  lineColor: [number, number, number];
  lineWidth: number;
  radius: number;
  styleByAttribute: boolean;
  //   attributeForFillColor?: string | null; // improvement idea: let user select which attribute to style the layer by
}
export type TLayerConfigDispatch = React.Dispatch<
  React.SetStateAction<ILayerConfig>
>;
