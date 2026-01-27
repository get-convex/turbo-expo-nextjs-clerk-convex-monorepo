import React from "react";
import { View, type ViewStyle, type StyleProp } from "react-native";

type CardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const baseStyle: ViewStyle = {
  backgroundColor: "#FFFFFF",
  borderRadius: 20,
  borderCurve: "continuous",
  padding: 16,
  borderWidth: 1,
  borderColor: "#E5E7EB",
  boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
};

export default function Card({ children, style }: CardProps) {
  return <View style={[baseStyle, style]}>{children}</View>;
}
