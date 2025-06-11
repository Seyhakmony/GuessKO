export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const clearUserSession = () => {
  localStorage.removeItem('currentUser');
};

export const isUserLoggedIn = () => {
  return getCurrentUser() !== null;
};


export const setUserSession = (user) => {
  try {
    localStorage.setItem('currentUser', JSON.stringify(user));
    return true;
  } catch (error) {
    console.error('Error setting user session:', error);
    return false;
  }
};