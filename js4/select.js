const initialState = {
  selecting: false,
  x: 0,
  y: 0,
  x2: 0,
  y2: 0,
};
let state = initialState;
const createBoxNode = () => {
  const box = document.createElement('div');
  box.classList.add('select-box');
  return box;
};
const n = 5;
const boxes = new Array(n).fill(null).map((v, i, a) => a.map(createBoxNode));
document.querySelector('.selectable').append(
  ...boxes.map((row) => {
    const rowDiv = document.createElement('div');
    rowDiv.append(...row);
    return rowDiv;
  })
);
const detectCollision = (cord1, cord2) => {
  const xCollision =
    cord1.x <= cord2.x
      ? cord1.x + cord1.width >= cord2.x
      : cord2.x + cord2.width >= cord1.x;
  const yCollision =
    cord1.y <= cord2.y
      ? cord1.y + cord1.height >= cord2.y
      : cord2.y + cord2.height >= cord1.y;
  return xCollision && yCollision;
};
const selector = document.querySelector('.selector');
const render = (state) => {
  if (state.selecting) {
    selector.style.visibility = 'visible';
    selector.style.top = Math.min(state.y, state.y2) + 'px';
    selector.style.left = Math.min(state.x, state.x2) + 'px';
    selector.style.width = Math.abs(state.x - state.x2) + 'px';
    selector.style.height = Math.abs(state.y - state.y2) + 'px';
    const selectorCords = selector.getBoundingClientRect();
    boxes.map((row) =>
      row.map((box) => {
        detectCollision(selectorCords, box.getBoundingClientRect())
          ? box.classList.add('selected')
          : box.classList.remove('selected');
      })
    );
  } else {
    selector.style.visibility = 'hidden';
  }
};
document.addEventListener('mousedown', (e) => {
  // Only work on left click
  if (e.button !== 0) return;
  state = {
    selecting: true,
    x: e.clientX,
    y: e.clientY,
    x2: e.clientX,
    y2: e.clientY,
  };
  render(state);
});
document.addEventListener('mouseup', () => {
  state = initialState;
  render(state);
});
document.addEventListener('mousemove', (e) => {
  if (!state.selecting) return;
  state.x2 = e.clientX;
  state.y2 = e.clientY;
  render(state);
});
