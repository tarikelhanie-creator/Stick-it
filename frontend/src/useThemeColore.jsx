import { useState } from 'react';

export default function useThemeColors() {

    const getLightColor = () => {
  const r = Math.floor(Math.random() * 106) + 150;
  const g = Math.floor(Math.random() * 106) + 150;
  const b = Math.floor(Math.random() * 106) + 150;
  return `rgb(${r}, ${g}, ${b})`;
};

const getDarkerColor = () => {
  const r = Math.floor(Math.random() * 56) + 120;
  const g = Math.floor(Math.random() * 56) + 120;
  const b = Math.floor(Math.random() * 56) + 120;
  return `rgb(${r}, ${g}, ${b})`;
};

  const [backgroundclr, setbackgrclr] = useState(getLightColor());
  const [darkbackgroundclr, setdarkbackgrclr] = useState(getDarkerColor());

  return { backgroundclr, setbackgrclr, darkbackgroundclr, setdarkbackgrclr };
};