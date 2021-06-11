import { PluginManifest } from "@web3api/core-js";

export const manifest: PluginManifest = {
  // TODO: use the schema.graphql
  // https://github.com/web3-api/monorepo/issues/101
  schema: `
type Log {
  blockNumber: UInt32!
  blockHash: String!
  transactionIndex: UInt32!
  removed: Boolean!
  address: String!
  data: String!
  topics: [String!]!
  transactionHash: String!
  logIndex: UInt32!
}

type TxReceipt {
  to: String
  from: String!
  contractAddress: String
  transactionIndex: UInt32!
  root: String
  gasUsed: String!
  logsBloom: String!
  blockHash: String!
  transactionHash: String!
  logs: [Log!]!
  blockNumber: String!
  confirmations: UInt32!
  cumulativeGasUsed: String!
  byzantium: Boolean!
  status: UInt32!
}

type TxResponse {
  hash: String!
  blockNumber: UInt32
  blockHash: String
  timestamp: UInt32
  confirmations: UInt32!
  from: String!
  raw: String
  nonce: String!
  gasLimit: String!
  gasPrice: String!
  data: String!
}

type TxRequest {
  to: String
  from: String
  nonce: String
  gasLimit: String
  gasPrice: String
  data: String
  value: String
  chainId: UInt32
}

type TxOverrides {
  gasLimit: String
  gasPrice: String
  value: String
}

type EventNotification {
  data: String!
  address: String!
  log: Log!
}

type Query {
  callView(
    address: String!
    method: String!
    args: [String!]
    connection: Connection
  ): String!

  callContractMethodStatic(
    address: String!
    method: String!
    args: [String!]
    connection: Connection
    txOverrides: TxOverrides
  ): String!

  signMessage(
    message: String!
    connection: Connection
  ): String!

  encodeParams(
    types: [String!]!
    values: [String!]!
  ): String!

  getSignerAddress(connection: Connection): String!

  getSignerBalance(
    blockTag: UInt32
    connection: Connection
  ): String!

  getSignerTransactionCount(
    blockTag: UInt32
    connection: Connection
  ): String!

  getGasPrice(connection: Connection): String!

  estimateTxGas(
    tx: TxRequest!
    connection: Connection
  ): String!

  estimateContractCallGas(
    address: String!
    method: String!
    args: [String!]
    connection: Connection
    txOverrides: TxOverrides
  ): String!

  checkAddress (address: String!): String!

  toWei (amount: String!): String!

  fromWei (amount: String!): String!

  awaitTransaction(
    txHash: String!
    confirmations: UInt32!
    timeout: UInt32!
    connectionOverride: Connection
  ): TxReceipt!

  waitForEvent (
    address: String!
    event: String!
    args: [String]!
    timeout: UInt32
    connection: Connection
  ): EventNotification!
}

type Mutation {
  callContractMethod(
    address: String!
    method: String!
    args: [String!]
    connection: Connection
    txOverrides: TxOverrides
  ): TxResponse!

  callContractMethodAndWait(
    address: String!
    method: String!
    args: [String!]
    connection: Connection
    txOverrides: TxOverrides
  ): TxReceipt!

  deployContract(
    abi: String!
    bytecode: String!
    args: [String!]
    connection: Connection
  ): String!

  sendTransaction(
    tx: TxRequest!
    connection: Connection
  ): TxResponse!

  sendTransactionAndWait(
    tx: TxRequest!
    connection: Connection
  ): TxReceipt!

  sendRPC(
    method: String!
    params: [String!]!
    connection: Connection
  ): String
}

type Connection {
  node: String
  networkNameOrChainId: String
}`,
  implemented: [],
  imported: [],
};
