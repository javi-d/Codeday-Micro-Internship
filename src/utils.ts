import { useState, useEffect, useCallback } from "react";
import { GraphQLClient } from "graphql-request";
import { useTheme } from "@chakra-ui/react";
import {
  Options,
  useToasts as useToastsNative,
} from "react-toast-notifications";

export { useClipboard, useDisclosure } from "@chakra-ui/react";
// @ts-ignore
export { useFathom as useAnalytics } from "fathom-react";
export { useTheme };

export function useSsr() {
  const [isSsr, setIsSsr] = useState(true);
  useEffect(() => setIsSsr(typeof window === "undefined"), [typeof window]);
  return isSsr;
}

export const api = "https://graph.codeday.org/";
export const apiFetch = (query: any, variables: any, headers: any) => {
  const client = new GraphQLClient(api, { headers });
  return client.request(query, variables);
};

export function useToasts() {
  const { addToast, ...builtins } = useToastsNative();
  return {
    addToast,
    info: (children: React.ReactNode, opts?: Options | undefined) =>
      addToast(children, { appearance: "info", ...opts }),
    success: (children: React.ReactNode, opts?: Options | undefined) =>
      addToast(children, { appearance: "success", ...opts }),
    warning: (children: React.ReactNode, opts?: Options | undefined) =>
      addToast(children, { appearance: "warning", ...opts }),
    error: (children: React.ReactNode, opts?: Options | undefined) =>
      addToast(children, { appearance: "error", ...opts }),
    ...builtins,
  };
}

export function useString(key: string | number, initialValue: any) {
  const { strings } = useTheme();
  return strings[key] || initialValue;
}

export function useLocalStorage(key: string, initialValue: any) {
  const [hasValue, setHasValue] = useState(false);
  const [value, setValue] = useState(() =>
    typeof window !== "undefined"
      ? // eslint-disable-next-line no-undef
        JSON.parse(window.localStorage.getItem(key) as string) || initialValue
      : initialValue
  );

  const handleStorageUpdate = useCallback(
    (event) => {
      if (event.key === key && event.newValue !== value) {
        setValue(JSON.parse(event.newValue) || initialValue);
      }
    },
    [value]
  );

  const setItem = (newValue: any) => {
    setValue(newValue);
    if (typeof window !== "undefined") {
      // eslint-disable-next-line no-undef
      window.localStorage.setItem(key, JSON.stringify(newValue));
    } else {
      setHasValue(true);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      // If the SSR set the state, update localStorage during hydration.
      if (hasValue) {
        setItem(value);

        // Now that we're hydrated, re-set the value to the actual value from localStorage
      } else {
        // eslint-disable-next-line no-undef
        const newValue = window.localStorage.getItem(key);
        if (value !== newValue) {
          setValue(newValue || initialValue);
        }
      }
    }
  }, [typeof window]);

  // Register the onUpdate handler
  useEffect(() => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line no-undef
      window.addEventListener("storage", handleStorageUpdate);
    }
    return () => {
      if (typeof window !== "undefined") {
        // eslint-disable-next-line no-undef
        window.removeEventListener("storage", handleStorageUpdate);
      }
    };
  }, [handleStorageUpdate, typeof window]);

  return [value, setItem];
}