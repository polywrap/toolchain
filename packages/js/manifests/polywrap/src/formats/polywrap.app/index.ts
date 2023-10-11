/* eslint-disable */
/**
 * This file was automatically generated by scripts/manifest/index-ts.mustache.
 * DO NOT MODIFY IT BY HAND. Instead, modify scripts/manifest/index-ts.mustache,
 * and run node ./scripts/manifest/generateFormatTypes.js to regenerate this file.
 */

import {
  AppManifest as AppManifest_0_1_0,
} from "./0.1.0";
import {
  AppManifest as AppManifest_0_2_0,
} from "./0.2.0";
import {
  AppManifest as AppManifest_0_3_0,
} from "./0.3.0";
import {
  AppManifest as AppManifest_0_4_0,
} from "./0.4.0";
import {
  AppManifest as AppManifest_0_5_0,
} from "./0.5.0";
import {
  AppManifest as AppManifest_0_6_0,
} from "./0.6.0";

export {
  AppManifest_0_1_0,
  AppManifest_0_2_0,
  AppManifest_0_3_0,
  AppManifest_0_4_0,
  AppManifest_0_5_0,
  AppManifest_0_6_0,
};

export enum AppManifestFormats {
  // NOTE: Patch fix for backwards compatability
  "v0.1" = "0.1",
  "v0.1.0" = "0.1.0",
  "v0.2.0" = "0.2.0",
  "v0.3.0" = "0.3.0",
  "v0.4.0" = "0.4.0",
  "v0.5.0" = "0.5.0",
  "v0.6.0" = "0.6.0",
}

export const AppManifestSchemaFiles: Record<string, string> = {
  // NOTE: Patch fix for backwards compatability
  "0.1": "formats/polywrap.app/0.1.0.json",
  "0.1.0": "formats/polywrap.app/0.1.0.json",
  "0.2.0": "formats/polywrap.app/0.2.0.json",
  "0.3.0": "formats/polywrap.app/0.3.0.json",
  "0.4.0": "formats/polywrap.app/0.4.0.json",
  "0.5.0": "formats/polywrap.app/0.5.0.json",
  "0.6.0": "formats/polywrap.app/0.6.0.json",
}

export type AnyAppManifest =
  | AppManifest_0_1_0
  | AppManifest_0_2_0
  | AppManifest_0_3_0
  | AppManifest_0_4_0
  | AppManifest_0_5_0
  | AppManifest_0_6_0


export type AppManifest = AppManifest_0_6_0;

export const latestAppManifestFormat = AppManifestFormats["v0.6.0"]

export { migrateAppManifest } from "./migrate";

export { deserializeAppManifest } from "./deserialize";

export { validateAppManifest } from "./validate";
