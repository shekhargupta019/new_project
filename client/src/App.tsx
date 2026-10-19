import { Box, Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./components/layout/LanguageSwitcher";
import talkTantraLogo from "./assets/images/talk-tantra-logo.png";
import "./App.css";

const navigationKeys = [
  "home",
  "india",
  "uttarPradesh",
  "politics",
  "business",
  "world",
  "sports",
  "entertainment",
  "technology",
] as const;

export default function App() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;

  return (
    <Box className="app" lang={language}>
      <header className="site-header">
        <Container maxWidth="lg" className="header-inner">
          <Box className="brand">
            <img
              className="brand-logo"
              src={talkTantraLogo}
              alt="Talk Tantra India logo"
            />

            <Box className="brand-copy">
              <Typography variant="h4" component="div" className="brand-name">
                {t("brand.name")}
              </Typography>
              <Typography className="brand-tagline">
                {t("brand.tagline")}
              </Typography>
            </Box>
          </Box>

          <LanguageSwitcher />
        </Container>
      </header>

      <nav className="site-navigation" aria-label="Main navigation">
        <Container maxWidth="lg" className="navigation-inner">
          {navigationKeys.map((key) => (
            <span
              key={key}
              className={`navigation-item ${key === "home" ? "active" : ""}`}
            >
              {t(`navigation.${key}`)}
            </span>
          ))}
        </Container>
      </nav>

      <main>
        <Container maxWidth="lg" className="home-content">
          <div className="breaking-news">
            <span className="breaking-label">{t("news.breaking")}</span>
            <span>{t("news.topStories")}</span>
          </div>

          <Typography variant="h4" component="h1" className="section-title">
            {t("news.topStories")}
          </Typography>

          <section className="featured-story">
            <span className="story-category">{t("navigation.india")}</span>
            <Typography variant="h3" component="h2">
              {t("brand.tagline")}
            </Typography>
            <Typography color="text.secondary">
              {t("news.featuredStory")}
            </Typography>
          </section>

          <Typography variant="h5" component="h2" className="section-title">
            {t("news.latestNews")}
          </Typography>

          <section className="news-grid">
            {["india", "uttarPradesh", "politics"].map((key) => (
              <article className="news-card" key={key}>
                <div className="news-card-image" aria-hidden="true" />
                <Typography className="story-category">
                  {t(`navigation.${key}`)}
                </Typography>
                <Typography variant="h6">
                  {t("news.latestNews")} — {t(`navigation.${key}`)}
                </Typography>
                <Typography color="text.secondary">
                  {t("news.featuredStory")}
                </Typography>
              </article>
            ))}
          </section>
        </Container>
      </main>
    </Box>
  );
}
