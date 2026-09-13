type SessionExpiredListener = () => void;

const listeners = new Set<SessionExpiredListener>();

export const sessionEvents = {
  subscribe(listener: SessionExpiredListener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  emitSessionExpired() {
    listeners.forEach((listener) => listener());
  },
};