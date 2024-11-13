// slice/auth-slice.js
export const createAuthslice = (set) => ({
  userInfo: null,
  setuserInfo: (userInfo) => set({ userInfo }),
});
