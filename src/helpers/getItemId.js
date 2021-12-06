const getItemId = (str) => {
    const splitStr = str.split('/');
    return parseInt(splitStr[splitStr.length - 2]);
};

export default getItemId;
