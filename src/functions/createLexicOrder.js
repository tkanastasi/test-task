export function createLexicOrder(comp1, comp2) {
  return (a, b) => {
    let v = comp1(a, b);
    return v === 0 ? comp2(a, b) : v;
  };
}
