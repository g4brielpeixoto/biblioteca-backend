import * as yup from 'yup';

export const BookValidator = yup.object({
  title: yup.string().required().trim(),
  author: yup.string().required().trim(),
  description: yup.string().required().trim(),
  publicationYear: yup.number().max(new Date().getFullYear()).required(),
  copies: yup.number().required(),
  availableCopies: yup.number().notRequired(),
  categoryId: yup.number().required()
});
