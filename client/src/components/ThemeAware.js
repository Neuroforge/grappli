import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeAware = ({ children, className = '', ...props }) => {
  const { getThemeClass } = useTheme();

  const themedClassName = getThemeClass(className);

  return (
    <div className={themedClassName} {...props}>
      {children}
    </div>
  );
};

export default ThemeAware;
