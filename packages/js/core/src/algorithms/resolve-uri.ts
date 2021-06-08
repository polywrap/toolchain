import { Api, Client, Uri, PluginPackage } from "../types";
import { Manifest, deserializeManifest } from "../manifest";
import * as ApiResolver from "../apis/api-resolver";
import { applyRedirects } from "./apply-redirects";
import { findPluginPackage } from "./find-plugin-package";

import { Tracer } from "@web3api/tracing-js";

export const resolveUri = Tracer.traceFunc(
  "core: resolveUri",
  async (
    uri: Uri,
    client: Client,
    createPluginApi: (uri: Uri, plugin: PluginPackage) => Api,
    createApi: (uri: Uri, manifest: Manifest, apiResolver: Uri) => Api,
    noValidate?: boolean
  ): Promise<Api> => {
    const redirects = client.redirects();
  
    let finalRedirectedUri = applyRedirects(uri, redirects);

    const plugin = findPluginPackage(finalRedirectedUri, redirects);

    if(plugin) {
      return Tracer.traceFunc(
          "resolveUri: createPluginApi",
          (uri: Uri, plugin: PluginPackage) => createPluginApi(uri, plugin)
        )(finalRedirectedUri, plugin);
    }

    // The final URI has been resolved, let's now resolve the Web3API package
    const uriResolverImplementations = client.getImplementations("w3/api-resolver");

    return await resolveUriWithApiResolvers(finalRedirectedUri, uriResolverImplementations, client, createApi, noValidate);
  }
);

const resolveUriWithApiResolvers = async (
    uri: Uri, 
    apiResolverImplementationUris: string[],  
    client: Client, 
    createApi: (uri: Uri, manifest: Manifest, apiResolver: Uri) => Api,
    noValidate?: boolean
  ): Promise<Api> => {
    let resolvedUri = uri;
    
    // Keep track of past URIs to avoid infinite loops
    let uriHistory: { uri: string; source: string }[] = [
      {
        uri: resolvedUri.uri,
        source: "ROOT",
      },
    ];

    const trackUriRedirect = (uri: string, source: string) => {
      const dupIdx = uriHistory.findIndex((item) => item.uri === uri);
      uriHistory.push({
        uri,
        source,
      });
      if (dupIdx > -1) {
        throw Error(
          `Infinite loop while resolving URI "${uri}".\nResolution Stack: ${JSON.stringify(
            uriHistory,
            null,
            2
          )}`
        );
      }
    };

    // Iterate through all api-resolver implementations,
    // iteratively resolving the URI until we reach the Web3API manifest
    for (let i = 0; i < apiResolverImplementationUris.length; ++i) {
      const uriResolver = new Uri(apiResolverImplementationUris[i]);

      const { data } = await ApiResolver.Query.tryResolveUri(
        client,
        uriResolver,
        resolvedUri
      );

      // If nothing was returned, the URI is not supported
      if (!data || (!data.uri && !data.manifest)) {
        Tracer.addEvent("continue", uriResolver.uri);
        continue;
      }

      const newUri = data.uri;
      const manifestStr = data.manifest;

      if (newUri) {
        // Use the new URI, and reset our index
        const convertedUri = new Uri(newUri);
        trackUriRedirect(convertedUri.uri, uriResolver.uri);

        Tracer.addEvent("api-resolver-redirect", {
          from: resolvedUri.uri,
          to: convertedUri.uri,
        });

        // Restart the iteration over again
        i = -1;
        resolvedUri = convertedUri;
        continue;
      } else if (manifestStr) {
        // We've found our manifest at the current URI resolver
        // meaning the URI resolver can also be used as an API resolver
        const manifest = deserializeManifest(manifestStr, { noValidate });

        return Tracer.traceFunc(
          "resolveUri: createApi",
          (uri: Uri, manifest: Manifest, apiResolver: Uri) =>
            createApi(uri, manifest, apiResolver)
        )(resolvedUri, manifest, uriResolver);
      }
    }

    // We've failed to resolve the URI
    throw Error(
      `No Web3API found at URI: ${resolvedUri.uri}` +
        `\nResolution Path: ${JSON.stringify(uriHistory, null, 2)}` +
        `\nResolvers Used: ${apiResolverImplementationUris}`
    );
}
