import React from "react";
import { PlatformColor, Pressable, Text, View } from "react-native";

type SegmentedControlProps = {
  values: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
};

export default function SegmentedControl({
  values,
  selectedIndex,
  onChange,
}: SegmentedControlProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        padding: 4,
        borderRadius: 12,
        borderCurve: "continuous",
        backgroundColor: PlatformColor("tertiarySystemFill"),
        gap: 4,
      }}
    >
      {values.map((value, index) => {
        const selected = index === selectedIndex;
        return (
          <Pressable
            key={value}
            accessibilityRole="tab"
            accessibilityLabel={value}
            accessibilityState={{ selected }}
            onPress={() => onChange(index)}
            style={({ pressed }) => [
              {
                flex: 1,
                minHeight: 32,
                borderRadius: 9,
                borderCurve: "continuous",
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 10,
                backgroundColor: selected
                  ? PlatformColor("systemBackground")
                  : "transparent",
              },
              pressed && !selected
                ? { backgroundColor: PlatformColor("quaternarySystemFill") }
                : null,
            ]}
          >
            <Text
              selectable
              style={{
                fontSize: 15,
                fontWeight: "600",
                color: selected
                  ? PlatformColor("label")
                  : PlatformColor("secondaryLabel"),
              }}
            >
              {value}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
