import React, { useState, useEffect } from 'react';
import './Movies.css';

function MovieTable() {
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [totalResults, setTotalResults] = useState(0);
    const [sortBy, setSortBy] = useState('Title');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const API_KEY = '515d7ed8';

    useEffect(() => {
        if (search.length < 3) {
            setMovies([]);
            setTotalResults(0);
            return;
        }

        const fetchMovies = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${search}&page=${page}`);
                const data = await res.json();

                if (data.Response === "True") {
                    setMovies(data.Search);
                    setTotalResults(parseInt(data.totalResults));
                } else {
                    setMovies([]);
                    setTotalResults(0);
                    setError(data.Error || "No results found.");
                }
            } catch (err) {
                setError("Failed to fetch movies.");
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [search, page]);

    const sortedMovies = [...movies].sort((a, b) => {
        const aField = String(a[sortBy] || '').toLowerCase();
        const bField = String(b[sortBy] || '').toLowerCase();
        return aField.localeCompare(bField);
    });

    return (
        <div className="container">
            <h1>Movie Search</h1>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search movies (min 3 characters)..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <button
                    onClick={() => {
                        if (searchTerm.length >= 3) {
                            setSearch(searchTerm);
                            setPage(1);
                            setError('');
                        } else {
                            setError('Please enter at least 3 characters.');
                        }
                    }}
                >
                    Search
                </button>
            </div>

            {loading && <p className="info">Loading...</p>}
            {error && <p className="error">{error}</p>}

            {movies.length > 0 && (
                <>
                    <table className="movie-table">
                        <thead>
                            <tr>
                                <th onClick={() => setSortBy('Title')}>Title</th>
                                <th onClick={() => setSortBy('Year')}>Year</th>
                                <th>Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedMovies.map(movie => (
                                <tr key={movie.imdbID}>
                                    <td>{movie.Title}</td>
                                    <td>{movie.Year}</td>
                                    <td>{movie.Type}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="pagination">
                        <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>
                            Previous
                        </button>
                        <span>Page {page}</span>
                        <button onClick={() => setPage(p => p + 1)} disabled={page * 10 >= totalResults}>
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default MovieTable;
