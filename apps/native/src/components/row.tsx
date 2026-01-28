import React from "react";
import {
  PlatformColor,
  Pressable,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";

type RowProps = Omit<PressableProps, "children"> & {
  title: string;
  subtitle?: string;
  value?: string;
  accessory?: React.ReactNode;
  showChevron?: boolean;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
};

const baseStyle: ViewStyle = {
  paddingHorizontal: 16,
  paddingVertical: 12,
  flexDirection: "row",
  alignItems: "center",
  gap: 12,
  minHeight: 44,
};

export default function Row({
  title,
  subtitle,
  value,
  accessory,
  showChevron = false,
  style,
  titleStyle,
  disabled,
  onPress,
  accessibilityLabel,
  ...pressableProps
}: RowProps) {
  const content = (
    <>
      <View style={{ flex: 1, gap: 4 }}>
        <Text
          selectable
          style={[
            {
              fontSize: 17,
              fontWeight: "600",
              color: PlatformColor("label"),
            },
            titleStyle,
          ]}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            selectable
            style={{
              fontSize: 15,
              color: PlatformColor("secondaryLabel"),
              lineHeight: 20,
            }}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={{ alignItems: "flex-end", gap: 4 }}>
        {value ? (
          <Text
            selectable
            style={{
              fontSize: 17,
              color: PlatformColor("label"),
              fontVariant: ["tabular-nums"],
            }}
          >
            {value}
          </Text>
        ) : null}
        {accessory}
      </View>
      {showChevron ? (
        <Text selectable style={{ fontSize: 18, color: PlatformColor("tertiaryLabel") }}>
          {">"}
        </Text>
      ) : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? title}
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [
          baseStyle,
          pressed && { backgroundColor: PlatformColor("tertiarySystemFill") },
          disabled && { opacity: 0.6 },
          style,
        ]}
        {...pressableProps}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={[baseStyle, style]}>{content}</View>;
}
