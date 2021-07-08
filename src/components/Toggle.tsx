import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import Switch from "react-switch";

import '../styles/toggle.scss';

export function Toggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="toggle">
      <Switch
        onChange={toggleTheme}
        checked={theme === "dark"}
        checkedIcon={false}
        height={15}
        width={50}
        onColor={"#835afd"}
        offColor={"#141414"}
        checkedHandleIcon={<div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            fontSize: 22,
            marginTop: -1,
            marginLeft: 3,
          }}
        >
          ☀️
        </div>}
        uncheckedHandleIcon={<div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            fontSize: 20,
            marginTop: -1.1,
            marginLeft: 1,
          }}
        >
          🌕
        </div>}
      />
    </div>
  );
}