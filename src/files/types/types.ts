import { Prisma } from '@prisma/client';

const filesWithTagsAndProvidersValidator = Prisma.validator<Prisma.filesArgs>()(
  {
    include: {
      fileTags: { include: { tags: true } },
      providers: { select: { name: true } },
    },
  },
);

export type filesWithTagsAndProviders = Prisma.filesGetPayload<
  typeof filesWithTagsAndProvidersValidator
>;
