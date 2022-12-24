import { checkIfString } from './errorHandling.js';
import { useState, useEffect, useRef } from 'react';

/**
 * Removes all HTML and non-SQL characters from a string.
 * 
 * @param {string} string The string to check and remove from.
 * @returns A string able to be queried.
 */
export function stringToSQL (string) {
    checkIfString({ string });
    return string.replace(/<[^>]*>/g, "").replace(/'/g, "''");
}

/**
 * Removes all added characters a string returned from an SQL query.
 * 
 * @param {string} string The string to reformat.
 * @returns The string before its insertion to the database.
 */
export function stringFromSQL (string) {
    checkIfString({ string });
    return string.replace(/''/g, "'");
}

/**
 * Binary searches through an array of objects with 'id' properties for a specified 'id,' and by default
 * skips the first index. Returns an empty array if not found. O(log n) time complexity.
 * 
 * @param {Array} arr The array of objects with 'id' properties.
 * @param {Number} id The id property value sought for in the array.
 * @param {Number} skipFirst A number indicating the index to start the search in the array. Defaults to 0.
 * @returns An array containing the object with the 'id' value as first index and the index for 
 * the object in the array as second if found. Otherwise, returns an empty array.
 */
export function binarySearch(arr, id, skipTo = 0, arrPropPath = 'id') {

    const arrPath = arrPropPath.split('.');
    let low = skipTo, high = arr.length - 1;
    let mid = 0|(low + (high - low) / 2);
    let found = false;

    while (high >= low) {

        // Gets comparing arr value from arr using arrPropPath
        let arrVal, i;
        for (arrVal = arr, i = -1; i < arrPath.length; i++) {
            arrVal = (i === -1) ? arrVal[mid] : arrVal[arrPath[i]];
        }

        if (id > arrVal) { // Greater than mid
            low = mid + 1;
            mid = 0|(low + (high - low) / 2);
        } else if (id < arrVal) { // Less than mid
            high = mid - 1;
            mid = 0|(low + (high - low) / 2);
        } else { // Found
            found = true;
            high = low - 1;
        }
    }

    return (found) ? [arr[mid], mid] : [];
}

/** 
 * Binary inserts an object into an ordered array, with the ordering property defaulted to 'id': O(log n)
 * 
 * @return The array with the inserted value if successful. 
 */
export function binaryInsert (arr, obj, arrPropPath = 'v.id', objPropPath = 'id') {

    const arrPath = arrPropPath?.split('.'), objPath = objPropPath?.split('.');
    let objVal, i;

    // Checks comparing obj value using objPropPath
    for (objVal = obj, i = 0; i < objPath.length; i++) {
        objVal = objVal[objPath[i]];
        if (!obj) throw new TypeError('The object to insert must have a comparable property at the ' +
            "objPropPath, which defaults to 'id'.");
    }

    let high = arr.length - 1, low = 0, mid = 0|(high / 2);
    while (high >= low) {

        // Gets comparing arr value from arr using arrPropPath
        let arrVal;
        for (arrVal = arr, i = -1; i < arrPath.length; i++) {
            console.log(arrVal);
            arrVal = (i === -1) ? arrVal[mid] : arrVal[arrPath[i]];
        }

        if (arrVal > objVal) { // less than mid
            high = mid - 1;
            mid = 0|(low + (high - low) / 2);
        } else { // greater than mid
            low = mid + 1;
            mid = 0|(low + (high - low) / 2);
        }
    }

    arr.splice(Math.max(low, high), 0, { v: obj });
    return arr;
}

/**
 * Customizes the React useState() hook to only require properties to be updated in an object state as
 * the parameters in the returned seting state function. 
 * 
 * @param {*} initState The value to initialize the state to.
 * @returns An array with the state variable as the first index and a function for updating the state
 * as the second index.
 */
export const useUpdateState = (initState) => {
    const [ state, setState ] = useState(initState)
    
    const setMergeState = (value) => {
      setState((prevValue) => {
        const newValue = typeof value === 'function' ? value(prevValue) : value
        return newValue ? { ...prevValue, ...newValue } : prevValue
      })
    }
    
    return [ state, setMergeState ];
};

/**
 * A custom React hook that utilizes the useEffect return callback, but attaches a ref to the 
 * function to not have stale state values when the callback is invoked.
 * 
 * @param {function} callback A function to invoke when dependencies are unmounted.
 * @param {Array} dependecies The array for dependencies that trigger the hook, though not the 
 * only values that are not stale.
 */
export const useUnmount = (callback, dependecies = []) => {
    const callbackRef = useRef(callback);
    callbackRef.current = callback;
    
    useEffect(() => {
        return () => {
            callbackRef.current()
        }
    }, dependecies);
}