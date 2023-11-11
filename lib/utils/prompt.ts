export const promptHasNumeratedList = (text: string) => {
  return text.match(/^[0-9]+\. /);
};

export const promptHasBulletList = (text: string) => {
  return text.match(/^[-*] /);
};

export const getPromptStopSequence = (text: string) => {
  const numeratedList = promptHasNumeratedList(text);
  const bulletList = promptHasBulletList(text);

  if (numeratedList) {
    // return last number of the list
    const numbers = text.match(/[0-9]+/g);
    return numbers ? numbers[numbers.length - 1] : null;
  }

  if (bulletList) {
    return bulletList[0];
  }

  return '';
};
