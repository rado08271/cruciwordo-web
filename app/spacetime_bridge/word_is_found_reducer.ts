// THIS FILE IS AUTOMATICALLY GENERATED BY SPACETIMEDB. EDITS TO THIS FILE
// WILL NOT BE SAVED. MODIFY TABLES IN YOUR MODULE SOURCE CODE INSTEAD.

/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
import {AlgebraicType, BinaryReader, BinaryWriter, ProductTypeElement,} from "@clockworklabs/spacetimedb-sdk";

export type WordIsFound = {
  boardId: string,
  word: string,
};

/**
 * A namespace for generated helper functions.
 */
export namespace WordIsFound {
  /**
  * A function which returns this type represented as an AlgebraicType.
  * This function is derived from the AlgebraicType used to generate this type.
  */
  export function getTypeScriptAlgebraicType(): AlgebraicType {
    return AlgebraicType.createProductType([
      new ProductTypeElement("boardId", AlgebraicType.createStringType()),
      new ProductTypeElement("word", AlgebraicType.createStringType()),
    ]);
  }

  export function serialize(writer: BinaryWriter, value: WordIsFound): void {
    WordIsFound.getTypeScriptAlgebraicType().serialize(writer, value);
  }

  export function deserialize(reader: BinaryReader): WordIsFound {
    return WordIsFound.getTypeScriptAlgebraicType().deserialize(reader);
  }

}

