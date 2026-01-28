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

type SecondaryButtonProps = Omit<PressableProps, "children"> & {
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
  borderWidth: 1,
  borderColor: PlatformColor("separator"),
};

const labelStyle: TextStyle = {
  fontSize: 17,
  fontWeight: "600",
  color: PlatformColor("label"),
};

const SecondaryButton = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  SecondaryButtonProps
>(({ label, accessory, style, textStyle, disabled, accessibilityLabel, ...props }, ref) => {
  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      disabled={disabled}
      style={({ pressed }) => [
        baseStyle,
        { backgroundColor: PlatformColor("secondarySystemFill") },
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

SecondaryButton.displayName = "SecondaryButton";

export default SecondaryButton;
