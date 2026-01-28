import React from "react";
import {
  PlatformColor,
  Pressable,
  Text,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";

type PrimaryButtonProps = Omit<PressableProps, "children"> & {
  label: string;
  accessory?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

const baseStyle: ViewStyle = {
  minHeight: 48,
  paddingHorizontal: 16,
  borderRadius: 14,
  borderCurve: "continuous",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "row",
  gap: 8,
};

const labelStyle: TextStyle = {
  fontSize: 17,
  fontWeight: "600",
  color: PlatformColor("systemBackground"),
};

const PrimaryButton = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  PrimaryButtonProps
>(({ label, accessory, style, textStyle, disabled, accessibilityLabel, ...props }, ref) => {
  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      disabled={disabled}
      style={({ pressed }) => [
        baseStyle,
        { backgroundColor: PlatformColor("label") },
        pressed && { opacity: 0.9 },
        disabled && { opacity: 0.5 },
        style,
      ]}
      {...props}
    >
      <Text selectable style={[labelStyle, textStyle]}>
        {label}
      </Text>
      {accessory}
    </Pressable>
  );
});

PrimaryButton.displayName = "PrimaryButton";

export default PrimaryButton;
