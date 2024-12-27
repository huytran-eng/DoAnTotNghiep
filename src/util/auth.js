export const IsAuthenticated = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return null; // No token, so not authenticated
  }

  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo || !userInfo.position) {
      return null; // User info is missing, so not authenticated
    }

    const userRole = userInfo.position;
    const payload = JSON.parse(atob(token.split(".")[1])); // Decode the JWT

    if (!payload.exp) {
      return null; // If token doesn't have an expiration field, treat it as invalid
    }

    const isExpired = payload.exp * 1000 < Date.now(); // Compare expiration date

    if (isExpired) {
      return null; // Token is expired, not authenticated
    }

    return userRole; // Valid token and not expired, return the user's role
  } catch (error) {
    console.error("Error during authentication check:", error);
    return null; // If any error occurs (malformed token, missing fields), return null
  }
};
