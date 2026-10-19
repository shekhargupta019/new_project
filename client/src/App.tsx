import { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { useTranslation } from "react-i18next";

import BreakingNews from "./features/news/BreakingNews";
import AdminNews from "./admin/AdminNews";
import talkTantraLogo from "./assets/images/talk-tantra-logo.png";

import "./App.css";

type NavigationItem = {
  key: string;
  translationKey: string;
};

const navigationItems: NavigationItem[] = [
  { key: "home", translationKey: "navigation.home" },
  { key: "india", translationKey: "navigation.india" },
  { key: "uttarPradesh", translationKey: "navigation.uttarPradesh" },
  { key: "politics", translationKey: "navigation.politics" },
  { key: "business", translationKey: "navigation.business" },
  { key: "world", translationKey: "navigation.world" },
  { key: "sports", translationKey: "navigation.sports" },
  { key: "entertainment", translationKey: "navigation.entertainment" },
  { key: "technology", translationKey: "navigation.technology" },
];

type Story = {
  id: number;
  category: string;
  title: string;
  description: string;
};

const stories: Story[] = [
  {
    id: 1,
    category: "india",
    title: "indiaStory",
    description: "indiaDescription",
  },
  {
    id: 2,
    category: "uttarPradesh",
    title: "upStory",
    description: "upDescription",
  },
  {
    id: 3,
    category: "politics",
    title: "politicsStory",
    description: "politicsDescription",
  },
  {
    id: 4,
    category: "business",
    title: "businessStory",
    description: "businessDescription",
  },
  {
    id: 5,
    category: "world",
    title: "worldStory",
    description: "worldDescription",
  },
  {
    id: 6,
    category: "technology",
    title: "technologyStory",
    description: "technologyDescription",
  },
];

function App() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNavigation, setActiveNavigation] = useState("home");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const changeLanguage = (language: "en" | "hi") => {
    void i18n.changeLanguage(language);
  };

  const pathname = window.location.pathname.replace(/\/+$/, "") || "/";

  // Keep the admin page separate from the public homepage.
  if (pathname === "/admin") {
    return <AdminNews />;
  }

  const filteredStories = stories.filter((story) => {
    const categoryName = t(`navigation.${story.category}`);
    const title = t(`storyTitles.${story.title}`);
    const term = searchTerm.trim().toLocaleLowerCase();

    const matchesSearch =
      !term ||
      categoryName.toLocaleLowerCase().includes(term) ||
      title.toLocaleLowerCase().includes(term);

    const matchesCategory =
      activeNavigation === "home" || story.category === activeNavigation;

    return matchesSearch && matchesCategory;
  });

  const visibleStories =
    activeNavigation === "home" && !searchTerm.trim()
      ? filteredStories
      : filteredStories;

  const featuredStory = visibleStories[0];

  const selectNavigation = (key: string) => {
    setActiveNavigation(key);
    setSearchTerm("");
    setSearchOpen(false);
    closeMobileMenu();
  };

  const renderLanguageButtons = () => (
    <Box className="language-switcher" aria-label="Select language">
      <Button
        className={`language-button ${
          i18n.resolvedLanguage === "en" ? "selected" : ""
        }`}
        onClick={() => changeLanguage("en")}
        aria-pressed={i18n.resolvedLanguage === "en"}
      >
        EN
      </Button>

      <Button
        className={`language-button ${
          i18n.resolvedLanguage === "hi" ? "selected" : ""
        }`}
        onClick={() => changeLanguage("hi")}
        aria-pressed={i18n.resolvedLanguage === "hi"}
      >
        हिन्दी
      </Button>
    </Box>
  );

  return (
    <Box className="app">
      <AppBar position="static" elevation={0} className="site-header">
        <Container maxWidth="xl">
          <Toolbar disableGutters className="header-inner">
            <Box className="brand">
              <img
                src={talkTantraLogo}
                alt="Talk Tantra India logo"
                className="brand-logo"
              />

              <Box className="brand-copy">
                <Typography component="h1" className="brand-name">
                  {t("brand.name")}
                </Typography>

                <Typography className="brand-tagline">
                  {t("brand.tagline")}
                </Typography>
              </Box>
            </Box>

            <Box className="header-actions">
              {!isMobile && renderLanguageButtons()}

              <IconButton
                className="search-toggle"
                aria-label={t("news.search")}
                onClick={() => setSearchOpen((previous) => !previous)}
                color="inherit"
              >
                <SearchIcon />
              </IconButton>

              {isMobile && (
                <IconButton
                  className="mobile-menu-button"
                  aria-label="Open navigation menu"
                  aria-expanded={mobileMenuOpen}
                  onClick={() => setMobileMenuOpen(true)}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>

          {isMobile && (
            <Box className="mobile-language-row">{renderLanguageButtons()}</Box>
          )}

          {searchOpen && (
            <Box className="search-panel">
              <input
                className="search-input"
                type="search"
                placeholder={t("news.search")}
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                aria-label={t("news.search")}
              />

              <IconButton
                aria-label="Close search"
                onClick={() => {
                  setSearchOpen(false);
                  setSearchTerm("");
                }}
                className="search-close-button"
              >
                <CloseIcon />
              </IconButton>
            </Box>
          )}
        </Container>
      </AppBar>

      {!isMobile && (
        <Box component="nav" className="site-navigation">
          <Container maxWidth="xl" className="navigation-inner">
            {navigationItems.map((item) => (
              <button
                type="button"
                key={item.key}
                className={`navigation-item ${
                  activeNavigation === item.key ? "active" : ""
                }`}
                onClick={() => selectNavigation(item.key)}
              >
                {t(item.translationKey)}
              </button>
            ))}
          </Container>
        </Box>
      )}

      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={closeMobileMenu}
        className="mobile-navigation-drawer"
        slotProps={{
          paper: {
            className: "mobile-drawer-paper",
          },
        }}
      >
        <Box className="mobile-drawer-content">
          <Box className="mobile-drawer-header">
            <Box className="mobile-drawer-brand">
              <img
                src={talkTantraLogo}
                alt="Talk Tantra India"
                className="mobile-drawer-logo"
              />

              <Box>
                <Typography className="mobile-drawer-title">
                  {t("brand.name")}
                </Typography>

                <Typography className="mobile-drawer-tagline">
                  {t("brand.tagline")}
                </Typography>
              </Box>
            </Box>

            <IconButton
              aria-label="Close navigation menu"
              onClick={closeMobileMenu}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider />

          <Typography className="drawer-section-label">
            {t("navigation.menu")}
          </Typography>

          <List className="mobile-drawer-list">
            {navigationItems.map((item) => (
              <ListItemButton
                key={item.key}
                selected={activeNavigation === item.key}
                onClick={() => selectNavigation(item.key)}
              >
                <ListItemText primary={t(item.translationKey)} />
              </ListItemButton>
            ))}
          </List>

          <Divider />

          <Typography className="drawer-section-label">
            {t("common.language")}
          </Typography>

          <Box className="drawer-language-buttons">
            {renderLanguageButtons()}
          </Box>
        </Box>
      </Drawer>

      <Box component="main" className="home-content">
        <Container maxWidth="xl">
          <BreakingNews />

          <Box className="section-heading">
            <Typography component="h2" className="section-title">
              {activeNavigation === "home"
                ? t("news.topStories")
                : t(
                    navigationItems.find(
                      (item) => item.key === activeNavigation,
                    )?.translationKey ?? "news.topStories",
                  )}
            </Typography>

            <Typography className="section-subtitle">
              {t("news.latestNews")}
            </Typography>
          </Box>

          {featuredStory ? (
            <Box component="section" className="featured-story">
              <Typography className="story-category">
                {t(`navigation.${featuredStory.category}`)}
              </Typography>

              <Typography component="h3" className="featured-title">
                {t(`storyTitles.${featuredStory.title}`)}
              </Typography>

              <Typography className="featured-description">
                {t(`storyDescriptions.${featuredStory.description}`)}
              </Typography>

              <Button className="read-more-button">{t("news.readMore")}</Button>
            </Box>
          ) : (
            <Box className="empty-state">
              <Typography>{t("news.noResults")}</Typography>
            </Box>
          )}

          <Box className="latest-section">
            <Box className="section-heading section-heading-row">
              <Typography component="h2" className="section-title">
                {t("news.latestNews")}
              </Typography>

              <Typography className="story-count">
                {visibleStories.length}
              </Typography>
            </Box>

            {visibleStories.length > 0 ? (
              <Box className="news-grid">
                {visibleStories.map((story) => (
                  <Box component="article" className="news-card" key={story.id}>
                    <Box
                      className={`news-card-image news-image-${story.category}`}
                      role="img"
                      aria-label={t(`navigation.${story.category}`)}
                    >
                      <Typography className="image-placeholder-label">
                        {t(`navigation.${story.category}`)}
                      </Typography>
                    </Box>

                    <Box className="news-card-content">
                      <Typography className="story-category">
                        {t(`navigation.${story.category}`)}
                      </Typography>

                      <Typography component="h3" className="news-card-title">
                        {t(`storyTitles.${story.title}`)}
                      </Typography>

                      <Typography className="news-card-description">
                        {t(`storyDescriptions.${story.description}`)}
                      </Typography>

                      <Button className="card-read-more">
                        {t("news.readMore")}
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box className="empty-state">
                <Typography>{t("news.noResults")}</Typography>
              </Box>
            )}
          </Box>
        </Container>
      </Box>

      <Box component="footer" className="site-footer">
        <Container maxWidth="xl">
          <Box className="footer-inner">
            <Box className="footer-brand">
              <img src={talkTantraLogo} alt="" className="footer-logo" />

              <Box>
                <Typography className="footer-brand-name">
                  {t("brand.name")}
                </Typography>

                <Typography className="footer-tagline">
                  {t("brand.tagline")}
                </Typography>
              </Box>
            </Box>

            <Typography className="footer-copyright">
              © {new Date().getFullYear()} Talk Tantra India
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default App;
