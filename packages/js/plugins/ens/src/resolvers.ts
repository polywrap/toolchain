import { EnsPlugin } from "./";
import { Query } from "./w3";

import {
  Client,
  EResolveUriErrorType,
  ResolveUriError,
} from "@web3api/core-js";

export const query = (ens: EnsPlugin, client: Client): Query.Module => ({
  // uri-resolver.core.web3api.eth
  tryResolveUri: async (input: Query.Input_tryResolveUri) => {
    if (input.authority !== "ens") {
      return null;
    }

    let error: ResolveUriError | undefined;

    try {
      const cid = await ens.ensToCID(input.path, client);

      if (!cid) {
        return null;
      }

      return {
        uri: `ipfs/${cid}`,
        manifest: null,
      };
    } catch (e) {
      error = {
        type: EResolveUriErrorType.Ens,
        error: e,
      };

      // TODO: logging https://github.com/web3-api/monorepo/issues/33
    }

    // Nothing found
    return { uri: null, manifest: null, error };
  },
  getFile: (_input: Query.Input_getFile) => {
    return null;
  },
});
