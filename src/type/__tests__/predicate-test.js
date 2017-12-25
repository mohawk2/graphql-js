/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it } from 'mocha';
import { expect } from 'chai';

import {
  GraphQLScalarType,
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLUnionType,
  wrapType,
  GraphQLString,
  isType,
  isScalarType,
  isObjectType,
  isInterfaceType,
  isUnionType,
  isEnumType,
  isInputObjectType,
  isListType,
  isNonNullType,
  isInputType,
  isOutputType,
  isLeafType,
  isCompositeType,
  isAbstractType,
  isWrappingType,
  isNullableType,
  isNamedType,
  assertType,
  assertScalarType,
  assertObjectType,
  assertInterfaceType,
  assertUnionType,
  assertEnumType,
  assertInputObjectType,
  assertListType,
  assertNonNullType,
  assertInputType,
  assertOutputType,
  assertLeafType,
  assertCompositeType,
  assertAbstractType,
  assertWrappingType,
  assertNullableType,
  assertNamedType,
  getNullableType,
  getNamedType,
} from '../';

const ObjectType = new GraphQLObjectType({ name: 'Object' });
const InterfaceType = new GraphQLInterfaceType({ name: 'Interface' });
const UnionType = new GraphQLUnionType({ name: 'Union', types: [ObjectType] });
const EnumType = new GraphQLEnumType({ name: 'Enum', values: { foo: {} } });
const InputObjectType = new GraphQLInputObjectType({ name: 'InputObject' });
const ScalarType = new GraphQLScalarType({
  name: 'Scalar',
  serialize() {},
  parseValue() {},
  parseLiteral() {},
});

describe('Type predicates', () => {
  describe('isType', () => {
    it('returns true for unwrapped types', () => {
      expect(isType(GraphQLString)).to.equal(true);
      expect(() => assertType(GraphQLString)).not.to.throw();
      expect(isType(ObjectType)).to.equal(true);
      expect(() => assertType(ObjectType)).not.to.throw();
    });

    it('returns true for wrapped types', () => {
      expect(isType(wrapType(GraphQLString, '!'))).to.equal(true);
      expect(() => assertType(wrapType(GraphQLString, '!'))).not.to.throw();
    });

    it('returns false for type classes (rather than instances)', () => {
      expect(isType(GraphQLObjectType)).to.equal(false);
      expect(() => assertType(GraphQLObjectType)).to.throw();
    });

    it('returns false for random garbage', () => {
      expect(isType({ what: 'is this' })).to.equal(false);
      expect(() => assertType({ what: 'is this' })).to.throw();
    });
  });

  describe('isScalarType', () => {
    it('returns true for spec defined scalar', () => {
      expect(isScalarType(GraphQLString)).to.equal(true);
      expect(() => assertScalarType(GraphQLString)).not.to.throw();
    });

    it('returns true for custom scalar', () => {
      expect(isScalarType(ScalarType)).to.equal(true);
      expect(() => assertScalarType(ScalarType)).not.to.throw();
    });

    it('returns false for wrapped scalar', () => {
      expect(isScalarType(wrapType(ScalarType, ']'))).to.equal(false);
      expect(() => assertScalarType(wrapType(ScalarType, ']'))).to.throw();
    });

    it('returns false for non-scalar', () => {
      expect(isScalarType(EnumType)).to.equal(false);
      expect(() => assertScalarType(EnumType)).to.throw();
    });
  });

  describe('isObjectType', () => {
    it('returns true for object type', () => {
      expect(isObjectType(ObjectType)).to.equal(true);
      expect(() => assertObjectType(ObjectType)).not.to.throw();
    });

    it('returns false for wrapped object type', () => {
      expect(isObjectType(wrapType(ObjectType, ']'))).to.equal(false);
      expect(() => assertObjectType(wrapType(ObjectType, ']'))).to.throw();
    });

    it('returns false for non-object type', () => {
      expect(isObjectType(InterfaceType)).to.equal(false);
      expect(() => assertObjectType(InterfaceType)).to.throw();
    });
  });

  describe('isInterfaceType', () => {
    it('returns true for interface type', () => {
      expect(isInterfaceType(InterfaceType)).to.equal(true);
      expect(() => assertInterfaceType(InterfaceType)).not.to.throw();
    });

    it('returns false for wrapped interface type', () => {
      expect(isInterfaceType(wrapType(InterfaceType, ']'))).to.equal(false);
      expect(() =>
        assertInterfaceType(wrapType(InterfaceType, ']')),
      ).to.throw();
    });

    it('returns false for non-interface type', () => {
      expect(isInterfaceType(ObjectType)).to.equal(false);
      expect(() => assertInterfaceType(ObjectType)).to.throw();
    });
  });

  describe('isUnionType', () => {
    it('returns true for union type', () => {
      expect(isUnionType(UnionType)).to.equal(true);
      expect(() => assertUnionType(UnionType)).not.to.throw();
    });

    it('returns false for wrapped union type', () => {
      expect(isUnionType(wrapType(UnionType, ']'))).to.equal(false);
      expect(() => assertUnionType(wrapType(UnionType, ']'))).to.throw();
    });

    it('returns false for non-union type', () => {
      expect(isUnionType(ObjectType)).to.equal(false);
      expect(() => assertUnionType(ObjectType)).to.throw();
    });
  });

  describe('isEnumType', () => {
    it('returns true for enum type', () => {
      expect(isEnumType(EnumType)).to.equal(true);
      expect(() => assertEnumType(EnumType)).not.to.throw();
    });

    it('returns false for wrapped enum type', () => {
      expect(isEnumType(wrapType(EnumType, ']'))).to.equal(false);
      expect(() => assertEnumType(wrapType(EnumType, ']'))).to.throw();
    });

    it('returns false for non-enum type', () => {
      expect(isEnumType(ScalarType)).to.equal(false);
      expect(() => assertEnumType(ScalarType)).to.throw();
    });
  });

  describe('isInputObjectType', () => {
    it('returns true for input object type', () => {
      expect(isInputObjectType(InputObjectType)).to.equal(true);
      expect(() => assertInputObjectType(InputObjectType)).not.to.throw();
    });

    it('returns false for wrapped input object type', () => {
      expect(isInputObjectType(wrapType(InputObjectType, ']'))).to.equal(false);
      expect(() =>
        assertInputObjectType(wrapType(InputObjectType, ']')),
      ).to.throw();
    });

    it('returns false for non-input-object type', () => {
      expect(isInputObjectType(ObjectType)).to.equal(false);
      expect(() => assertInputObjectType(ObjectType)).to.throw();
    });
  });

  describe('isListType', () => {
    it('returns true for a list wrapped type', () => {
      expect(isListType(wrapType(ObjectType, ']'))).to.equal(true);
      expect(() => assertListType(wrapType(ObjectType, ']'))).not.to.throw();
    });

    it('returns false for an unwrapped type', () => {
      expect(isListType(ObjectType)).to.equal(false);
      expect(() => assertListType(ObjectType)).to.throw();
    });

    it('returns true for a non-list wrapped type', () => {
      expect(isListType(wrapType(ObjectType, ']!'))).to.equal(false);
      expect(() => assertListType(wrapType(ObjectType, ']!'))).to.throw();
    });
  });

  describe('isNonNullType', () => {
    it('returns true for a non-null wrapped type', () => {
      expect(isNonNullType(wrapType(ObjectType, '!'))).to.equal(true);
      expect(() => assertNonNullType(wrapType(ObjectType, '!'))).not.to.throw();
    });

    it('returns false for an unwrapped type', () => {
      expect(isNonNullType(ObjectType)).to.equal(false);
      expect(() => assertNonNullType(ObjectType)).to.throw();
    });

    it('returns true for a not non-null wrapped type', () => {
      expect(isNonNullType(wrapType(ObjectType, '!]'))).to.equal(false);
      expect(() => assertNonNullType(wrapType(ObjectType, '!]'))).to.throw();
    });
  });

  describe('isInputType', () => {
    it('returns true for an input type', () => {
      expect(isInputType(InputObjectType)).to.equal(true);
      expect(() => assertInputType(InputObjectType)).not.to.throw();
    });

    it('returns true for a wrapped input type', () => {
      expect(isInputType(wrapType(InputObjectType, ']'))).to.equal(true);
      expect(() =>
        assertInputType(wrapType(InputObjectType, ']')),
      ).not.to.throw();
      expect(isInputType(wrapType(InputObjectType, '!'))).to.equal(true);
      expect(() =>
        assertInputType(wrapType(InputObjectType, '!')),
      ).not.to.throw();
    });

    it('returns false for an output type', () => {
      expect(isInputType(ObjectType)).to.equal(false);
      expect(() => assertInputType(ObjectType)).to.throw();
    });

    it('returns false for a wrapped output type', () => {
      expect(isInputType(wrapType(ObjectType, ']'))).to.equal(false);
      expect(() => assertInputType(wrapType(ObjectType, ']'))).to.throw();
      expect(isInputType(wrapType(ObjectType, '!'))).to.equal(false);
      expect(() => assertInputType(wrapType(ObjectType, '!'))).to.throw();
    });
  });

  describe('isOutputType', () => {
    it('returns true for an output type', () => {
      expect(isOutputType(ObjectType)).to.equal(true);
      expect(() => assertOutputType(ObjectType)).not.to.throw();
    });

    it('returns true for a wrapped output type', () => {
      expect(isOutputType(wrapType(ObjectType, ']'))).to.equal(true);
      expect(() => assertOutputType(wrapType(ObjectType, ']'))).not.to.throw();
      expect(isOutputType(wrapType(ObjectType, '!'))).to.equal(true);
      expect(() => assertOutputType(wrapType(ObjectType, '!'))).not.to.throw();
    });

    it('returns false for an input type', () => {
      expect(isOutputType(InputObjectType)).to.equal(false);
      expect(() => assertOutputType(InputObjectType)).to.throw();
    });

    it('returns false for a wrapped input type', () => {
      expect(isOutputType(wrapType(InputObjectType, ']'))).to.equal(false);
      expect(() => assertOutputType(wrapType(InputObjectType, ']'))).to.throw();
      expect(isOutputType(wrapType(InputObjectType, '!'))).to.equal(false);
      expect(() => assertOutputType(wrapType(InputObjectType, '!'))).to.throw();
    });
  });

  describe('isLeafType', () => {
    it('returns true for scalar and enum types', () => {
      expect(isLeafType(ScalarType)).to.equal(true);
      expect(() => assertLeafType(ScalarType)).not.to.throw();
      expect(isLeafType(EnumType)).to.equal(true);
      expect(() => assertLeafType(EnumType)).not.to.throw();
    });

    it('returns false for wrapped leaf type', () => {
      expect(isLeafType(wrapType(ScalarType, ']'))).to.equal(false);
      expect(() => assertLeafType(wrapType(ScalarType, ']'))).to.throw();
    });

    it('returns false for non-leaf type', () => {
      expect(isLeafType(ObjectType)).to.equal(false);
      expect(() => assertLeafType(ObjectType)).to.throw();
    });

    it('returns false for wrapped non-leaf type', () => {
      expect(isLeafType(wrapType(ObjectType, ']'))).to.equal(false);
      expect(() => assertLeafType(wrapType(ObjectType, ']'))).to.throw();
    });
  });

  describe('isCompositeType', () => {
    it('returns true for object, interface, and union types', () => {
      expect(isCompositeType(ObjectType)).to.equal(true);
      expect(() => assertCompositeType(ObjectType)).not.to.throw();
      expect(isCompositeType(InterfaceType)).to.equal(true);
      expect(() => assertCompositeType(InterfaceType)).not.to.throw();
      expect(isCompositeType(UnionType)).to.equal(true);
      expect(() => assertCompositeType(UnionType)).not.to.throw();
    });

    it('returns false for wrapped composite type', () => {
      expect(isCompositeType(wrapType(ObjectType, ']'))).to.equal(false);
      expect(() => assertCompositeType(wrapType(ObjectType, ']'))).to.throw();
    });

    it('returns false for non-composite type', () => {
      expect(isCompositeType(InputObjectType)).to.equal(false);
      expect(() => assertCompositeType(InputObjectType)).to.throw();
    });

    it('returns false for wrapped non-composite type', () => {
      expect(isCompositeType(wrapType(InputObjectType, ']'))).to.equal(false);
      expect(() =>
        assertCompositeType(wrapType(InputObjectType, ']')),
      ).to.throw();
    });
  });

  describe('isAbstractType', () => {
    it('returns true for interface and union types', () => {
      expect(isAbstractType(InterfaceType)).to.equal(true);
      expect(() => assertAbstractType(InterfaceType)).not.to.throw();
      expect(isAbstractType(UnionType)).to.equal(true);
      expect(() => assertAbstractType(UnionType)).not.to.throw();
    });

    it('returns false for wrapped abstract type', () => {
      expect(isAbstractType(wrapType(InterfaceType, ']'))).to.equal(false);
      expect(() => assertAbstractType(wrapType(InterfaceType, ']'))).to.throw();
    });

    it('returns false for non-abstract type', () => {
      expect(isAbstractType(ObjectType)).to.equal(false);
      expect(() => assertAbstractType(ObjectType)).to.throw();
    });

    it('returns false for wrapped non-abstract type', () => {
      expect(isAbstractType(wrapType(ObjectType, ']'))).to.equal(false);
      expect(() => assertAbstractType(wrapType(ObjectType, ']'))).to.throw();
    });
  });

  describe('isWrappingType', () => {
    it('returns true for list and non-null types', () => {
      expect(isWrappingType(wrapType(ObjectType, ']'))).to.equal(true);
      expect(() =>
        assertWrappingType(wrapType(ObjectType, ']')),
      ).not.to.throw();
      expect(isWrappingType(wrapType(ObjectType, '!'))).to.equal(true);
      expect(() =>
        assertWrappingType(wrapType(ObjectType, '!')),
      ).not.to.throw();
    });

    it('returns false for unwrapped types', () => {
      expect(isWrappingType(ObjectType)).to.equal(false);
      expect(() => assertWrappingType(ObjectType)).to.throw();
    });
  });

  describe('isNullableType', () => {
    it('returns true for unwrapped types', () => {
      expect(isNullableType(ObjectType)).to.equal(true);
      expect(() => assertNullableType(ObjectType)).not.to.throw();
    });

    it('returns true for list of non-null types', () => {
      expect(isNullableType(wrapType(ObjectType, '!]'))).to.equal(true);
      expect(() =>
        assertNullableType(wrapType(ObjectType, '!]')),
      ).not.to.throw();
    });

    it('returns false for non-null types', () => {
      expect(isNullableType(wrapType(ObjectType, '!'))).to.equal(false);
      expect(() => assertNullableType(wrapType(ObjectType, '!'))).to.throw();
    });
  });

  describe('getNullableType', () => {
    it('returns undefined for no type', () => {
      expect(getNullableType()).to.equal(undefined);
      expect(getNullableType(null)).to.equal(undefined);
    });

    it('returns self for a nullable type', () => {
      expect(getNullableType(ObjectType)).to.equal(ObjectType);
      const listOfObj = wrapType(ObjectType, ']');
      expect(getNullableType(listOfObj)).to.equal(listOfObj);
    });

    it('unwraps non-null type', () => {
      expect(getNullableType(wrapType(ObjectType, '!'))).to.equal(ObjectType);
    });
  });

  describe('isNamedType', () => {
    it('returns true for unwrapped types', () => {
      expect(isNamedType(ObjectType)).to.equal(true);
      expect(() => assertNamedType(ObjectType)).not.to.throw();
    });

    it('returns false for list and non-null types', () => {
      expect(isNamedType(wrapType(ObjectType, ']'))).to.equal(false);
      expect(() => assertNamedType(wrapType(ObjectType, ']'))).to.throw();
      expect(isNamedType(wrapType(ObjectType, '!'))).to.equal(false);
      expect(() => assertNamedType(wrapType(ObjectType, '!'))).to.throw();
    });
  });

  describe('getNamedType', () => {
    it('returns undefined for no type', () => {
      expect(getNamedType()).to.equal(undefined);
      expect(getNamedType(null)).to.equal(undefined);
    });

    it('returns self for a unwrapped type', () => {
      expect(getNamedType(ObjectType)).to.equal(ObjectType);
    });

    it('unwraps wrapper types', () => {
      expect(getNamedType(wrapType(ObjectType, '!'))).to.equal(ObjectType);
      expect(getNamedType(wrapType(ObjectType, ']'))).to.equal(ObjectType);
    });

    it('unwraps deeply wrapper types', () => {
      expect(getNamedType(wrapType(ObjectType, '!]!'))).to.equal(ObjectType);
    });
  });
});
