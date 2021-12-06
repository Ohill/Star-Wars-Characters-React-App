const getYearAndStandard = (str) => (
    [parseFloat(str.substr(0, str.length - 3)), str.substr(-3)]
);

export default getYearAndStandard;
