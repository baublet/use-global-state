import { useEffect, useState } from "react";

type DispatcherFunctionType = (value: any) => void;
type DispatcherType = null | DispatcherFunctionType;
export interface KeysNodeType {
  value: any;
  dispatchers: Array<DispatcherType>;
  [key: string]: string | Array<DispatcherType>;
}
interface KeysType {
  [key: string]: KeysNodeType;
}
type UseGlobalStateReturnType = [any, DispatcherFunctionType];

const keys: KeysType = {},
  setFn = (key: string) => {
    return (value: any) => {
      keys[key].value = value;
      keys[key].dispatchers.forEach(
        (dispatcher: DispatcherType) => dispatcher && dispatcher(value)
      );
    };
  };

// This resets the dispatchers arrays on keys that all null, indicating
// that the components that use this global state have been all unmounted
// We don't want to leave around a bunch of arrays that are just stuffed
// full of null values in so doing.
function resetEmptyKeys(): void {
  Object.keys(keys).forEach((key: string) => {
    let allNull: boolean = true;
    keys[key].dispatchers.forEach((dispatcher: DispatcherType) => {
      if (!allNull) return;
      if (dispatcher !== null) {
        allNull = false;
      }
    });
    if (allNull) {
      keys[key].dispatchers = [];
    }
  });
}

export function useGlobalState(
  key: string,
  initialState: any = ""
): UseGlobalStateReturnType {
  // Some basic cleaning
  resetEmptyKeys();

  const [state, dispatcher] = useState(initialState);
  useEffect(() => {
    if (!keys[key]) {
      keys[key] = {
        value: initialState,
        dispatchers: []
      };
    }
    const index: number = keys[key].dispatchers.push(dispatcher) - 1;
    return () => {
      keys[key].dispatchers[index] = null;
    };
  }, []);
  const value: any = keys[key] && keys[key].value ? keys[key].value : state;
  return [value, setFn(key)];
}
