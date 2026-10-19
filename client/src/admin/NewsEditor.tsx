import { useEffect, useState, type FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  MenuItem,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { saveNewsArticle } from "../services/adminNewsService";
import type {
  NewsArticle,
  NewsArticleInput,
  NewsCategory,
  NewsStatus,
} from "../types/news";
import "./NewsEditor.css";

interface NewsEditorProps {
  article?: NewsArticle;
  onCancel: () => void;
  onSaved: (articles: NewsArticle[]) => void;
}

interface EditorForm {
  titleEn: string;
  descriptionEn: string;
  contentEn: string;
  titleHi: string;
  descriptionHi: string;
  contentHi: string;
  category: NewsCategory;
  author: string;
  imageUrl: string;
  status: NewsStatus;
  publishedAt: string;
}

interface FormErrors {
  titleEn?: string;
  descriptionEn?: string;
  titleHi?: string;
  descriptionHi?: string;
  author?: string;
  imageUrl?: string;
  publishedAt?: string;
}

const categories: NewsCategory[] = [
  "India",
  "Uttar Pradesh",
  "Politics",
  "Business",
  "World",
  "Sports",
  "Entertainment",
  "Technology",
];

const statuses: NewsStatus[] = ["DRAFT", "PUBLISHED", "SCHEDULED"];

const emptyForm: EditorForm = {
  titleEn: "",
  descriptionEn: "",
  contentEn: "",
  titleHi: "",
  descriptionHi: "",
  contentHi: "",
  category: "India",
  author: "",
  imageUrl: "",
  status: "DRAFT",
  publishedAt: "",
};

/**
 * Converts localized content into editable text.
 * Existing array entries are joined with blank lines so article paragraphs
 * remain readable and can be edited in a textarea.
 */
function toEditorText(value: string | string[] | undefined | null): string {
  if (Array.isArray(value)) {
    return value.join("\n\n");
  }

  return value ?? "";
}

/**
 * Converts the local publication date into the format expected by
 * an HTML datetime-local input.
 */
function toLocalDateTime(value: string | null | undefined): string {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60_000,
  );

  return localDate.toISOString().slice(0, 16);
}

function toEditorForm(article?: NewsArticle): EditorForm {
  if (!article) {
    return { ...emptyForm };
  }

  return {
    titleEn: toEditorText(article.title.en),
    descriptionEn: toEditorText(article.description.en),
    contentEn: toEditorText(article.content.en),
    titleHi: toEditorText(article.title.hi),
    descriptionHi: toEditorText(article.description.hi),
    contentHi: toEditorText(article.content.hi),
    category: article.category,
    author: article.author ?? "",
    imageUrl: article.imageUrl ?? "",
    status: article.status,
    publishedAt: toLocalDateTime(article.publishedAt),
  };
}

function toParagraphArray(value: string): string[] {
  return value
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function isValidImageUrl(value: string): boolean {
  if (!value.trim()) return true;

  try {
    const url = new URL(value);

    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function validateForm(form: EditorForm): FormErrors {
  const errors: FormErrors = {};

  if (!form.titleEn.trim()) {
    errors.titleEn = "Enter the English headline.";
  }

  if (!form.descriptionEn.trim()) {
    errors.descriptionEn = "Enter the English description.";
  }

  if (!form.titleHi.trim()) {
    errors.titleHi = "हिंदी शीर्षक दर्ज करें।";
  }

  if (!form.descriptionHi.trim()) {
    errors.descriptionHi = "हिंदी विवरण दर्ज करें।";
  }

  if (!form.author.trim()) {
    errors.author = "Enter the author name.";
  }

  if (form.imageUrl.trim() && !isValidImageUrl(form.imageUrl)) {
    errors.imageUrl = "Enter a valid HTTP or HTTPS image URL.";
  }

  if (form.status === "SCHEDULED") {
    if (!form.publishedAt) {
      errors.publishedAt = "Select a publication date and time.";
    } else {
      const selectedDate = new Date(form.publishedAt);

      if (Number.isNaN(selectedDate.getTime())) {
        errors.publishedAt = "Enter a valid publication date and time.";
      } else if (selectedDate.getTime() <= Date.now()) {
        errors.publishedAt = "Scheduled publication must be in the future.";
      }
    }
  }

  return errors;
}

export default function NewsEditor({
  article,
  onCancel,
  onSaved,
}: NewsEditorProps) {
  const [form, setForm] = useState<EditorForm>(() => toEditorForm(article));
  const [errors, setErrors] = useState<FormErrors>({});
  const [notice, setNotice] = useState("");
  const [saveError, setSaveError] = useState("");
  const [imageLoadFailed, setImageLoadFailed] = useState(false);
  const [saving, setSaving] = useState(false);

  const isEditing = Boolean(article);

  useEffect(() => {
    setForm(toEditorForm(article));
    setErrors({});
    setNotice("");
    setSaveError("");
    setImageLoadFailed(false);
  }, [article]);

  const updateField = <K extends keyof EditorForm>(
    field: K,
    value: EditorForm[K],
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => {
      if (!(field in previous)) return previous;

      const next = { ...previous };
      delete next[field as keyof FormErrors];

      return next;
    });

    if (field === "imageUrl") {
      setImageLoadFailed(false);
    }

    setSaveError("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateForm(form);
    setErrors(validationErrors);
    setSaveError("");

    if (Object.keys(validationErrors).length > 0) {
      setNotice("Please correct the highlighted fields.");
      return;
    }

    const input: NewsArticleInput = {
      title: {
        en: form.titleEn.trim(),
        hi: form.titleHi.trim(),
      },
      description: {
        en: form.descriptionEn.trim(),
        hi: form.descriptionHi.trim(),
      },
      content: {
        en: toParagraphArray(form.contentEn),
        hi: toParagraphArray(form.contentHi),
      },
      category: form.category,
      author: form.author.trim(),
      imageUrl: form.imageUrl.trim(),
      status: form.status,
      publishedAt:
        form.status === "SCHEDULED" && form.publishedAt
          ? new Date(form.publishedAt).toISOString()
          : null,
    };

    try {
      setSaving(true);

      const updatedArticles = saveNewsArticle(input, article?.id);

      onSaved(updatedArticles);
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "Unable to save the article. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box className="news-editor-page">
      <Container maxWidth="xl" className="news-editor-container">
        <Box className="news-editor-topbar">
          <Button
            className="news-editor-back"
            startIcon={<ArrowBackIcon />}
            onClick={onCancel}
            disabled={saving}
          >
            Back to news
          </Button>

          <Chip
            label={isEditing ? "Editing article" : "New article"}
            size="small"
            variant="outlined"
          />
        </Box>

        <Paper className="news-editor-card" elevation={0}>
          <Box className="news-editor-heading">
            <Typography component="h1" className="news-editor-title">
              {isEditing ? "Edit news article" : "Create news article"}
            </Typography>

            <Typography className="news-editor-subtitle">
              Add the article details in both languages.
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            className="news-editor-form"
          >
            <Box className="news-editor-languages">
              <Box
                component="section"
                className="news-editor-language news-editor-language--english"
              >
                <Typography
                  component="h2"
                  className="news-editor-language-title"
                >
                  English content
                </Typography>

                <TextField
                  label="Headline (English)"
                  required
                  fullWidth
                  value={form.titleEn}
                  onChange={(event) =>
                    updateField("titleEn", event.target.value)
                  }
                  error={Boolean(errors.titleEn)}
                  helperText={errors.titleEn}
                  slotProps={{ htmlInput: { maxLength: 180 } }}
                />

                <TextField
                  label="Description (English)"
                  required
                  fullWidth
                  multiline
                  minRows={3}
                  value={form.descriptionEn}
                  onChange={(event) =>
                    updateField("descriptionEn", event.target.value)
                  }
                  error={Boolean(errors.descriptionEn)}
                  helperText={errors.descriptionEn}
                  slotProps={{ htmlInput: { maxLength: 500 } }}
                />

                <TextField
                  label="Article content (English)"
                  fullWidth
                  multiline
                  minRows={8}
                  value={form.contentEn}
                  onChange={(event) =>
                    updateField("contentEn", event.target.value)
                  }
                  helperText="Separate paragraphs with a blank line."
                />
              </Box>

              <Box
                component="section"
                className="news-editor-language news-editor-language--hindi"
              >
                <Typography
                  component="h2"
                  className="news-editor-language-title"
                >
                  Hindi content
                </Typography>

                <TextField
                  label="शीर्षक (हिंदी)"
                  required
                  fullWidth
                  value={form.titleHi}
                  onChange={(event) =>
                    updateField("titleHi", event.target.value)
                  }
                  error={Boolean(errors.titleHi)}
                  helperText={errors.titleHi}
                  slotProps={{ htmlInput: { maxLength: 180 } }}
                />

                <TextField
                  label="विवरण (हिंदी)"
                  required
                  fullWidth
                  multiline
                  minRows={3}
                  value={form.descriptionHi}
                  onChange={(event) =>
                    updateField("descriptionHi", event.target.value)
                  }
                  error={Boolean(errors.descriptionHi)}
                  helperText={errors.descriptionHi}
                  slotProps={{ htmlInput: { maxLength: 500 } }}
                />

                <TextField
                  label="लेख की सामग्री (हिंदी)"
                  fullWidth
                  multiline
                  minRows={8}
                  value={form.contentHi}
                  onChange={(event) =>
                    updateField("contentHi", event.target.value)
                  }
                  helperText="अलग-अलग पैराग्राफ के बीच एक खाली पंक्ति रखें।"
                />
              </Box>
            </Box>

            <Box className="news-editor-metadata">
              <Typography component="h2" className="news-editor-section-title">
                Article settings
              </Typography>

              <Box className="news-editor-metadata-grid">
                <TextField
                  select
                  label="Category"
                  required
                  fullWidth
                  value={form.category}
                  onChange={(event) =>
                    updateField("category", event.target.value as NewsCategory)
                  }
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Author"
                  required
                  fullWidth
                  value={form.author}
                  onChange={(event) =>
                    updateField("author", event.target.value)
                  }
                  error={Boolean(errors.author)}
                  helperText={errors.author}
                  slotProps={{ htmlInput: { maxLength: 100 } }}
                />

                <TextField
                  select
                  label="Publication status"
                  required
                  fullWidth
                  value={form.status}
                  onChange={(event) =>
                    updateField("status", event.target.value as NewsStatus)
                  }
                >
                  {statuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status === "DRAFT"
                        ? "Draft"
                        : status === "PUBLISHED"
                          ? "Published"
                          : "Scheduled"}
                    </MenuItem>
                  ))}
                </TextField>

                {form.status === "SCHEDULED" && (
                  <TextField
                    label="Publication date and time"
                    type="datetime-local"
                    required
                    fullWidth
                    value={form.publishedAt}
                    onChange={(event) =>
                      updateField("publishedAt", event.target.value)
                    }
                    error={Boolean(errors.publishedAt)}
                    helperText={
                      errors.publishedAt ||
                      "Choose a future date and time in your local timezone."
                    }
                    slotProps={{
                      inputLabel: { shrink: true },
                    }}
                  />
                )}

                <TextField
                  className="news-editor-image-url"
                  label="Featured image URL"
                  fullWidth
                  value={form.imageUrl}
                  onChange={(event) =>
                    updateField("imageUrl", event.target.value)
                  }
                  error={Boolean(errors.imageUrl)}
                  helperText={
                    errors.imageUrl ||
                    "Use a publicly accessible HTTP or HTTPS image URL."
                  }
                />
              </Box>

              {form.imageUrl.trim() && (
                <Box className="news-editor-image-preview">
                  <Typography className="news-editor-preview-label">
                    Image preview
                  </Typography>

                  {imageLoadFailed ? (
                    <Alert severity="warning">
                      The image could not be loaded. Check the URL and try
                      again.
                    </Alert>
                  ) : (
                    <img
                      src={form.imageUrl}
                      alt="Article preview"
                      onLoad={() => setImageLoadFailed(false)}
                      onError={() => setImageLoadFailed(true)}
                    />
                  )}
                </Box>
              )}
            </Box>

            {saveError && (
              <Alert
                severity="error"
                className="news-editor-save-error"
                onClose={() => setSaveError("")}
              >
                {saveError}
              </Alert>
            )}

            <Box className="news-editor-actions">
              <Button variant="outlined" onClick={onCancel} disabled={saving}>
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                startIcon={
                  form.status === "PUBLISHED" ? (
                    <VisibilityOutlinedIcon />
                  ) : (
                    <SaveOutlinedIcon />
                  )
                }
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : form.status === "PUBLISHED"
                    ? "Save and publish"
                    : form.status === "SCHEDULED"
                      ? "Schedule article"
                      : "Save draft"}
              </Button>
            </Box>
          </Box>
        </Paper>

        <Snackbar
          open={Boolean(notice)}
          autoHideDuration={3500}
          onClose={() => setNotice("")}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            severity={Object.keys(errors).length > 0 ? "warning" : "info"}
            onClose={() => setNotice("")}
          >
            {notice}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
