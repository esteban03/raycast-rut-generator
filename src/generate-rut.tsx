import {
  Action,
  ActionPanel,
  Clipboard,
  Detail,
  Icon,
  List,
  Toast,
  getPreferenceValues,
  showToast,
} from "@raycast/api";
import { useMemo, useState } from "react";
import { RutFormat, calculateVerificationDigit, formatRut, generateRutBody } from "./rut";

type Preferences = {
  defaultFormat: RutFormat;
};

type RutItem = {
  title: string;
  subtitle: string;
  value: string;
  format: RutFormat;
};

const FORMAT_LABELS: Record<RutFormat, string> = {
  dots: "With dots",
  dash: "With dash",
  plain: "Plain",
};

export default function Command() {
  const preferences = getPreferenceValues<Preferences>();
  const [rutBody, setRutBody] = useState(() => generateRutBody());

  const verificationDigit = useMemo(() => calculateVerificationDigit(rutBody), [rutBody]);
  const selectedRut = formatRut(rutBody, verificationDigit, preferences.defaultFormat);
  const items = useMemo<RutItem[]>(
    () =>
      (["dots", "dash", "plain"] as RutFormat[]).map((format) => ({
        title: formatRut(rutBody, verificationDigit, format),
        subtitle: FORMAT_LABELS[format],
        value: formatRut(rutBody, verificationDigit, format),
        format,
      })),
    [rutBody, verificationDigit],
  );

  return (
    <List
      actions={
        <ActionPanel>
          <CopyRutAction rut={selectedRut} />
          <Action
            title="Generate Another RUT"
            icon={Icon.ArrowClockwise}
            shortcut={{ modifiers: ["cmd"], key: "r" }}
            onAction={() => setRutBody(generateRutBody())}
          />
        </ActionPanel>
      }
    >
      <List.Section title="Generated RUT" subtitle={selectedRut}>
        {items.map((item) => (
          <List.Item
            key={item.format}
            title={item.title}
            subtitle={item.subtitle}
            icon={Icon.Person}
            actions={
              <ActionPanel>
                <CopyRutAction rut={item.value} />
                <Action
                  title="Generate Another RUT"
                  icon={Icon.ArrowClockwise}
                  shortcut={{ modifiers: ["cmd"], key: "r" }}
                  onAction={() => setRutBody(generateRutBody())}
                />
                <Action.Push
                  title="Show Details"
                  icon={Icon.Info}
                  target={<RutDetail rutBody={rutBody} verificationDigit={verificationDigit} />}
                />
              </ActionPanel>
            }
          />
        ))}
      </List.Section>
    </List>
  );
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

function RutDetail({ rutBody, verificationDigit }: { rutBody: number; verificationDigit: string }) {
  const markdown = [
    "# Generated RUT",
    "",
    `**Body:** ${rutBody}`,
    `**Verification digit:** ${verificationDigit}`,
    "",
    "| Format | Value |",
    "| --- | --- |",
    `| With dots | ${formatRut(rutBody, verificationDigit, "dots")} |`,
    `| With dash | ${formatRut(rutBody, verificationDigit, "dash")} |`,
    `| Plain | ${formatRut(rutBody, verificationDigit, "plain")} |`,
  ].join("\n");

  return <Detail markdown={markdown} />;
}
