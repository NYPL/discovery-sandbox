import { isEmpty as _isEmpty } from "underscore";

export const fetchFromLocal = (key) => {
  // Return an empty object to avoid
  // asking for props from null or undefined;
  const initial = {};

  if (typeof window === "undefined") {
    return initial;
  }

  const item = window.localStorage.getItem(key);
  return !_isEmpty(item) ? JSON.parse(item) : initial;
};

export const minSinceMil = (mills) => {
  return Math.floor((Date.now() - mills) / 60000);
};
