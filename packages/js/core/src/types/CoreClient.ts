import { QueryHandler, Invoker, Uri, InterfaceImplementations, Env } from ".";
import { IUriResolutionContext, IUriResolver } from "../uri-resolution";
import { UriResolverHandler } from "./UriResolver";

import { Result } from "@polywrap/result";

export interface CoreClientConfig<TUri extends Uri | string = Uri | string> {
  readonly interfaces?: Readonly<InterfaceImplementations<TUri>[]>;
  readonly envs?: Readonly<Env<TUri>[]>;
  readonly resolver: Readonly<IUriResolver<unknown>>;
}

export interface GetManifestOptions {
  noValidate?: boolean;
}

export interface GetFileOptions {
  path: string;
  encoding?: "utf-8" | string;
}

export interface GetImplementationsOptions {
  applyResolution?: boolean;
  resolutionContext?: IUriResolutionContext;
}

export interface CoreClient
  extends Invoker,
    QueryHandler,
    UriResolverHandler<unknown> {
  getConfig(): CoreClientConfig<Uri>;

  getInterfaces(): readonly InterfaceImplementations<Uri>[] | undefined;

  getEnvs(): readonly Env<Uri>[] | undefined;

  getEnvByUri<TUri extends Uri | string>(uri: TUri): Env<Uri> | undefined;

  getResolver(): IUriResolver<unknown>;

  getManifest<TUri extends Uri | string>(
    uri: TUri
  ): Promise<Result<unknown, Error>>;

  getFile<TUri extends Uri | string>(
    uri: TUri,
    options: GetFileOptions
  ): Promise<Result<string | Uint8Array, Error>>;

  getImplementations<TUri extends Uri | string>(
    uri: TUri,
    options: GetImplementationsOptions
  ): Promise<Result<TUri[], Error>>;
}
