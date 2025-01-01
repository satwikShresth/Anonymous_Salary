import { CompanyService } from './company.service.ts';
import { PositionService } from './position.service.ts';
import { RelationService } from './relation.service.ts';
import { SubmissionService } from './submission.service.ts';
import {
   SubmissionBaseFetchService,
   SubmissionFilterService,
   SubmissionRelationsService,
} from './query/submission.service.ts';

export const submissionBaseFetchService = new SubmissionBaseFetchService();
export const submissionFilterService = new SubmissionFilterService();
export const submissionRelationsService = new SubmissionRelationsService();
export const companyService = new CompanyService();
export const positionService = new PositionService();
export const relationService = new RelationService();
export const submissionService = new SubmissionService();
