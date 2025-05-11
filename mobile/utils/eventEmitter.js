const listeners = new Set();

export const EventEmitter = {
  subscribe: (callback) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },
  emit: () => {
    listeners.forEach((cb) => cb());
  },
};
