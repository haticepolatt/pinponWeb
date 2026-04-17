import { useEffect, useState } from "react";

export const useAsync = (factory, deps = []) => {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    let active = true;
    setState((prev) => ({ ...prev, loading: true, error: null }));
    factory()
      .then((data) => {
        if (active) setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (active) setState({ data: null, loading: false, error: error.message });
      });
    return () => {
      active = false;
    };
  }, deps);

  return state;
};
