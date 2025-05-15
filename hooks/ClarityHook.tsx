import { useEffect } from "react";

declare global {
  interface Window {
    clarity?: (...args: any[]) => void;
  }
}

export const useClarity = () => {

};
