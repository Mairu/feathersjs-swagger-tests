// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import crypto from 'crypto';
import { resolve, getValidator, querySyntax } from '@feathersjs/schema';
import type { FromSchema } from '@feathersjs/schema';
import { passwordHash } from '@feathersjs/authentication-local';

import type { HookContext } from '../../declarations';
import { dataValidator, queryValidator } from '../../validators';

// Main data model schema
export const userSchema = {
  $id: 'User',
  type: 'object',
  additionalProperties: false,
  required: ['id', 'email'],
  properties: {
    id: { type: 'number' },
    email: { type: 'string' },
    password: { type: 'string' },
    avatar: { type: 'string' },
  },
} as const;
export type User = FromSchema<typeof userSchema>;
export const userValidator = getValidator(userSchema, dataValidator);
export const userResolver = resolve<User, HookContext>({});

export const userExternalResolver = resolve<User, HookContext>({
  // The password should never be visible externally
  password: async () => undefined,
});

// Schema for creating new data
export const userDataSchema = {
  $id: 'UserData',
  type: 'object',
  additionalProperties: false,
  required: ['email'],
  properties: {
    ...userSchema.properties,
  },
} as const;
export type UserData = FromSchema<typeof userDataSchema>;
export const userDataValidator = getValidator(userDataSchema, dataValidator);
export const userDataResolver = resolve<UserData, HookContext>({
  password: passwordHash({ strategy: 'local' }),
  avatar: async (value, user) => {
    if (value !== undefined) {
      return value;
    }

    // Gravatar uses MD5 hashes from an email address to get the image
    const hash = crypto.createHash('md5').update(user.email.toLowerCase()).digest('hex');
    // Return the full avatar URL
    return `https://s.gravatar.com/avatar/${hash}?s=60`;
  },
});

// Schema for updating existing data
export const userPatchSchema = {
  $id: 'UserPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...userSchema.properties,
  },
} as const;
export type UserPatch = FromSchema<typeof userPatchSchema>;
export const userPatchValidator = getValidator(userPatchSchema, dataValidator);
export const userPatchResolver = resolve<UserPatch, HookContext>({
  password: passwordHash({ strategy: 'local' }),
});

// Schema for allowed query properties
export const userQuerySchema = {
  $id: 'UserQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(userSchema.properties),
  },
} as const;
export type UserQuery = FromSchema<typeof userQuerySchema>;
export const userQueryValidator = getValidator(userQuerySchema, queryValidator);
export const userQueryResolver = resolve<UserQuery, HookContext>({
  // If there is a user (e.g. with authentication), they are only allowed to see their own data
  id: async (value, user, context) => {
    // We want to be able to get a list of all users but
    // only let a user modify their own data otherwise
    if (context.params.user && context.method !== 'find') {
      return context.params.user.id;
    }

    return value;
  },
});
