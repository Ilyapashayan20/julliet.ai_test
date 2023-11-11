function getCaretCoordinates() {
  let x = 0,
    y = 0;
  const isSupported = typeof window.getSelection !== 'undefined';
  if (isSupported) {
    const selection = window.getSelection();
    // Check if there is a selection (i.e. cursor in place)
    if (selection.rangeCount !== 0) {
      // Clone the range
      const range = selection.getRangeAt(0).cloneRange();
      // Collapse the range to the start, so there are not multiple chars selected
      range.collapse(true);
      // getCientRects returns all the positioning information we need
      const rect = range.getClientRects()[0];
      if (rect) {
        x = rect.left; // since the caret is only 1px wide, left == right
        y = rect.top; // top edge of the caret
      }
    }
  }
  return { left: x, top: y };
}

function getCaretIndex(element) {
  let position = 0;
  const isSupported = typeof window.getSelection !== 'undefined';
  if (isSupported) {
    const selection = window.getSelection();
    // Check if there is a selection (i.e. cursor in place)
    if (selection.rangeCount !== 0) {
      // Store the original range
      const range = window.getSelection().getRangeAt(0);
      // Clone the range
      const preCaretRange = range.cloneRange();
      // Select all textual contents from the contenteditable element
      preCaretRange.selectNodeContents(element);
      // And set the range end to the original clicked position
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      // Return the text length from contenteditable start to the range end
      position = preCaretRange.toString().length;
    }
  }
  return position;
}

function getElementCoordinatesBySelector(selector) {
  const element = document.querySelector(selector);
  const rect = element.getBoundingClientRect();
  return { x: rect.left, y: rect.top };
}

export { getCaretCoordinates, getCaretIndex, getElementCoordinatesBySelector };
