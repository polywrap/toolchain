/* eslint-disable */
/**
 * This file was automatically generated by scripts/manifest/deserialize-ts.mustache.
 * DO NOT MODIFY IT BY HAND. Instead, modify scripts/manifest/deserialize-ts.mustache,
 * and run node ./scripts/manifest/generateFormatTypes.js to regenerate this file.
 */

import {
  PluginManifest,
  AnyPluginManifest,
  migratePluginManifest,
  validatePluginManifest,
  latestPluginManifestFormat,
} from ".";
import { DeserializeManifestOptions } from "../../";

import * as Semver from "semver";
import YAML from "js-yaml";

export function deserializePluginManifest(
  manifest: string,
  options?: DeserializeManifestOptions
): PluginManifest {
  let anyPluginManifest: AnyPluginManifest | undefined;
  try {
    anyPluginManifest = JSON.parse(manifest) as AnyPluginManifest;
  } catch (e) {
    anyPluginManifest = YAML.safeLoad(manifest) as
    | AnyPluginManifest
    | undefined;
  }

  if (!anyPluginManifest) {
    throw Error(`Unable to parse PluginManifest: ${manifest}`);
  }

  if (!options || !options.noValidate) {
    validatePluginManifest(anyPluginManifest, options?.extSchema);
  }

  anyPluginManifest.__type = "PluginManifest";

  const versionCompare = Semver.compare(
    Semver.coerce(anyPluginManifest.format) || anyPluginManifest.format,
    Semver.coerce(latestPluginManifestFormat) || latestPluginManifestFormat
  );

  if (versionCompare === -1) {
    // Upgrade
    return migratePluginManifest(anyPluginManifest, latestPluginManifestFormat);
  } else if (versionCompare === 1) {
    // Downgrade
    throw Error(
      `Cannot downgrade Polywrap version ${anyPluginManifest.format}, please upgrade your PolywrapClient package.`
    );
  } else {
    // Latest
    return anyPluginManifest as PluginManifest;
  }
}
