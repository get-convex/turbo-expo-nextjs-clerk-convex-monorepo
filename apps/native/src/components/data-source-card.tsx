import { PlatformColor, Switch, Text, View } from "react-native";
import SegmentedControl from "./segmented-control";

type DataSourceCardProps = {
  title: string;
  description: string;
  why: string;
  enabled: boolean;
  retentionDays: number;
  retentionOptions: number[];
  onToggle: (next: boolean) => void;
  onRetentionChange?: (days: number) => void;
  requires?: string;
  disabled?: boolean;
  retentionDisabled?: boolean;
};

export default function DataSourceCard({
  title,
  description,
  why,
  enabled,
  retentionDays,
  retentionOptions,
  onToggle,
  onRetentionChange,
  requires,
  disabled = false,
  retentionDisabled = false,
}: DataSourceCardProps) {
  const options = retentionOptions.length > 0 ? retentionOptions : [retentionDays];
  const selectedIndex = Math.max(options.indexOf(retentionDays), 0);

  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 12, gap: 10 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <View style={{ flex: 1, gap: 4 }}>
          <Text
            selectable
            style={{ fontSize: 17, fontWeight: "600", color: PlatformColor("label") }}
          >
            {title}
          </Text>
          <Text
            selectable
            style={{ fontSize: 15, color: PlatformColor("secondaryLabel"), lineHeight: 20 }}
          >
            {description}
          </Text>
        </View>
        <Switch
          accessibilityLabel={title}
          value={enabled}
          onValueChange={onToggle}
          disabled={disabled}
        />
      </View>

      <View style={{ gap: 6 }}>
        <Text
          selectable
          style={{ fontSize: 13, color: PlatformColor("secondaryLabel") }}
        >
          Why this data helps: {why}
        </Text>
        {requires ? (
          <Text
            selectable
            style={{ fontSize: 13, color: PlatformColor("tertiaryLabel") }}
          >
            {requires}
          </Text>
        ) : null}
        <Text
          selectable
          style={{ fontSize: 13, color: PlatformColor("secondaryLabel") }}
        >
          Retention: {retentionDays} days
        </Text>
        {options.length > 1 && onRetentionChange ? (
          <SegmentedControl
            values={options.map((option) => `${option}d`)}
            selectedIndex={selectedIndex}
            onChange={(index) => {
              if (retentionDisabled) return;
              onRetentionChange(options[index]);
            }}
          />
        ) : null}
      </View>
    </View>
  );
}
