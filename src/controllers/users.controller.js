import {
  getALLUsers,
  getUserById as getUserByIdService,
  updateUser as updateUserService,
  deleteUser as deleteUserService,
} from '../routes/users.service.js';
import logger from '../config/logger.js';
import {
  updateUserSchema,
  userIdSchema,
} from '../validations/users.validation.js';

export const fetchALLUsers = async (_req, res, next) => {
  try {
    logger.info('Getting all users...');

    const allUsers = await getALLUsers();

    res.json({
      message: 'Successfully fetched all users',
      users: allUsers,
      count: allUsers.length,
    });
  } catch (e) {
    logger.error(e);
    next(e);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    logger.info('Getting user by id...');

    const { id } = userIdSchema.parse(req.params);
    const requester = req.user;
    if (!requester) return res.status(401).json({ message: 'Unauthorized' });

    // Self-access protection: non-admins can only access their own data
    if (requester.role !== 'admin' && requester.id !== id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const user = await getUserByIdService(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Successfully fetched user', user });
  } catch (e) {
    logger.error('Get user by id error', e);
    next(e);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    logger.info('Updating user...');

    const { id } = userIdSchema.parse(req.params);
    const updates = updateUserSchema.parse(req.body);

    const requester = req.user;
    if (!requester) return res.status(401).json({ message: 'Unauthorized' });

    // Role-change protection: only admins can change a user's role
    if (updates.role && requester.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can change roles' });
    }

    // Self-update protection: non-admins can only update their own account
    if (requester.role !== 'admin' && requester.id !== id) {
      return res
        .status(403)
        .json({ message: 'You can only update your own account' });
    }

    const updated = await updateUserService(id, updates);

    res.json({ message: 'User updated successfully', user: updated });
  } catch (e) {
    logger.error('Update user controller error', e);
    next(e);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    logger.info('Deleting user...');
    const { id } = userIdSchema.parse(req.params);
    const requester = req.user;
    if (!requester) return res.status(401).json({ message: 'Unauthorized' });

    if (requester.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can delete users' });
    }

    if (requester.id === id) {
      return res
        .status(403)
        .json({ message: 'Admin cannot delete their own account' });
    }

    const deleted = await deleteUserService(id);
    res.json({ message: 'User deleted', user: deleted });
  } catch (e) {
    logger.error('Delete user controller error', e);
    next(e);
  }
};
