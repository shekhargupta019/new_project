import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useTranslation } from "react-i18next";
import "./LanguageSwitcher.css";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.resolvedLanguage ?? i18n.language;

  const handleLanguageChange = (
    _event: React.MouseEvent<HTMLElement>,
    language: string | null,
  ) => {
    if (language && language !== currentLanguage) {
      void i18n.changeLanguage(language);
    }
  };

  return (
    <ToggleButtonGroup
      value={currentLanguage}
      exclusive
      size="small"
      onChange={handleLanguageChange}
      aria-label="Select website language"
      className="language-switcher"
    >
      <ToggleButton value="en" aria-label="English">
        EN
      </ToggleButton>
      <ToggleButton value="hi" aria-label="Hindi">
        हिन्दी
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
