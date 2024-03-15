import * as yup from 'yup';

export const CategoryValidator = yup.object({
  name: yup.string().required()
});
