export const wrapManifest = {
  name: "Logger",
  type: "plugin",
  version: "0.1",
  abi: {
    objectTypes: [],
    enumTypes: [],
    interfaceTypes: [],
    importedObjectTypes: [],
    importedModuleTypes: [
      {
        type: "Logger_Module",
        name: null,
        required: null,
        kind: 256,
        methods: [
          {
            type: "Method",
            name: "log",
            required: true,
            kind: 64,
            arguments: [
              {
                type: "Logger_LogLevel",
                name: "level",
                required: true,
                kind: 34,
                array: null,
                map: null,
                scalar: null,
                object: null,
                enum: {
                  type: "Logger_LogLevel",
                  name: "level",
                  required: true,
                  kind: 16384,
                },
                unresolvedObjectOrEnum: null,
              },
              {
                type: "String",
                name: "message",
                required: true,
                kind: 34,
                array: null,
                map: null,
                scalar: {
                  type: "String",
                  name: "message",
                  required: true,
                  kind: 4,
                },
                object: null,
                enum: null,
                unresolvedObjectOrEnum: null,
              },
            ],
            return: {
              type: "Boolean",
              name: "log",
              required: true,
              kind: 34,
              array: null,
              map: null,
              scalar: { type: "Boolean", name: "log", required: true, kind: 4 },
              object: null,
              enum: null,
              unresolvedObjectOrEnum: null,
            },
          },
        ],
        uri: "ens/logger.core.polywrap.eth",
        namespace: "Logger",
        nativeType: "Module",
        isInterface: false,
      },
    ],
    importedEnumTypes: [
      {
        type: "Logger_LogLevel",
        name: null,
        required: null,
        kind: 520,
        constants: ["DEBUG", "INFO", "WARN", "ERROR"],
        uri: "ens/logger.core.polywrap.eth",
        namespace: "Logger",
        nativeType: "LogLevel",
      },
    ],
    importedEnvTypes: [],
    moduleType: {
      type: "Module",
      name: null,
      required: null,
      kind: 128,
      methods: [
        {
          type: "Method",
          name: "log",
          required: true,
          kind: 64,
          arguments: [
            {
              type: "Logger_LogLevel",
              name: "level",
              required: true,
              kind: 34,
              array: null,
              map: null,
              scalar: null,
              object: null,
              enum: {
                type: "Logger_LogLevel",
                name: "level",
                required: true,
                kind: 16384,
              },
              unresolvedObjectOrEnum: null,
            },
            {
              type: "String",
              name: "message",
              required: true,
              kind: 34,
              array: null,
              map: null,
              scalar: {
                type: "String",
                name: "message",
                required: true,
                kind: 4,
              },
              object: null,
              enum: null,
              unresolvedObjectOrEnum: null,
            },
          ],
          return: {
            type: "Boolean",
            name: "log",
            required: true,
            kind: 34,
            array: null,
            map: null,
            scalar: { type: "Boolean", name: "log", required: true, kind: 4 },
            object: null,
            enum: null,
            unresolvedObjectOrEnum: null,
          },
        },
      ],
      imports: [{ type: "Logger_Module" }, { type: "Logger_LogLevel" }],
      interfaces: [
        {
          type: "Logger_Module",
          name: null,
          required: null,
          kind: 2048,
          array: null,
          map: null,
          scalar: null,
          object: null,
          enum: null,
          unresolvedObjectOrEnum: null,
        },
      ],
    }
  }
};
