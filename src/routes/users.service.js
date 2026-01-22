import { db } from '../config/database.js';
import { users } from '../models/user.model.js';
import logger from '../config/logger.js';
import { eq } from 'drizzle-orm';
import { hashPassword } from '../services/auth.service.js';

export const getALLUsers = async () => {
  try {
    return await db.select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      created_at: users.created_at,
      updated_at: users.updated_at,
    }).from(users);
  } catch (e) {
    logger.error('Get all users error', e);
    throw e;
  }
};

export const getUserById = async (id) => {
  try {
    const result = await db.select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      created_at: users.created_at,
      updated_at: users.updated_at,
    }).from(users).where(eq(users.id, id));

    return result?.[0] ?? null;
  } catch (e) {
    logger.error('Get user by id error', e);
    throw e;
  }
};

export const updateUser = async (id, updates) => {
  try {
    const existing = await getUserById(id);
    if (!existing) {
      const err = new Error('User not found');
      err.status = 404;
      throw err;
    }

    const allowed = {};
    if (typeof updates.name === 'string') allowed.name = updates.name;
    if (typeof updates.email === 'string') allowed.email = updates.email;
    if (typeof updates.role === 'string') allowed.role = updates.role;

    // If email is being changed, ensure uniqueness
    if (allowed.email && allowed.email !== existing.email) {
      const [dupe] = await db.select().from(users).where(eq(users.email, allowed.email)).limit(1);
      if (dupe) {
        const err = new Error('Email already in use');
        err.status = 400;
        throw err;
      }
    }

    // Handle password separately so we can hash it
    if (typeof updates.password === 'string') {
      allowed.password = await hashPassword(updates.password);
    }

    if (Object.keys(allowed).length === 0) return existing;

    await db.update(users).set({ ...allowed, updated_at: new Date() }).where(eq(users.id, id));

    return await getUserById(id);
  } catch (e) {
    logger.error('Update user error', e);
    throw e;
  }
};

export const deleteUser = async (id) => {
  try {
    const existing = await getUserById(id);
    if (!existing) {
      const err = new Error('User not found');
      err.status = 404;
      throw err;
    }

    await db.delete(users).where(eq(users.id, id));
    return existing;
  } catch (e) {
    logger.error('Delete user error', e);
    throw e;
  }
};
