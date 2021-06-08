import { Uri, UriRedirect } from "../types";

import { Tracer } from "@web3api/tracing-js";

export const applyRedirects = Tracer.traceFunc(
  "core: applyRedirects",
  (
    uri: Uri,
    redirects: readonly UriRedirect<Uri>[],
  ): Uri => {
    
    // Keep track of past redirects (from -> to) to find the final uri 
    let redirectFromToMap: Record<string, Uri> = {};

    const throwError = (message: string) => {
      throw Error(
        `${message}\nResolution Stack: ${JSON.stringify(
            redirectFromToMap,
            null,
            2
          )}`
      );
    }

    const checkForDuplicateRedirects = (redirectFrom: Uri, redirectFromToMap: Record<string, Uri>) => {
      if(redirectFromToMap[redirectFrom.uri]) {
        throwError(`Cannot redirect from the same URI more than once, URI: "${uri}".`);
      }
    };

    for(const redirect of redirects) {
      if (!redirect.from) {
        throwError(`Redirect missing the from property.\nEncountered while resolving ${uri.uri}`);
      }

      if(Uri.isUri(redirect.to)) {
        checkForDuplicateRedirects(redirect.from, redirectFromToMap);

        redirectFromToMap[redirect.from.uri] = redirect.to;
      }
    }

    let finalUri = uri;

    const visitedUris: Record<string, boolean> = {};

    while(redirectFromToMap[finalUri.uri]) {
     
      visitedUris[finalUri.uri] = true;

      finalUri = redirectFromToMap[finalUri.uri];

      if(visitedUris[finalUri.uri]) {
        throwError(`Infinite loop while resolving URI "${uri}".`);
      }
    }

    return finalUri;
  }
);
      