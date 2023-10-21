import {integer, pgEnum, pgTable, serial, text,timestamp, varchar} from 'drizzle-orm/pg-core';

export const userSystemEnum = pgEnum('user_system_enum', ['admin', 'user']);


export const chats = pgTable('chats', {
    id: serial('id').primaryKey(),
    pdfName:text('pdfName').notNull(),
    pdfUrl:text('pdfUrl').notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    userId: varchar('user_id', {length: 255}).notNull(),
    fileKey: text('file_key').notNull(),
})


export const message = pgTable('message', {
    id: serial('id').primaryKey(),
    chatId:integer('chat_id').references(() => chats.id).notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    role: userSystemEnum('role').notNull()
});