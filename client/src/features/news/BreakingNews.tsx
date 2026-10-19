import { Box, Typography } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { useTranslation } from "react-i18next";
import { newsStories } from "./newsData";
import talkTantraLogo from "../../assets/images/talk-tantra-logo.png";
import "./BreakingNews.css";

export default function BreakingNews() {
  const { i18n, t } = useTranslation();

  const language = i18n.resolvedLanguage?.startsWith("hi") ? "hi" : "en";

  return (
    <Box
      component="section"
      className="breaking-news"
      aria-label={t("news.breaking", {
        defaultValue: "Breaking News",
      })}
    >
      <Box className="breaking-news__label">
        <FiberManualRecordIcon className="breaking-news__label-icon" />
        <Typography component="span" className="breaking-news__label-text">
          {t("news.breaking", {
            defaultValue: "Breaking News",
          })}
        </Typography>
      </Box>

      <Box className="breaking-news__viewport">
        {newsStories.length > 0 ? (
          <Box className="breaking-news__track">
            {[0, 1].map((copy) => (
              <Box
                className="breaking-news__group"
                key={copy}
                aria-hidden={copy === 1}
              >
                {newsStories.map((story) => (
                  <button
                    type="button"
                    className="breaking-news__item"
                    key={`${copy}-${story.slug}`}
                    tabIndex={copy === 1 ? -1 : 0}
                    onClick={() => {
                      console.log("Selected news story:", story.slug);
                    }}
                    aria-label={story.title[language]}
                  >
                    <img
                      src={talkTantraLogo}
                      alt=""
                      className="breaking-news__logo"
                    />

                    <span className="breaking-news__headline">
                      {story.title[language]}
                    </span>
                  </button>
                ))}
              </Box>
            ))}
          </Box>
        ) : (
          <Typography className="breaking-news__fallback">
            {t("news.noResults", {
              defaultValue: "No news available",
            })}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
