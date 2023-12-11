import { interpolate } from "flubber";
import { useTransform } from "framer-motion";
import { useMemo } from "react";

export const getIndex = (_, index) => index;

const memoInterpolate = (a, b) => {
    const cache = {};
    return ((a, b) => {
        if (cache[`${a}+${b}`]) {
            console.log('using cache');
            return cache[`${a}+${b}`];
        } else {
            cache[`${a}+${b}`] = interpolate(a, b);
            return cache[`${a}+${b}`];
        }
    })(a, b);
}

export function useFlubber(progress, paths) {
  return useTransform(progress, paths.map(getIndex), paths, {
    mixer: (a, b) => memoInterpolate(a, b)
  });
}