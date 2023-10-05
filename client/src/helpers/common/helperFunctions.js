export const getOtherLanguages = (languages) =>{
 console.log(languages)
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