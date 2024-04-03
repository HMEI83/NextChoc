import React, { useState, useEffect } from 'react';
import { store } from '../rtk/store';
import i18n from '../Language';
 
const useLanguageUpdate = (funcWhenUpdate, listenParamArr = []) => {
  const [currentLanguageCode, setCurrentLanguageCode] = useState(i18n.locale);
 
  useEffect(() => {
    return store.subscribe(() => {
      const { language } = store.getState();
 
      if (language && language != currentLanguageCode) {
        setCurrentLanguageCode(language);
        if (funcWhenUpdate) funcWhenUpdate();
      }
    });
  }, [currentLanguageCode, ...listenParamArr]);
 
  return currentLanguageCode;
};
 
export default useLanguageUpdate;