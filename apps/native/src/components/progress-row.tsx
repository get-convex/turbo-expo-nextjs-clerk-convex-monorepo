import React from "react";
import { PlatformColor, Text, View } from "react-native";

type ProgressRowProps = {
  title: string;
  value: string;
  progress: number;
  status?: string;
};

export default function ProgressRow({
  title,
  value,
  progress,
  status,
}: ProgressRowProps) {
  const clamped = Math.max(0, Math.min(1, progress));
  const percentage = Math.round(clamped * 100);

  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          selectable
          style={{ fontSize: 17, fontWeight: "600", color: PlatformColor("label") }}
        >
          {title}
        </Text>
        <Text
          selectable
          style={{
            fontSize: 15,
            color: PlatformColor("secondaryLabel"),
            fontVariant: ["tabular-nums"],
          }}
        >
          {value}
        </Text>
      </View>
      <View
        style={{
          height: 6,
          borderRadius: 999,
          borderCurve: "continuous",
          backgroundColor: PlatformColor("tertiarySystemFill"),
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: `${percentage}%`,
            backgroundColor: PlatformColor("label"),
            height: "100%",
          }}
        />
      </View>
      {status ? (
        <Text selectable style={{ fontSize: 13, color: PlatformColor("secondaryLabel") }}>
          {status}
        </Text>
      ) : null}
    </View>
  );
}
