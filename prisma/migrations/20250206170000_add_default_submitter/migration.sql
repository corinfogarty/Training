-- Update all existing resources to have corin as the submitter
UPDATE "Resource"
SET "submittedById" = 'cm6qpbpto0000s7tr09q0tf8t'
WHERE "submittedById" IS NULL; 