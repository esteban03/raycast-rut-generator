/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `generate-rut` command */
  export type GenerateRut = ExtensionPreferences & {
  /** Default Format - Format used when generating RUTs. */
  "defaultFormat": "dots" | "dash" | "plain"
}
}

declare namespace Arguments {
  /** Arguments passed to the `generate-rut` command */
  export type GenerateRut = {}
}

