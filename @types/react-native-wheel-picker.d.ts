declare module "react-native-wheel-picker" {
  import * as React from "react";
  import { ViewProps } from "react-native";

  export interface WheelPickerProps extends ViewProps {
    data: string[];
    selectedItem: number;
    onItemSelected: (index: number) => void;
    itemTextSize?: number;
    selectedItemTextColor?: string;
    itemTextColor?: string;
    style?: any;
  }

  export default class WheelPicker extends React.Component<WheelPickerProps> {
    static Item: React.ComponentType<any>;
  }
}
