import { useEffect } from "react";
import { EventEmitter } from "../utils/eventEmitter";

export const useGlobalUpdate = (callback) => {
  useEffect(() => {
    const unsubscribe = EventEmitter.subscribe(callback);
    return () => unsubscribe();
  }, [callback]);
};
