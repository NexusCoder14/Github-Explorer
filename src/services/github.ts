// All communication with the GitHub REST API lives in this file.

const BASE_URL = "https://api.github.com";

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  license: { name: string } | null;
  created_at: string;
  updated_at: string;
  html_url: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface SearchResult {
  total_count: number;
  items: Repository[];
}

export interface LanguageBytes {
  [language: string]: number;
}

export interface Contributor {
  id: number;
  login: string;
  avatar_url: string;
  contributions: number;
}

// One week of commit activity, as returned by GitHub.
export interface WeeklyCommits {
  week: number;
  total: number;
}

// Every response is checked for `response.ok` before being used.
// GitHub returns useful error messages in the body, but we keep
// the messages shown to the user simple and friendly instead.

export async function searchRepositories(query: string): Promise<SearchResult> {
  const url = `${BASE_URL}/search/repositories?q=${encodeURIComponent(query)}&per_page=20`;
  const response = await fetch(url);

  if (response.status === 403) {
    throw new Error("GitHub API rate limit reached. Please try again later.");
  }

  if (!response.ok) {
    throw new Error("Failed to search repositories.");
  }

  return response.json();
}

export async function getRepository(owner: string, name: string): Promise<Repository> {
  const response = await fetch(`${BASE_URL}/repos/${owner}/${name}`);

  if (response.status === 404) {
    throw new Error("Repository not found.");
  }

  if (!response.ok) {
    throw new Error("Failed to fetch repository.");
  }

  return response.json();
}

export async function getLanguages(owner: string, name: string): Promise<LanguageBytes> {
  const response = await fetch(`${BASE_URL}/repos/${owner}/${name}/languages`);

  if (!response.ok) {
    throw new Error("Failed to fetch languages.");
  }

  return response.json();
}

export async function getContributors(
  owner: string,
  name: string,
  page: number
): Promise<Contributor[]> {
  const url = `${BASE_URL}/repos/${owner}/${name}/contributors?per_page=10&page=${page}`;
  const response = await fetch(url);

  // Some repositories (forks, empty repos) have contributions disabled.
  if (response.status === 204) {
    return [];
  }

  if (!response.ok) {
    throw new Error("Failed to fetch contributors.");
  }

  return response.json();
}

// GitHub computes commit stats asynchronously. While the stats are
// being generated it responds with 202 and an empty body, so we
// retry a few times with a short delay instead of failing right away.
export async function getCommitActivity(
  owner: string,
  name: string
): Promise<WeeklyCommits[] | null> {
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const response = await fetch(`${BASE_URL}/repos/${owner}/${name}/stats/commit_activity`);

    if (response.status === 202) {
      await wait(1500);
      continue;
    }

    if (!response.ok) {
      throw new Error("Failed to fetch commit activity.");
    }

    const data = await response.json();

    // GitHub can also return an empty array while still computing.
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }

    await wait(1500);
  }

  // Statistics were not ready after all retries.
  return null;
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
