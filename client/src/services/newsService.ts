import { newsStories, type NewsStory } from "../features/news/newsData";

/**
 * News Service
 *
 * Currently uses local mock data.
 * Later, replace the implementation with backend API calls
 * without changing the UI components.
 */

/**
 * Fetch all breaking news stories.
 */
export async function getBreakingNews(): Promise<NewsStory[]> {
  return [...newsStories];
}

/**
 * Fetch a single news story by its slug.
 */
export async function getNewsBySlug(
  slug: string,
): Promise<NewsStory | undefined> {
  const stories = await getBreakingNews();

  return stories.find((story) => story.slug === slug);
}

/**
 * Fetch stories by category.
 */
export async function getNewsByCategory(
  category: string,
): Promise<NewsStory[]> {
  const stories = await getBreakingNews();

  return stories.filter(
    (story) => story.category.toLowerCase() === category.toLowerCase(),
  );
}

/**
 * Search stories by headline or description.
 * Searches both English and Hindi content.
 */
export async function searchNews(searchTerm: string): Promise<NewsStory[]> {
  const stories = await getBreakingNews();
  const query = searchTerm.trim().toLowerCase();

  if (!query) {
    return stories;
  }

  return stories.filter((story) => {
    const searchableText = [
      story.category,
      story.title.en,
      story.title.hi,
      story.description.en,
      story.description.hi,
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(query);
  });
}
