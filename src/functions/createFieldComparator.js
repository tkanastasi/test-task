import { createBasicComparator } from './createBasicComparator';

export function createFieldComparator(fieldName, order = 'asc') {
  let base = createBasicComparator(order);
  return (a, b) => base(a[fieldName], b[fieldName]);
}