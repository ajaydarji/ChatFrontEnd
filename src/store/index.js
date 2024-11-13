// store/index.js
import { create } from "zustand";
import { createAuthslice } from "./slice/auth-slice";
import { createChatSlice } from "./slice/chat-slice";

export const userAppStore = create((...a) => ({
  ...createAuthslice(...a),
  ...createChatSlice(...a),
}));
