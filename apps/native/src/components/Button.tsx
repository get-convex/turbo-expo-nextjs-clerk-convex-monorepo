import React from "react";
import {
  Pressable,
  Text,
  type PressableProps,
  type ViewStyle,
  type TextStyle,
  type StyleProp,
} from "react-native";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = Omit<PressableProps, "children"> & {
  label: string;
  variant?: ButtonVariant;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  href?: string;
};

const baseStyle: ViewStyle = {
  minHeight: 48,
  paddingHorizontal: 16,
  borderRadius: 16,
  borderCurve: "continuous",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "row",
  gap: 8,
};

const variantStyles: Record<ButtonVariant, ViewStyle> = {
  primary: {
    backgroundColor: "#111827",
  },
  secondary: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  ghost: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
};

const textStyles: Record<ButtonVariant, TextStyle> = {
  primary: {
    color: "#F9FAFB",
    fontSize: 16,
    fontWeight: "600",
  },
  secondary: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "600",
  },
  ghost: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "600",
  },
};

const Button = React.forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>(
  ({ label, variant = "primary", style, textStyle, ...pressableProps }, ref) => {
    return (
      <Pressable
        ref={ref}
        accessibilityRole="button"
        style={({ pressed }) => [
          baseStyle,
          variantStyles[variant],
          pressed && { opacity: 0.85 },
          style,
        ]}
        {...pressableProps}
      >
        <Text selectable style={[textStyles[variant], textStyle]}>
          {label}
        </Text>
      </Pressable>
    );
  }
);

Button.displayName = "Button";

export default Button;
