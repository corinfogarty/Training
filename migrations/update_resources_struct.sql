-- For PostgreSQL:
BEGIN;

CREATE TYPE resource_enum AS ENUM ('Resource', 'Training', 'Shortcut');

ALTER TABLE resources ADD COLUMN resource_type resource_enum NOT NULL DEFAULT 'Training';

UPDATE resources SET resource_type = 'Training';

ALTER TABLE resources DROP COLUMN "Type";

COMMIT;

-- For MySQL (uncomment to use):
/*
ALTER TABLE resources ADD COLUMN resource_type ENUM('Resource', 'Training', 'Shortcut') NOT NULL DEFAULT 'Training';

UPDATE resources SET resource_type = 'Training';

ALTER TABLE resources DROP COLUMN `Type`;
*/ 