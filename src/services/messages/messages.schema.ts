// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax, virtual } from '@feathersjs/schema';
import type { FromSchema } from '@feathersjs/schema';

import type { HookContext } from '../../declarations';
import { dataValidator, queryValidator } from '../../validators';

import { userSchema } from '../users/users.schema';

const messageSchemaProps = {
  id: { type: 'number' },
  text: { type: 'string' },
  createdAt: { type: 'number' },
  userId: { type: 'number' },
} as const;

// Main data model schema
export const messageSchema = {
  $id: 'Message',
  type: 'object',
  additionalProperties: false,
  required: ['id', 'text', 'userId', 'createdAt', 'user'],
  properties: {
    ...messageSchemaProps,
    user: { $ref: 'User' },
  },
} as const;
export type Message = FromSchema<typeof messageSchema, { references: [typeof userSchema] }>;

export const messageValidator = getValidator(messageSchema, dataValidator);
export const messageResolver = resolve<Message, HookContext>({
  user: virtual(async (message, context) => {
    // Associate the user that sent the message
    return context.app.service('users').get(message.userId);
  }),
});

export const messageExternalResolver = resolve<Message, HookContext>({});

// Schema for creating new data
export const messageDataSchema = {
  $id: 'MessageData',
  type: 'object',
  additionalProperties: false,
  required: ['text'],
  properties: {
    ...messageSchemaProps,
  },
} as const;
export type MessageData = FromSchema<typeof messageDataSchema>;
export const messageDataValidator = getValidator(messageDataSchema, dataValidator);
export const messageDataResolver = resolve<MessageData, HookContext>({
  userId: async (_value, _message, context) => {
    // Associate the record with the id of the authenticated user
    return context.params.user.id;
  },
  createdAt: async () => {
    return Date.now();
  },
});

// Schema for updating existing data
export const messagePatchSchema = {
  $id: 'MessagePatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...messageSchemaProps,
  },
} as const;
export type MessagePatch = FromSchema<typeof messagePatchSchema>;
export const messagePatchValidator = getValidator(messagePatchSchema, dataValidator);
export const messagePatchResolver = resolve<MessagePatch, HookContext>({});

// Schema for allowed query properties
export const messageQuerySchema = {
  $id: 'MessageQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(messageSchemaProps),
  },
} as const;
export type MessageQuery = FromSchema<typeof messageQuerySchema>;
export const messageQueryValidator = getValidator(messageQuerySchema, queryValidator);
export const messageQueryResolver = resolve<MessageQuery, HookContext>({
  userId: async (value, user, context) => {
    // We want to be able to find all messages but
    // only let a user modify their own messages otherwise
    if (context.params.user && context.method !== 'find') {
      return context.params.user.id;
    }

    return value;
  },
});
