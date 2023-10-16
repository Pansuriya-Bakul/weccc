export const getOtherLanguages = (languages) =>{
  const formatedArrayOfLanguages = (languages.split(',')).map((str) =>
     str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  );
    return formatedArrayOfLanguages
}


export const getAddress = (userEdit,value) =>{
  return userEdit.info?
                userEdit.info.currentAddress ?
                  `userEdit.info.currentAddress.${value}`?
                    `userEdit.info.currentAddress.${value}`
  :'' :'':''
}

export const deleteEmptyKeys =(obj) =>{
    
    const result = Object.keys(obj).reduce((acc, key) => {
      // Check if the value associated with the key is an empty object
      if (Object.keys(obj[key]).length === 0) {
        // Key is an empty object, so skip it (don't include it in the result)
        return acc;
      } else {
        // Key is not an empty object, include it in the result
        acc[key] = obj[key];
        return acc;
      }
    }, {});

  return result
}