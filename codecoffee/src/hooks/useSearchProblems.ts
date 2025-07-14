import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/axios";
import { ProblemInContestSearch } from "@/types/problem";

interface UseDebounceSearchProblemsResult {
  problems: ProblemInContestSearch[];
  loading: boolean;
  error: string | null;
}

export const useDebounceSearchProblems = (
  query: string,
  delay: number = 1500,
): UseDebounceSearchProblemsResult => {
  const [problems, setProblems] = useState<ProblemInContestSearch[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState<string>(query);

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [query, delay]);

  // Fetch problems when debounced query changes
  const fetchProblems = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setProblems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await api.get(
        `/problems/?search=${encodeURIComponent(searchQuery)}`,
      );

      // Assuming the API returns { data: Problem[] } or Problem[]
      const result = response.data.problems;
      const problemsData: ProblemInContestSearch[] = result.map(
        (problem: any) => {
          return {
            id: problem.id,
            title: problem.title,
            difficulty: problem.difficulty,
            tags: problem.tags,
          };
        },
      );
      setProblems(problemsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch problems");
      setProblems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProblems(debouncedQuery);
  }, [debouncedQuery, fetchProblems]);

  return { problems, loading, error };
};
