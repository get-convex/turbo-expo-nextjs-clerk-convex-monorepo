import React from "react";
import {
  Pressable,
  Text,
  type PressableProps,
  type ViewStyle,
  type TextStyle,
} from "react-native";

type ChoicePillProps = Omit<PressableProps, "children"> & {
  label: string;
  selected?: boolean;
};

export default function ChoicePill({
  label,
  selected = false,
  ...pressableProps
}: ChoicePillProps) {
  const baseStyle: ViewStyle = {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: selected ? "#111827" : "#D1D5DB",
    backgroundColor: selected ? "#111827" : "#FFFFFF",
  };

  const textStyle: TextStyle = {
    color: selected ? "#F9FAFB" : "#111827",
    fontSize: 14,
    fontWeight: "600",
  };

  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        baseStyle,
        pressed && { opacity: 0.85 },
      ]}
      {...pressableProps}
    >
      <Text selectable style={textStyle}>
        {label}
      </Text>
    </Pressable>
  );
}
