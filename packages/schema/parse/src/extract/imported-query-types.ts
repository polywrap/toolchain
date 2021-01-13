import {
  PropertyDefinition,
  TypeInfo,
  ImportedQueryDefinition,
  MethodDefinition,
  createImportedQueryDefinition,
  createMethodDefinition,
  createPropertyDefinition,
  createScalarDefinition,
  createArrayDefinition,
} from "../typeInfo";

import {
  DocumentNode,
  ObjectTypeDefinitionNode,
  NonNullTypeNode,
  NamedTypeNode,
  ListTypeNode,
  FieldDefinitionNode,
  InputValueDefinitionNode,
  visit,
  DirectiveNode,
  ValueNode,
} from "graphql";

interface State {
  currentImport?: ImportedQueryDefinition;
  currentMethod?: MethodDefinition;
  currentArgument?: PropertyDefinition;
  currentReturn?: PropertyDefinition;
  nonNullType?: boolean;
}

const visitorEnter = (typeInfo: TypeInfo, state: State) => ({
  ObjectTypeDefinition: (node: ObjectTypeDefinitionNode) => {
    if (!node.directives) {
      return;
    }

    // Look for imported
    const importedDirective = "imported";
    const importedIndex = node.directives.findIndex(
      (dir: DirectiveNode) => dir.name.value === importedDirective
    );

    if (importedIndex === -1) {
      return;
    }

    const typeName = node.name.value;

    const queryIdentifier = "_Query";
    const queryTest = typeName.substr(-queryIdentifier.length);
    const mutationIdentifier = "_Mutation";
    const mutationTest = typeName.substr(-queryIdentifier.length);

    if (queryTest !== queryIdentifier && mutationTest !== mutationIdentifier) {
      // Ignore imported types that aren't query types
      return;
    }

    const importedDir = node.directives[importedIndex];

    if (!importedDir.arguments || importedDir.arguments.length !== 3) {
      // TODO: Implement better error handling
      // https://github.com/Web3-API/prototype/issues/15
      throw Error(
        `The ${importedDirective} directive has incorrect arguments. See type "${typeName}"`
      );
    }

    let namespace: string | undefined;
    let uri: string | undefined;
    let type: string | undefined;

    const extractString = (value: ValueNode, name: string) => {
      if (value.kind === "StringValue") {
        return value.value;
      } else {
        throw Error(`Error: argument '${name}' must be a string`);
      }
    };

    for (const importArg of importedDir.arguments) {
      if (importArg.name.value === "namespace") {
        namespace = extractString(importArg.value, "namespace");
      } else if (importArg.name.value === "uri") {
        uri = extractString(importArg.value, "uri");
      } else if (importArg.name.value === "type") {
        type = extractString(importArg.value, "type");
      }
    }

    if (!type || !namespace || !uri) {
      throw Error(
        "Error: import directive missing one of its required arguments (namespace, uri, type)"
      );
    }

    const importedType = createImportedQueryDefinition(
      uri,
      namespace,
      typeName,
      type
    );
    typeInfo.importedQueryTypes.push(importedType);
    state.currentImport = importedType;
  },
  FieldDefinition: (node: FieldDefinitionNode) => {
    const importDef = state.currentImport;

    if (!importDef) {
      return;
    }

    if (!node.arguments || node.arguments.length === 0) {
      throw Error(
        `Imported Query types must only have methods. See property: ${node.name.value}`
      );
    }

    const operation = importDef.type === "Query" ? "query" : "mutation";
    const method = createMethodDefinition(operation, node.name.value);
    importDef.methods.push(method);
    state.currentMethod = method;
  },
  InputValueDefinition: (node: InputValueDefinitionNode) => {
    const method = state.currentMethod;

    if (!method) {
      return;
    }

    const argument = createPropertyDefinition(node.name.value);
    method.arguments.push(argument);
    state.currentArgument = argument;
  },
  NonNullType: (_node: NonNullTypeNode) => {
    state.nonNullType = true;
  },
  NamedType: (node: NamedTypeNode) => {
    const argument = state.currentArgument;
    const method = state.currentMethod;
    const modifier = state.nonNullType ? "" : "?";

    if (method && argument) {
      // Argument value
      argument.scalar = createScalarDefinition(
        argument.name,
        modifier + node.name.value,
        state.nonNullType
      );

      state.nonNullType = false;
    } else if (method) {
      // Return value
      if (!method.return) {
        method.return = createPropertyDefinition(method.name);

        state.currentReturn = method.return;
      } else if (!state.currentReturn) {
        state.currentReturn = method.return;
      }
      state.currentReturn.scalar = createScalarDefinition(
        method.name,
        modifier + node.name.value,
        state.nonNullType
      );
      state.nonNullType = false;
    }
  },
  ListType: (_node: ListTypeNode) => {
    const argument = state.currentArgument;
    const method = state.currentMethod;

    if (method && argument) {
      // Argument value
      argument.array = createArrayDefinition(
        argument.name,
        "TBD",
        state.nonNullType
      );
      state.currentArgument = argument.array;
      state.nonNullType = false;
    } else if (method) {
      // Return value
      if (!method.return) {
        method.return = createPropertyDefinition(method.name);
        state.currentReturn = method.return;
      } else if (!state.currentReturn) {
        state.currentReturn = method.return;
      }

      state.currentReturn.array = createArrayDefinition(
        method.name,
        "TBD",
        state.nonNullType
      );
      state.currentReturn = state.currentReturn.array;
      state.nonNullType = false;
    }
  },
});

const visitorLeave = (typeInfo: TypeInfo, state: State) => ({
  ObjectTypeDefinition: (_node: ObjectTypeDefinitionNode) => {
    state.currentImport = undefined;
  },
  FieldDefinition: (_node: FieldDefinitionNode) => {
    state.currentMethod = undefined;
    state.currentReturn = undefined;
  },
  InputValueDefinition: (_node: InputValueDefinitionNode) => {
    state.currentArgument = undefined;
  },
  NonNullType: (_node: NonNullTypeNode) => {
    state.nonNullType = false;
  },
});

export function extractImportedQueryTypes(
  astNode: DocumentNode,
  typeInfo: TypeInfo
): void {
  const state: State = {};

  visit(astNode, {
    enter: visitorEnter(typeInfo, state),
    leave: visitorLeave(typeInfo, state),
  });
}
