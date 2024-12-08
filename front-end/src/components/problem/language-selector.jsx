/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { NativeSelect } from "@mui/material";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {baseUrl} from "../../util/constant";

const LanguageSelector = (props) => {
  const { setLanguage, setLanguageId } = props;
  const { id } = useParams();
  const [languages, setLanguages] = useState([]); // Initialize languages as an empty array
  const [loading, setLoading] = useState(true); // To track loading state
  const token = localStorage.getItem("token"); // Retrieve JWT token

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get(
          baseUrl+`class/${id}/languages`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data) {
          setLanguages(response.data);
          setLanguageId(response.data[0].id)
        }
      } catch (error) {
        console.error("Error fetching languages:", error);
      } finally {
        setLoading(false); // Set loading to false after the data is fetched
      }
    };

    fetchLanguages();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading message while fetching data
  }

  const handleLanguageChange = (e) => {
    const selectedLanguageId = e.target.value;

    // You can add any additional logic here if needed
    console.log("Selected language ID:", selectedLanguageId);

    // Update the state with the selected language's id
    const selectedLanguage = languages.find(
      (value) => value.id === selectedLanguageId
    );
    console.log(selectedLanguage);
    setLanguage(selectedLanguage.name); // Get the name from the filtered result
    setLanguageId(selectedLanguageId);
  };

  return (
    <NativeSelect
      defaultValue={"java"} // Set default value
      inputProps={{
        name: "language",
        id: "uncontrolled-native",
      }}
      disableUnderline
      onChange={(e) => handleLanguageChange(e)} // Update the selected language
    >
      {languages && languages.length > 0 ? (
        languages.map((language) => (
          <option key={language.id} value={language.id}>
            {language.name}      
          </option>
        ))
      ) : (
        <option value="">No languages available</option> // Show message if no languages available
      )}
    </NativeSelect>
  );
};

export default LanguageSelector;
