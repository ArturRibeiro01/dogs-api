-- CreateEnum
CREATE TYPE "DogSex" AS ENUM ('male', 'female', 'unknown');

-- CreateEnum
CREATE TYPE "DogSize" AS ENUM ('small', 'medium', 'large');

-- CreateEnum
CREATE TYPE "DogInterest" AS ENUM ('friendship', 'walks', 'community', 'breeding');

-- CreateEnum
CREATE TYPE "DogMembershipRole" AS ENUM ('owner', 'editor');

-- CreateEnum
CREATE TYPE "DogMembershipStatus" AS ENUM ('active', 'pending', 'removed');

-- CreateEnum
CREATE TYPE "PostVisibility" AS ENUM ('public', 'private', 'unlisted');

-- CreateEnum
CREATE TYPE "ContactInterestStatus" AS ENUM ('pending', 'accepted', 'rejected', 'cancelled');

-- CreateEnum
CREATE TYPE "AnalyticsEventType" AS ENUM ('post_view', 'dog_profile_view', 'post_created', 'dog_created');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "supabaseAuthId" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "city" TEXT,
    "state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dog" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "breedId" UUID NOT NULL,
    "birthDate" TIMESTAMP(3),
    "sex" "DogSex" NOT NULL DEFAULT 'unknown',
    "size" "DogSize",
    "weight" DECIMAL(5,2),
    "bio" TEXT,
    "avatarUrl" TEXT,
    "city" TEXT,
    "state" TEXT,
    "interests" "DogInterest"[] DEFAULT ARRAY[]::"DogInterest"[],
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DogMembership" (
    "id" UUID NOT NULL,
    "dogId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "role" "DogMembershipRole" NOT NULL,
    "status" "DogMembershipStatus" NOT NULL DEFAULT 'active',
    "invitedByUserId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DogMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DogInvite" (
    "id" UUID NOT NULL,
    "dogId" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "role" "DogMembershipRole" NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "createdByUserId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DogInvite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Breed" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Breed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" UUID NOT NULL,
    "dogId" UUID NOT NULL,
    "authorUserId" UUID NOT NULL,
    "caption" TEXT,
    "visibility" "PostVisibility" NOT NULL DEFAULT 'public',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" UUID NOT NULL,
    "postId" UUID NOT NULL,
    "dogId" UUID NOT NULL,
    "uploadedByUserId" UUID NOT NULL,
    "storageBucket" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostLike" (
    "id" UUID NOT NULL,
    "postId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DogFavorite" (
    "id" UUID NOT NULL,
    "dogId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DogFavorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactInterest" (
    "id" UUID NOT NULL,
    "dogId" UUID NOT NULL,
    "fromUserId" UUID NOT NULL,
    "message" TEXT,
    "status" "ContactInterestStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactInterest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" UUID NOT NULL,
    "eventType" "AnalyticsEventType" NOT NULL,
    "userId" UUID,
    "dogId" UUID,
    "postId" UUID,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_supabaseAuthId_key" ON "User"("supabaseAuthId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Dog_slug_key" ON "Dog"("slug");

-- CreateIndex
CREATE INDEX "Dog_breedId_idx" ON "Dog"("breedId");

-- CreateIndex
CREATE INDEX "Dog_city_state_idx" ON "Dog"("city", "state");

-- CreateIndex
CREATE INDEX "DogMembership_userId_idx" ON "DogMembership"("userId");

-- CreateIndex
CREATE INDEX "DogMembership_dogId_status_idx" ON "DogMembership"("dogId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "DogMembership_dogId_userId_key" ON "DogMembership"("dogId", "userId");

-- CreateIndex
CREATE INDEX "DogInvite_dogId_idx" ON "DogInvite"("dogId");

-- CreateIndex
CREATE INDEX "DogInvite_email_idx" ON "DogInvite"("email");

-- CreateIndex
CREATE INDEX "DogInvite_expiresAt_idx" ON "DogInvite"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "DogInvite_tokenHash_key" ON "DogInvite"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "Breed_slug_key" ON "Breed"("slug");

-- CreateIndex
CREATE INDEX "Post_dogId_idx" ON "Post"("dogId");

-- CreateIndex
CREATE INDEX "Post_authorUserId_idx" ON "Post"("authorUserId");

-- CreateIndex
CREATE INDEX "Post_visibility_publishedAt_idx" ON "Post"("visibility", "publishedAt");

-- CreateIndex
CREATE INDEX "Post_deletedAt_idx" ON "Post"("deletedAt");

-- CreateIndex
CREATE INDEX "Media_postId_idx" ON "Media"("postId");

-- CreateIndex
CREATE INDEX "Media_dogId_idx" ON "Media"("dogId");

-- CreateIndex
CREATE UNIQUE INDEX "Media_storageBucket_storageKey_key" ON "Media"("storageBucket", "storageKey");

-- CreateIndex
CREATE INDEX "PostLike_userId_idx" ON "PostLike"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PostLike_postId_userId_key" ON "PostLike"("postId", "userId");

-- CreateIndex
CREATE INDEX "DogFavorite_userId_idx" ON "DogFavorite"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DogFavorite_dogId_userId_key" ON "DogFavorite"("dogId", "userId");

-- CreateIndex
CREATE INDEX "ContactInterest_dogId_status_idx" ON "ContactInterest"("dogId", "status");

-- CreateIndex
CREATE INDEX "ContactInterest_fromUserId_idx" ON "ContactInterest"("fromUserId");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_eventType_createdAt_idx" ON "AnalyticsEvent"("eventType", "createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_userId_idx" ON "AnalyticsEvent"("userId");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_dogId_idx" ON "AnalyticsEvent"("dogId");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_postId_idx" ON "AnalyticsEvent"("postId");

-- AddForeignKey
ALTER TABLE "Dog" ADD CONSTRAINT "Dog_breedId_fkey" FOREIGN KEY ("breedId") REFERENCES "Breed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DogMembership" ADD CONSTRAINT "DogMembership_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "Dog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DogMembership" ADD CONSTRAINT "DogMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DogMembership" ADD CONSTRAINT "DogMembership_invitedByUserId_fkey" FOREIGN KEY ("invitedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DogInvite" ADD CONSTRAINT "DogInvite_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "Dog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DogInvite" ADD CONSTRAINT "DogInvite_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "Dog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "Dog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_uploadedByUserId_fkey" FOREIGN KEY ("uploadedByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostLike" ADD CONSTRAINT "PostLike_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostLike" ADD CONSTRAINT "PostLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DogFavorite" ADD CONSTRAINT "DogFavorite_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "Dog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DogFavorite" ADD CONSTRAINT "DogFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactInterest" ADD CONSTRAINT "ContactInterest_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "Dog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactInterest" ADD CONSTRAINT "ContactInterest_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyticsEvent" ADD CONSTRAINT "AnalyticsEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyticsEvent" ADD CONSTRAINT "AnalyticsEvent_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "Dog"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyticsEvent" ADD CONSTRAINT "AnalyticsEvent_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
