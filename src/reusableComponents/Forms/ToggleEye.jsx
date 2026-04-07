import { useState } from "react";

export const usePasswordToggle = () => {
  const [show, setShow] = useState(false);

  const toggle = () => setShow((prev) => !prev);

  return {
    show,
    toggle,
    type: show ? "text" : "password",
  };
};
