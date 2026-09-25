import { Router } from 'express';
import {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/project.controller.js';
import {
  applyToProject,
  listApplicationsForProject,
  getMyApplicationForProject,
} from '../controllers/application.controller.js';
import { validate } from '../middleware/validate.js';
import { createProjectRules, updateProjectRules } from '../validators/project.validator.js';
import { applyRules } from '../validators/application.validator.js';
import { authenticate } from '../middleware/auth.js';


const router = Router();


router.get('/', listProjects);
router.get('/:id', getProject);
router.post('/', authenticate, createProjectRules, validate, createProject);
router.patch('/:id', authenticate, updateProjectRules, validate, updateProject);
router.delete('/:id', authenticate, deleteProject);


router.post('/:id/apply', authenticate, applyRules, validate, applyToProject);
router.get('/:id/applications', authenticate, listApplicationsForProject);
router.get('/:id/my-application', authenticate, getMyApplicationForProject);


export default router;