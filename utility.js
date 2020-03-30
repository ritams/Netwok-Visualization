function map(x, x1, x2, y1, y2) {
  let x_ = x2 - x1;
  let y_ = y2 - y1;
  let factor = y_ / x_;

  return (x - x1) * factor + y1;
}
