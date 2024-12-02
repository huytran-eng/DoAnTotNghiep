export const getDifficulty = (difficulty) => {
  if (difficulty === 1) {
    return "Dễ";
  }
  if (difficulty === 2) {
    return "Trung bình";
  }
  return "Khó";
};
