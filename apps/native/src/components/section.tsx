import React from "react";
import {
  PlatformColor,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

type SectionProps = {
  title?: string;
  footnote?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function Section({ title, footnote, children, style }: SectionProps) {
  const items = React.Children.toArray(children);

  return (
    <View style={[{ gap: 8 }, style]}>
      {title ? (
        <Text
          selectable
          style={{
            fontSize: 17,
            fontWeight: "600",
            color: PlatformColor("label"),
          }}
        >
          {title}
        </Text>
      ) : null}
      <View
        style={{
          backgroundColor: PlatformColor("secondarySystemGroupedBackground"),
          borderRadius: 16,
          borderCurve: "continuous",
          overflow: "hidden",
        }}
      >
        {items.map((child, index) => (
          <React.Fragment key={`section-${index}`}>
            {child}
            {index < items.length - 1 ? (
              <View
                style={{
                  height: StyleSheet.hairlineWidth,
                  backgroundColor: PlatformColor("separator"),
                  marginLeft: 16,
                }}
              />
            ) : null}
          </React.Fragment>
        ))}
      </View>
      {footnote ? (
        <Text
          selectable
          style={{
            fontSize: 13,
            color: PlatformColor("secondaryLabel"),
            lineHeight: 18,
          }}
        >
          {footnote}
        </Text>
      ) : null}
    </View>
  );
}
