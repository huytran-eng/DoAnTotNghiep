export const sortSubmissionsByDateDescending = (submissions) => {
  return submissions.sort((a, b) => {
    return new Date(b.submitDate) - new Date(a.submitDate);
  });
};
