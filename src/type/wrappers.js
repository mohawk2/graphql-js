/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import { assertType, assertNullableType } from './definition';
import type {
  GraphQLType,
  GraphQLNullableType,
  GraphQLOutputType,
  GraphQLScalarType,
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLUnionType,
} from './definition';
import invariant from '../jsutils/invariant';

// For memoising type-wrappers against their ofType
type CacheTypeKey = ']' | '!';
// void is to shut Flow up as that's in the definition of WeakMap
type TypeCacheMap = { [CacheTypeKey]: GraphQLType } | void | null;
const wrapperCache: WeakMap<GraphQLType, TypeCacheMap> = new WeakMap();

// cache lookup
function lookupOrMake(
  ofType: GraphQLType,
  specChar: CacheTypeKey,
  cons: GraphQLType => mixed,
) {
  let thisObjectMap: TypeCacheMap = (wrapperCache.get(ofType): TypeCacheMap);
  if (!thisObjectMap) {
    wrapperCache.set(ofType, (thisObjectMap = {}));
  }
  if (!thisObjectMap[specChar]) {
    thisObjectMap[specChar] = new cons(ofType);
  }
  return thisObjectMap[specChar];
}

/**
 * List Type Wrapper
 *
 * A list is a wrapping type which points to another type.
 * Lists are often created within the context of defining the fields of
 * an object type.
 *
 * Example:
 *
 *     const PersonType = new GraphQLObjectType({
 *       name: 'Person',
 *       fields: () => ({
 *         parents: { type: GraphQLList(PersonType) },
 *         children: { type: GraphQLList(PersonType) },
 *       })
 *     })
 *
 */
declare class GraphQLList<+T: GraphQLType> {
  +ofType: T;
  static <T>(ofType: T): GraphQLList<T>;
  // Note: constructors cannot be used for covariant types. Drop the "new".
  constructor(ofType: any): void;
}
// eslint-disable-next-line no-redeclare
export function GraphQLList(ofType) {
  if (this instanceof GraphQLList) {
    this.ofType = assertType(ofType);
  } else {
    assertType(ofType);
    return lookupOrMake(ofType, ']', GraphQLList);
  }
}

// Also provide toJSON and inspect aliases for toString.
const listProto: any = GraphQLList.prototype;
listProto.toString = listProto.toJSON = listProto.inspect = function toString() {
  return '[' + String(this.ofType) + ']';
};

/**
 * Non-Null Type Wrapper
 *
 * A non-null is a wrapping type which points to another type.
 * Non-null types enforce that their values are never null and can ensure
 * an error is raised if this ever occurs during a request. It is useful for
 * fields which you can make a strong guarantee on non-nullability, for example
 * usually the id field of a database row will never be null.
 *
 * Example:
 *
 *     const RowType = new GraphQLObjectType({
 *       name: 'Row',
 *       fields: () => ({
 *         id: { type: GraphQLNonNull(GraphQLString) },
 *       })
 *     })
 *
 * Note: the enforcement of non-nullability occurs within the executor.
 */
declare class GraphQLNonNull<+T: GraphQLNullableType> {
  +ofType: T;
  static <T>(ofType: T): GraphQLNonNull<T>;
  // Note: constructors cannot be used for covariant types. Drop the "new".
  constructor(ofType: any): void;
}
// eslint-disable-next-line no-redeclare
export function GraphQLNonNull(ofType) {
  if (this instanceof GraphQLNonNull) {
    this.ofType = assertNullableType(ofType);
  } else {
    assertNullableType(ofType);
    return lookupOrMake(ofType, '!', GraphQLNonNull);
  }
}

// Also provide toJSON and inspect aliases for toString.
const nonNullProto: any = GraphQLNonNull.prototype;
nonNullProto.toString = nonNullProto.toJSON = nonNullProto.inspect = function toString() {
  return String(this.ofType) + '!';
};

// E.g. wrapType(String, '!]') -> List of NonNull String
// For Flow reasons, you can't wrap already-wrapped types.
// eslint-disable-next-line no-redeclare
declare function wrapType(
  // Output-only are grouped together as guarantee return OutputType
  ofType: GraphQLObjectType | GraphQLInterfaceType | GraphQLUnionType,
  wrapSpec: string,
): GraphQLOutputType;
// These declarations are by definition lies (they will be wrapped
// versions) but are true enough that a thing that wants InputType or
// OutputType will be satisfied.
// eslint-disable-next-line no-redeclare
declare function wrapType(
  ofType: GraphQLScalarType,
  wrapSpec: string,
): GraphQLScalarType;
// eslint-disable-next-line no-redeclare
declare function wrapType(
  ofType: GraphQLEnumType,
  wrapSpec: string,
): GraphQLEnumType;
// eslint-disable-next-line no-redeclare
declare function wrapType(
  ofType: GraphQLInputObjectType,
  wrapSpec: string,
): GraphQLInputObjectType;
// eslint-disable-next-line no-redeclare
export function wrapType(ofType, wrapSpec) {
  invariant(wrapSpec !== '', 'Zero-length wrapSpec given.');
  return wrapSpec.split('').reduce((type, specChar) => {
    switch (specChar) {
      case ']':
        return GraphQLList(type);
      case '!':
        return GraphQLNonNull((type: GraphQLNullableType));
      default:
        throw new Error('Invalid wrapSpec character: ' + specChar);
    }
  }, ofType);
}
