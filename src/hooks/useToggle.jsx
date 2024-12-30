import { useState } from "react";

export default function useToggle() {
  const [toggle, setToggle] = useState(true);
  const changeToggle = () => {
    setToggle(!toggle);
  };
  return { toggle, changeToggle };
}
