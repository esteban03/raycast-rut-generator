import { Action, ActionPanel, Clipboard, Icon, List, Toast, getPreferenceValues, showToast } from "@raycast/api";
import { useState } from "react";
import { RutFormat, generateRuts } from "./rut";

type Preferences = {
  defaultFormat: RutFormat;
};

type RutItem = {
  value: string;
  index: number;
};

const FORMAT_LABELS: Record<RutFormat, string> = {
  dots: "With dots and dash",
  dash: "Without dots, with dash",
  plain: "Without dots or dash",
};

export default function Command() {
  const preferences = getPreferenceValues<Preferences>();
  const format = preferences.defaultFormat;
  const [items, setItems] = useState<RutItem[]>(() => createRutItems(format));

  return (
    <List
      searchBarPlaceholder="Search generated RUTs..."
      actions={
        <ActionPanel>
          <CopyAllRutsAction ruts={items.map((item) => item.value)} />
          <Action
            title="Generate New List"
            icon={Icon.ArrowClockwise}
            shortcut={{ modifiers: ["cmd"], key: "r" }}
            onAction={() => setItems(createRutItems(format))}
          />
        </ActionPanel>
      }
    >
      <List.Section title="Generated RUTs" subtitle={`${items.length} RUTs - ${FORMAT_LABELS[format]}`}>
        {items.map((item) => (
          <List.Item
            key={`${item.index}-${item.value}`}
            title={item.value}
            subtitle={`RUT ${item.index}`}
            icon={Icon.Person}
            actions={
              <ActionPanel>
                <CopyRutAction rut={item.value} />
                <CopyAllRutsAction ruts={items.map((item) => item.value)} />
                <Action
                  title="Generate New List"
                  icon={Icon.ArrowClockwise}
                  shortcut={{ modifiers: ["cmd"], key: "r" }}
                  onAction={() => setItems(createRutItems(format))}
                />
              </ActionPanel>
            }
          />
        ))}
      </List.Section>
    </List>
  );
}

function createRutItems(format: RutFormat): RutItem[] {
  return generateRuts(format).map((value, index) => ({
    value,
    index: index + 1,
  }));
}

function CopyRutAction({ rut }: { rut: string }) {
  return (
    <Action
      title="Copy RUT"
      icon={Icon.Clipboard}
      shortcut={{ modifiers: ["cmd"], key: "c" }}
      onAction={async () => {
        await Clipboard.copy(rut);
        await showToast({
          style: Toast.Style.Success,
          title: "RUT copied",
          message: rut,
        });
      }}
    />
  );
}

function CopyAllRutsAction({ ruts }: { ruts: string[] }) {
  return (
    <Action
      title="Copy All RUTs"
      icon={Icon.Clipboard}
      shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
      onAction={async () => {
        await Clipboard.copy(ruts.join("\n"));
        await showToast({
          style: Toast.Style.Success,
          title: "RUTs copied",
          message: `${ruts.length} RUTs`,
        });
      }}
    />
  );
}
