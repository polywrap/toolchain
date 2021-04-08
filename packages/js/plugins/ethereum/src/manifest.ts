import { PluginManifest } from "@web3api/core-js";

export const manifest: PluginManifest = {
  // TODO: use the schema.graphql
  // https://github.com/web3-api/monorepo/issues/101
  schema: `
type Query {
  callView(
    address: String!
    method: String!
    args: [String!]!
  ): String!
}

type Mutation {
  sendTransaction(
    address: String!
    method: String!
    args: [String!]!
  ): String!

  deployContract(
    abi: String!
    bytecode: String!
  ): String!
}`,
  implemented: [],
  imported: [],
};
