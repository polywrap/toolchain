import { AnyType, ImportRefType, RefType, UnlinkedImportRefType } from "@polywrap/abi-types";
import { AbiVisitor, IAbiVisitor } from "./AbiVisitor";

export interface ILinkerVisitorEnterAndLeave {
  enter: IAbiVisitor & { UnlinkedImportRefType: (unlinkedRefType: UnlinkedImportRefType) => RefType | ImportRefType };
  leave?: IAbiVisitor & { UnlinkedImportRefType: <T extends RefType | ImportRefType>(linkedRefType: T) => T };
}

export class LinkerVisitor extends AbiVisitor {
  constructor(protected readonly visitor: ILinkerVisitorEnterAndLeave) {
    super(visitor);
  }

  AnyType(node: AnyType): AnyType {
    let mutatedNode = node;

    if (this.visitor.enter?.AnyType) {
      mutatedNode = this.coerceVoidToUndefined(this.visitor.enter.AnyType(mutatedNode)) ?? mutatedNode;
    }

    switch (mutatedNode.kind) {
      case "Scalar":
        mutatedNode = this.ScalarType(mutatedNode);
        break;
      case "Array":
        mutatedNode = this.ArrayType(mutatedNode);
        break;
      case "Map":
        mutatedNode = this.MapType(mutatedNode);
        break;
      case "Ref":
        mutatedNode = this.RefType(mutatedNode);
        break;
      case "ImportRef":
        mutatedNode = this.ImportRefType(mutatedNode);
        break;
      case "UnlinkedImportRef":
        mutatedNode = this.UnlinkedImportRefType(mutatedNode);
        break;
    }

    if (this.visitor.leave?.AnyType) {
      mutatedNode = this.coerceVoidToUndefined(this.visitor.leave.AnyType(mutatedNode)) ?? mutatedNode;
    }

    return mutatedNode;
  }

  UnlinkedImportRefType(node: UnlinkedImportRefType): RefType | ImportRefType {
    let linkedRef = this.visitor.enter.UnlinkedImportRefType(node);

    if (this.visitor.leave?.UnlinkedImportRefType) {
      linkedRef = this.visitor.leave.UnlinkedImportRefType(linkedRef);
    }

    return linkedRef;
  }
}