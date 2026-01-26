import { db } from '#config/database.js';
import { users } from '#models/user.model.js';
import { eq } from 'drizzle-orm';
import logger from '#config/logger.js';
import bcrypt from 'bcrypt';

export const hashPassword = async password => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (e) {
    logger.error(`Error hashing password: ${e}`);
    throw new Error('Error hashing password');
  }
};

export const comparePassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (e) {
    logger.error(`Error comparing password: ${e}`);
    throw new Error('Error comparing password');
  }
};

export const createUser = async (name, email, password, role = 'user') => {
  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0)
      throw new Error('User with this email already exists');

    const password_hash = await hashPassword(password);

    const [newUser] = await db
      .insert(users)
      .values({ name, email, password: password_hash, role })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
      });

    logger.info(`User ${newUser.email} created successfully`);
    return newUser;
  } catch (e) {
    logger.error(`Error creating user: ${e}`);
    throw e;
  }
};

export const authenticateUser = async (email, password) => {
  try {
    const [found] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!found) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await comparePassword(password, found.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    // Remove sensitive fields from user object
    const safeUser = Object.fromEntries(
      Object.entries(found).filter(
        ([key]) => !['password', 'updated_at'].includes(key)
      )
    );
    return safeUser;
  } catch (e) {
    if (e.message !== 'Invalid email or password') {
      logger.error(`Error authenticating user ${email}: ${e}`);
    }
    throw e;
  }
};
