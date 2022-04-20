// @ts-noCheck
import {
  UInt,
  UInt8,
  UInt16,
  UInt32,
  Int,
  Int8,
  Int16,
  Int32,
  Bytes,
  BigInt,
  BigNumber,
  Json,
  String,
  Boolean
} from "./types";
import * as Types from "./types";

import {
  Client,
  PluginModule,
  MaybeAsync
} from "@web3api/core-js";

export interface Input_method extends Record<string, unknown> {
  arg: UInt32;
}

export interface Module extends PluginModule {
  method(
    input: Input_method,
    client: Client
  ): MaybeAsync<String>;
}
