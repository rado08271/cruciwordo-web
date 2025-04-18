// THIS FILE IS AUTOMATICALLY GENERATED BY SPACETIMEDB. EDITS TO THIS FILE
// WILL NOT BE SAVED. MODIFY TABLES IN YOUR MODULE SOURCE CODE INSTEAD.

/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
import {AlgebraicType, BinaryReader, BinaryWriter, ProductTypeElement,} from "@clockworklabs/spacetimedb-sdk";

export type WordPlacementsDatabaseModel = {
  id: string,
  boardId: string,
  direction: string,
  wordId: string,
  startRow: number,
  startCol: number,
  word: string,
};

/**
 * A namespace for generated helper functions.
 */
export namespace WordPlacementsDatabaseModel {
  /**
  * A function which returns this type represented as an AlgebraicType.
  * This function is derived from the AlgebraicType used to generate this type.
  */
  export function getTypeScriptAlgebraicType(): AlgebraicType {
    return AlgebraicType.createProductType([
      new ProductTypeElement("id", AlgebraicType.createStringType()),
      new ProductTypeElement("boardId", AlgebraicType.createStringType()),
      new ProductTypeElement("direction", AlgebraicType.createStringType()),
      new ProductTypeElement("wordId", AlgebraicType.createStringType()),
      new ProductTypeElement("startRow", AlgebraicType.createU8Type()),
      new ProductTypeElement("startCol", AlgebraicType.createU8Type()),
      new ProductTypeElement("word", AlgebraicType.createStringType()),
    ]);
  }

  export function serialize(writer: BinaryWriter, value: WordPlacementsDatabaseModel): void {
    WordPlacementsDatabaseModel.getTypeScriptAlgebraicType().serialize(writer, value);
  }

  export function deserialize(reader: BinaryReader): WordPlacementsDatabaseModel {
    return WordPlacementsDatabaseModel.getTypeScriptAlgebraicType().deserialize(reader);
  }

}


