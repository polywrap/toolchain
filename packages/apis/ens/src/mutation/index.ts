import { getResolver } from "../query";
import { namehash, keccak256 } from "../utils";
import { abi, bytecode } from "../contracts/FIFSRegistrar";
import {
  Ethereum_Mutation,
  Input_registerDomain,
  Input_reverseRegisterDomain,
  Input_setAddress,
  Input_setAddressFromDomain,
  Input_setContentHash,
  Input_setContentHashFromDomain,
  Input_setName,
  Input_setOwner,
  Input_setResolver,
  Input_setSubdomainOwner,
  Input_setSubdomainRecord,
  Input_setRecord,
  Input_deployFIFSRegistrar,
  Input_registerSubnodeOwnerWithFIFSRegistrar,
  Ethereum_TxResponse,
  TxOverrides,
} from "./w3";

export function setResolver(input: Input_setResolver): Ethereum_TxResponse {
  const txOverrides: TxOverrides =
    input.txOverrides === null
      ? { gasLimit: null, gasPrice: null }
      : input.txOverrides!;
  const setResolverTx = Ethereum_Mutation.callContractMethod({
    address: input.registryAddress,
    method: "function setResolver(bytes32 node, address owner)",
    args: [namehash(input.domain), input.resolverAddress],
    connection: input.connection,
    txOverrides: {
      value: null,
      gasPrice: txOverrides.gasPrice,
      gasLimit: txOverrides.gasLimit,
    },
  });

  return setResolverTx;
}

export function registerDomain(
  input: Input_registerDomain
): Ethereum_TxResponse {
  const label = input.domain.split(".")[0];
  const txOverrides: TxOverrides =
    input.txOverrides === null
      ? { gasLimit: null, gasPrice: null }
      : input.txOverrides!;
  const tx = Ethereum_Mutation.callContractMethod({
    address: input.registrarAddress,
    method: "function register(bytes32 label, address owner)",
    args: [keccak256(label), input.owner],
    connection: input.connection,
    txOverrides: {
      value: null,
      gasPrice: txOverrides.gasPrice,
      gasLimit: txOverrides.gasLimit,
    },
  });

  return tx;
}

export function setOwner(input: Input_setOwner): Ethereum_TxResponse {
  const txOverrides: TxOverrides =
    input.txOverrides === null
      ? { gasLimit: null, gasPrice: null }
      : input.txOverrides!;
  const tx = Ethereum_Mutation.callContractMethod({
    address: input.registryAddress,
    method: "function setOwner(bytes32 node, address owner) external",
    args: [namehash(input.domain), input.newOwner],
    connection: input.connection,
    txOverrides: {
      gasLimit: txOverrides.gasLimit,
      gasPrice: txOverrides.gasPrice,
      value: null,
    },
  });

  return tx;
}

export function setSubdomainOwner(
  input: Input_setSubdomainOwner
): Ethereum_TxResponse {
  const splitDomain = input.subdomain.split(".");
  const subdomainLabel = splitDomain[0];
  const domain = splitDomain.slice(1, splitDomain.length).join(".");

  const txOverrides: TxOverrides =
    input.txOverrides === null
      ? { gasLimit: null, gasPrice: null }
      : input.txOverrides!;
  const tx = Ethereum_Mutation.callContractMethod({
    address: input.registryAddress,
    method:
      "function setSubnodeOwner(bytes32 node, bytes32 label, address owner) external",
    args: [namehash(domain), keccak256(subdomainLabel), input.owner],
    connection: input.connection,
    txOverrides: {
      gasLimit: txOverrides.gasLimit,
      gasPrice: txOverrides.gasPrice,
      value: null,
    },
  });

  return tx;
}

export function setSubdomainRecord(
  input: Input_setSubdomainRecord
): Ethereum_TxResponse {
  const txOverrides: TxOverrides =
    input.txOverrides === null
      ? { gasLimit: null, gasPrice: null }
      : input.txOverrides!;
  const tx = Ethereum_Mutation.callContractMethod({
    address: input.registryAddress,
    method:
      "function setSubnodeRecord(bytes32 node, bytes32 label, address owner, address resolver, uint64 ttl)",
    args: [
      namehash(input.domain),
      keccak256(input.label),
      input.owner,
      input.resolverAddress,
      input.ttl,
    ],
    connection: input.connection,
    txOverrides: {
      gasLimit: txOverrides.gasLimit,
      gasPrice: txOverrides.gasPrice,
      value: null,
    },
  });

  return tx;
}

//TODO: Where could this be used on mainnet?
export function setRecord(input: Input_setRecord): Ethereum_TxResponse {
  const txOverrides: TxOverrides =
    input.txOverrides === null
      ? { gasLimit: null, gasPrice: null }
      : input.txOverrides!;
  const tx = Ethereum_Mutation.callContractMethod({
    address: input.registryAddress,
    method:
      "function setRecord(bytes32 node, address owner, address resolver, uint64 ttl)",
    args: [
      namehash(input.domain),
      input.owner,
      input.resolverAddress,
      input.ttl,
    ],
    connection: input.connection,
    txOverrides: {
      gasLimit: txOverrides.gasLimit,
      gasPrice: txOverrides.gasPrice,
      value: null,
    },
  });

  return tx;
}

export function setName(input: Input_setName): Ethereum_TxResponse {
  const txOverrides: TxOverrides =
    input.txOverrides === null
      ? { gasLimit: null, gasPrice: null }
      : input.txOverrides!;
  const setNameTx = Ethereum_Mutation.callContractMethod({
    address: input.reverseRegistryAddress,
    method: "function setName(string name)",
    args: [input.domain],
    connection: input.connection,
    txOverrides: {
      gasLimit: txOverrides.gasLimit,
      gasPrice: txOverrides.gasPrice,
      value: null,
    },
  });

  return setNameTx;
}

export function reverseRegisterDomain(
  input: Input_reverseRegisterDomain
): Ethereum_TxResponse {
  const txOverrides: TxOverrides =
    input.txOverrides === null
      ? { gasLimit: null, gasPrice: null }
      : input.txOverrides!;
  Ethereum_Mutation.callContractMethod({
    address: input.reverseRegistryAddress,
    method: "function claim(address owner)",
    args: [input.owner],
    connection: input.connection,
    txOverrides: {
      gasLimit: txOverrides.gasLimit,
      gasPrice: txOverrides.gasPrice,
      value: null,
    },
  });

  const setNameTx = setName({
    reverseRegistryAddress: input.reverseRegistryAddress,
    domain: input.domain,
    connection: input.connection,
    txOverrides: {
      gasLimit: txOverrides.gasLimit,
      gasPrice: txOverrides.gasPrice,
    },
  });

  return setNameTx;
}

export function setAddress(input: Input_setAddress): Ethereum_TxResponse {
  const txOverrides: TxOverrides =
    input.txOverrides === null
      ? { gasLimit: null, gasPrice: null }
      : input.txOverrides!;
  const setAddrTx = Ethereum_Mutation.callContractMethod({
    address: input.resolverAddress,
    method: "function setAddr(bytes32 node, address addr)",
    args: [namehash(input.domain), input.address],
    connection: input.connection,
    txOverrides: {
      gasLimit: txOverrides.gasLimit,
      gasPrice: txOverrides.gasPrice,
      value: null,
    },
  });

  return setAddrTx;
}

export function setContentHash(
  input: Input_setContentHash
): Ethereum_TxResponse {
  const txOverrides: TxOverrides =
    input.txOverrides === null
      ? { gasLimit: null, gasPrice: null }
      : input.txOverrides!;
  const setContentHash = Ethereum_Mutation.callContractMethod({
    address: input.resolverAddress,
    method: "function setContenthash(bytes32 node, bytes hash)",
    args: [namehash(input.domain), input.cid],
    connection: input.connection,
    txOverrides: {
      gasLimit: txOverrides.gasLimit,
      gasPrice: txOverrides.gasPrice,
      value: null,
    },
  });

  return setContentHash;
}

export function setAddressFromDomain(
  input: Input_setAddressFromDomain
): Ethereum_TxResponse {
  const resolverAddress = getResolver({
    domain: input.domain,
    registryAddress: input.registryAddress,
    connection: input.connection,
  });

  const txOverrides: TxOverrides =
    input.txOverrides === null
      ? { gasLimit: null, gasPrice: null }
      : input.txOverrides!;
  const setAddrTx = Ethereum_Mutation.callContractMethod({
    address: resolverAddress,
    method: "function setAddr(bytes32 node, address addr)",
    args: [namehash(input.domain), input.address],
    connection: input.connection,
    txOverrides: {
      gasLimit: txOverrides.gasLimit,
      gasPrice: txOverrides.gasPrice,
      value: null,
    },
  });

  return setAddrTx;
}

export function setContentHashFromDomain(
  input: Input_setContentHashFromDomain
): Ethereum_TxResponse {
  const resolverAddress = getResolver({
    domain: input.domain,
    registryAddress: input.registryAddress,
    connection: input.connection,
  });

  const txOverrides: TxOverrides =
    input.txOverrides === null
      ? { gasLimit: null, gasPrice: null }
      : input.txOverrides!;
  const setContentHash = Ethereum_Mutation.callContractMethod({
    address: resolverAddress,
    method: "function setContenthash(bytes32 node, bytes hash)",
    args: [namehash(input.domain), input.cid],
    connection: input.connection,
    txOverrides: {
      gasLimit: txOverrides.gasLimit,
      gasPrice: txOverrides.gasPrice,
      value: null,
    },
  });

  return setContentHash;
}

export function deployFIFSRegistrar(input: Input_deployFIFSRegistrar): string {
  const address = Ethereum_Mutation.deployContract({
    abi,
    bytecode,
    args: [input.registryAddress, namehash(input.tld)],
    connection: input.connection,
  });

  return address;
}

//TODO: needs testing here with a recipe. Was tested in the Web3Hub
export function registerSubnodeOwnerWithFIFSRegistrar(
  input: Input_registerSubnodeOwnerWithFIFSRegistrar
): Ethereum_TxResponse {
  const txOverrides: TxOverrides =
    input.txOverrides === null
      ? { gasLimit: null, gasPrice: null }
      : input.txOverrides!;
  const txHash = Ethereum_Mutation.callContractMethod({
    address: input.fifsRegistrarAddress,
    method: "function register(bytes32 label, address owner) external",
    args: [keccak256(input.label), input.owner],
    connection: input.connection,
    txOverrides: {
      gasLimit: txOverrides.gasLimit,
      gasPrice: txOverrides.gasPrice,
      value: null,
    },
  });

  return txHash;
}
