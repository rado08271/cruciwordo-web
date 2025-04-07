// THIS FILE IS AUTOMATICALLY GENERATED BY SPACETIMEDB. EDITS TO THIS FILE
// WILL NOT BE SAVED. MODIFY TABLES IN YOUR MODULE SOURCE CODE INSTEAD.

/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
import {AlgebraicType, BinaryReader, BinaryWriter, ProductTypeElement,} from "@clockworklabs/spacetimedb-sdk";

export type DictionaryDatabaseModel = {
  wordId: string,
  word: string,
  language: string,
  category: string | undefined,
};

/**
 * A namespace for generated helper functions.
 */
export namespace DictionaryDatabaseModel {
  /**
  * A function which returns this type represented as an AlgebraicType.
  * This function is derived from the AlgebraicType used to generate this type.
  */
  export function getTypeScriptAlgebraicType(): AlgebraicType {
    return AlgebraicType.createProductType([
      new ProductTypeElement("wordId", AlgebraicType.createStringType()),
      new ProductTypeElement("word", AlgebraicType.createStringType()),
      new ProductTypeElement("language", AlgebraicType.createStringType()),
      new ProductTypeElement("category", AlgebraicType.createOptionType(AlgebraicType.createStringType())),
    ]);
  }

  export function serialize(writer: BinaryWriter, value: DictionaryDatabaseModel): void {
    DictionaryDatabaseModel.getTypeScriptAlgebraicType().serialize(writer, value);
  }

  export function deserialize(reader: BinaryReader): DictionaryDatabaseModel {
    return DictionaryDatabaseModel.getTypeScriptAlgebraicType().deserialize(reader);
  }

}


