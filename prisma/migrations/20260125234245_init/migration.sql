-- AlterTable
ALTER TABLE "ExampleProject" ADD COLUMN     "description_en" TEXT,
ADD COLUMN     "detailedDescription_en" TEXT,
ADD COLUMN     "tagline_en" TEXT;

-- AlterTable
ALTER TABLE "PersonalData" ADD COLUMN     "facebook" TEXT,
ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "twitter" TEXT;

-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "description_en" TEXT,
ADD COLUMN     "detailedDescription_en" TEXT,
ADD COLUMN     "tagline_en" TEXT;
