import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface DragonBallCharacter {
    id: number;
    name: string;
    image: string;
    race: string;
}

interface ApiResponse {
    items: DragonBallCharacter[];
    links: {
        first: string | null;
        last: string | null;
        next: string | null;
        previous: string | null;
    };
    meta: {
        currentPage: number;
        totalPages: number
    }
}

export default function CharacterCard() {
    const [pageUrl, setPageUrl] = useState<string>('https://dragonball-api.com/api/characters');

    const { isLoading, isError, error, data } = useQuery<ApiResponse>({
        queryKey: ['characters', pageUrl],
        queryFn: async () => {
            const response = await fetch(pageUrl);
            console.log(response);

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log(data);

            if (!data?.items || !data?.links) {
                throw new Error('Invalid data format');
            }

            return data;
        },
        retry: 2,
    });

    const handleNextPage = () => {
        if (data?.links.next) {
            setPageUrl(data.links.next);
        }
    };

    const handlePrevPage = () => {
        if (data?.links.previous) {
            setPageUrl(data.links.previous);
        }
    };

    if (isLoading) {
        return <p className="text-center p-4 text-gray-400">Loading...</p>;
    }

    if (isError) {
        return (
            <div className="text-center p-4 space-y-2">
                <p className="text-gray-400">Failed to load characters</p>
                {error instanceof Error && (
                    <p className="text-sm text-gray-500">{error.message}</p>
                )}
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 p-4">
            {/* Pagination controls */}
            <div className="flex items-center justify-center gap-4">
                <button
                    onClick={handlePrevPage}
                    disabled={!data?.links.previous}
                    className={`p-2 cursor-pointer rounded-full transition-colors ${data?.links.previous
                        ? 'bg-white text-black hover:bg-gray-100'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                </button>

                <div>
                    <span> Page {data?.meta.currentPage} </span>
                    <span> of {data?.meta.totalPages} </span>
                </div>

                <button
                    onClick={handleNextPage}
                    disabled={!data?.links.next}
                    className={`p-2 cursor-pointer rounded-full transition-colors ${data?.links.next
                        ? 'bg-white text-black hover:bg-gray-100'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            </div>

            {/* Characters grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {data?.items.map((character) => (
                    <div key={character.id} className="text-center space-y-2">
                        <img
                            className="w-full aspect-square object-contain rounded-lg hover:scale-[1.3] duration-300 transition-all"
                            src={character.image}
                            alt={character.name}
                            loading="lazy"
                        />
                        <p className="font-medium text-gray-100">{character.name}</p>
                        <p className="text-sm text-gray-400">{character.race}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}