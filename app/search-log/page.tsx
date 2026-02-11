import { inappropriateSearchTerms } from "../lib/helpers";
import { fetchHazelSearch } from "../lib/server-actions";

export default async function HazelSearchPage() {
  const results = await fetchHazelSearch();
  console.log("OMGWUTISIT", results)

  // Helper function to check for inappropriate terms
  const containsInappropriateTerm = (query: string) => {
    if (!query) return false;
    const lowerQuery = query.toLowerCase();
    return inappropriateSearchTerms.some((term) =>
      new RegExp(`\\b${term}\\b`, "i").test(lowerQuery)
    );
  };

  if (!results.success) {
    return (
      <div className="text-red-600 p-4">
        <p>Error: {results.error}</p>
      </div>
    );
  }

  if (results.data.length === 0) {
    return <p className="p-4">No searches found.</p>;
  }

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-bold mb-4">HazelSearch Results</h2>
      <ul className="space-y-4 w-full gap-4">
        {results.data.map((search) => {
          const isFlagged = containsInappropriateTerm(search.query);

          return (
            <li
              key={search.id}
              className="p-4  w-full flex flex-col backdrop-blur-lg bg-black/20 dark:bg-white/10"
            >
              {/* Query + optional flag */}
              <div className="flex items-center justify-between w-full">
                <span className="font-medium">{search.query}</span>
                {isFlagged && <span className="text-red-600 text-xl">⚠️</span>}
              </div>

              {/* Date below */}
              <div className="text-gray-500 text-sm mt-1 w-full text-left">
                {search.createdAt
                  ? new Date(search.createdAt).toLocaleString("en-US", {
                      timeZone: "America/Chicago",
                    })
                  : null}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
