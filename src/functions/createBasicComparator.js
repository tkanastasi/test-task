export function createBasicComparator(order = 'asc') {
  if (order === 'asc') {
    return (a, b) => a > b ? 1 : a < b ? -1 : 0;
  } else if (order === 'desc') {
    return (a, b) => a > b ? -1 : a < b ? 1 : 0;
  }
}
