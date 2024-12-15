export const sortSubmissionsByDateDescending = (submissions) => {
  return submissions.sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  });
};
