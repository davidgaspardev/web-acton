-- Add ai_opinion and condicoes fields to Results table
ALTER TABLE `Results` ADD COLUMN `ai_opinion` TEXT NULL;
ALTER TABLE `Results` ADD COLUMN `condicoes` JSON NULL;
