import express from 'express';
import {
  fetchALLUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '#controllers/users.controller.js';
import {
  authenticationToken,
  requireRole,
} from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authenticationToken, requireRole('admin'), fetchALLUsers); // GET /api/users/ (admin only)

router.get('/:id', authenticationToken, getUserById); // GET /api/users/:id (admin or self)

router.put('/:id', authenticationToken, updateUser); // PUT /api/users/:id (self or admin)

router.delete('/:id', authenticationToken, requireRole('admin'), deleteUser); // DELETE /api/users/:id (admin only, cannot delete self)

export default router;
