/* eslint-disable react/prop-types */
import { NativeSelect } from "@mui/material";

const LanguageSelector = (props) => {
  const {setLanguage}  = props

  return (
    <NativeSelect
      defaultValue={"java"}
      inputProps={{
        name: "age",
        id: "uncontrolled-native",
      }}
      disableUnderline
      onChange={(e) => setLanguage(e.target.value)}
    >
      <option value={"java"}>Java</option>
      <option value={"python"}>Python</option>
      <option value={"cpp"}>C++</option>
    </NativeSelect>
  );
};

export default LanguageSelector;
