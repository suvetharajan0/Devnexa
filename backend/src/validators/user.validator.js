import { body } from 'express-validator';


export const updateProfileRules = [
  body('name').optional().trim().isLength({ max: 80 }),
  body('bio').optional().trim().isLength({ max: 500 }),
  body('skills').optional().isArray(),
  body('avatar').optional().trim(),
];


export const changePasswordRules = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters'),
];


export const updateNotificationPreferencesRules = [
  body('applications').optional().isBoolean(),
  body('tasks').optional().isBoolean(),
];


export const deleteAccountRules = [
  body('password').notEmpty().withMessage('Please confirm your password to delete your account'),
];
