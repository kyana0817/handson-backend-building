const PREFIX = 'HANDSON_BACKEND_BUILDING_'

const storage = {
  store: (token) => {
    localStorage.setItem(`${PREFIX}TOKEN`, token.accessToken);
    localStorage.setItem(`${PREFIX}REFRESH`, token.refreshToken);
  },
  getToken: () => localStorage.getItem(`${PREFIX}TOKEN`),
  getRefresh: () => localStorage.getItem(`${PREFIX}REFRESH`),
  clear: () => {
    localStorage.removeItem(`${PREFIX}TOKEN`);
    localStorage.removeItem(`${PREFIX}REFRESH`);
  }
};

export default storage;
