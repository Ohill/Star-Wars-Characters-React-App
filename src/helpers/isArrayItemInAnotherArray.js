const isArrayItemInAnotherArray = (arrayToFilter, arrayToCompare) => (
    arrayToFilter.map((item) => arrayToCompare.includes(item)).find((item) => item)
);

export default isArrayItemInAnotherArray;
