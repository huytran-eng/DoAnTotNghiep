export const IsAuthenticated = () => {
    const token = localStorage.getItem("token");
    // Optional: Validate the token format or expiration date (if JWT)
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        return !isExpired;
      } catch {
        return false;
      }
    }
    return false;
  };
  