export const getOtherLanguages = (languages) =>{
  const formatedArrayOfLanguages = (languages.split(',')).map((str) =>
     str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  );
    return formatedArrayOfLanguages
}


export const getAddress = (userEdit,value) =>{
 
  const {info:{currentAddress}}=userEdit
  return currentAddress&&currentAddress[value]&&currentAddress[value]

}

export const deleteEmptyKeys =(obj) =>{
    
    return Object.keys(obj).reduce((acc, key) => {
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        const nestedObject = deleteEmptyKeys(obj[key]);
        if (Object.keys(nestedObject).length !== 0) {
          acc[key] = nestedObject;
        }
      } else if (obj[key] !== null && obj[key] !== '' && obj[key] !== undefined) {
        acc[key] = obj[key];
      }
      return acc;
    }, {});
}
