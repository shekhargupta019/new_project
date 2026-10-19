import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import SearchIcon from "@mui/icons-material/Search";
import {
  deleteNewsArticle,
  getNewsArticles,
  updateNewsStatus,
} from "../services/adminNewsService";
import type { NewsArticle, NewsStatus } from "../types/news";
import NewsEditor from "./NewsEditor.tsx";
import "./AdminNews.css";

type EditorState = { mode: "create" } | { mode: "edit"; article: NewsArticle };

const statuses: NewsStatus[] = ["DRAFT", "PUBLISHED", "SCHEDULED"];

function formatDate(value: string | null): string {
  if (!value) return "—";

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(date);
}

function statusColor(status: NewsStatus): "success" | "warning" | "info" {
  if (status === "PUBLISHED") return "success";
  if (status === "SCHEDULED") return "info";
  return "warning";
}

export default function AdminNews() {
  const [articles, setArticles] = useState<NewsArticle[]>(() =>
    getNewsArticles(),
  );
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [deleteTarget, setDeleteTarget] = useState<NewsArticle | null>(null);
  const [notice, setNotice] = useState("");

  const categories = useMemo(
    () => [...new Set(articles.map((article) => article.category))].sort(),
    [articles],
  );

  const filteredArticles = useMemo(() => {
    const query = search.trim().toLowerCase();

    return articles.filter((article) => {
      const matchesSearch =
        !query ||
        article.title.en.toLowerCase().includes(query) ||
        article.title.hi.toLowerCase().includes(query) ||
        article.author.toLowerCase().includes(query);

      return (
        matchesSearch &&
        (category === "ALL" || article.category === category) &&
        (status === "ALL" || article.status === status)
      );
    });
  }, [articles, search, category, status]);

  const counts = {
    total: articles.length,
    published: articles.filter((item) => item.status === "PUBLISHED").length,
    drafts: articles.filter((item) => item.status === "DRAFT").length,
    scheduled: articles.filter((item) => item.status === "SCHEDULED").length,
  };

  if (editor) {
    return (
      <NewsEditor
        article={editor.mode === "edit" ? editor.article : undefined}
        onCancel={() => setEditor(null)}
        onSaved={(updated) => {
          setArticles(updated);
          setEditor(null);
          setNotice("News article saved successfully.");
        }}
      />
    );
  }

  const handleDelete = () => {
    if (!deleteTarget) return;

    try {
      setArticles(deleteNewsArticle(deleteTarget.id));
      setNotice("News article deleted.");
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Unable to delete article.",
      );
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleStatusChange = (article: NewsArticle) => {
    const nextStatus: NewsStatus =
      article.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";

    try {
      setArticles(updateNewsStatus(article.id, nextStatus));
      setNotice(`Article status changed to ${nextStatus}.`);
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Unable to update status.",
      );
    }
  };

  return (
    <Box className="admin-news">
      <Container maxWidth="xl" className="admin-news__container">
        <Box className="admin-news__topbar">
          <Box>
            <Typography className="admin-news__eyebrow">
              TALK TANTRA INDIA
            </Typography>
            <Typography component="h1" className="admin-news__title">
              News Management
            </Typography>
            <Typography className="admin-news__subtitle">
              Create, edit and manage your news articles.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setEditor({ mode: "create" })}
          >
            Add News
          </Button>
        </Box>

        <Box className="admin-news__metrics">
          {[
            { label: "Total News", value: counts.total },
            { label: "Published", value: counts.published },
            { label: "Drafts", value: counts.drafts },
            { label: "Scheduled", value: counts.scheduled },
          ].map((metric) => (
            <Paper
              className="admin-news__metric"
              key={metric.label}
              elevation={0}
            >
              <Typography className="admin-news__metric-label">
                {metric.label}
              </Typography>
              <Typography className="admin-news__metric-value">
                {metric.value}
              </Typography>
            </Paper>
          ))}
        </Box>

        <Paper className="admin-news__panel" elevation={0}>
          <Box className="admin-news__list-heading">
            <Box>
              <Typography component="h2" className="admin-news__section-title">
                All articles
              </Typography>
              <Typography className="admin-news__muted">
                {filteredArticles.length} article(s) found
              </Typography>
            </Box>
          </Box>

          <Box className="admin-news__filters">
            <TextField
              size="small"
              fullWidth
              placeholder="Search English/Hindi headline or author"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              slotProps={{
                input: { startAdornment: <SearchIcon fontSize="small" /> },
              }}
            />

            <TextField
              select
              size="small"
              label="Category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <MenuItem value="ALL">All categories</MenuItem>
              {categories.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              size="small"
              label="Status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <MenuItem value="ALL">All statuses</MenuItem>
              {statuses.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Headline</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Updated</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredArticles.map((article) => (
                  <TableRow key={article.id} hover>
                    <TableCell>
                      <Typography className="admin-news__headline">
                        {article.title.en}
                      </Typography>
                      <Typography className="admin-news__headline-hi">
                        {article.title.hi}
                      </Typography>
                      <Typography className="admin-news__muted">
                        By {article.author || "Unknown author"}
                      </Typography>
                    </TableCell>

                    <TableCell>{article.category}</TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={article.status}
                        color={statusColor(article.status)}
                      />
                    </TableCell>

                    <TableCell>{formatDate(article.updatedAt)}</TableCell>

                    <TableCell align="right">
                      <Box className="admin-news__actions">
                        <Button
                          size="small"
                          onClick={() => setEditor({ mode: "edit", article })}
                          startIcon={<EditOutlinedIcon />}
                        >
                          Edit
                        </Button>

                        <Button
                          size="small"
                          onClick={() => handleStatusChange(article)}
                        >
                          {article.status === "PUBLISHED"
                            ? "Unpublish"
                            : "Publish"}
                        </Button>

                        <Button
                          size="small"
                          color="error"
                          aria-label={`Delete ${article.title.en}`}
                          onClick={() => setDeleteTarget(article)}
                        >
                          <DeleteOutlinedIcon fontSize="small" />
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredArticles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Box className="admin-news__empty">
                        <Typography>No articles match your filters.</Typography>
                        <Button
                          onClick={() => {
                            setSearch("");
                            setCategory("ALL");
                            setStatus("ALL");
                          }}
                        >
                          Clear filters
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>

      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
      >
        <DialogTitle>Delete news article?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will remove “{deleteTarget?.title.en}” from this browser's
            saved mock data. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(notice)}
        autoHideDuration={3500}
        onClose={() => setNotice("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="success" onClose={() => setNotice("")}>
          {notice}
        </Alert>
      </Snackbar>
    </Box>
  );
}
