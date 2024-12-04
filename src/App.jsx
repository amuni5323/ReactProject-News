



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

const App = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [country, setCountry] = useState('us');
  const [category, setCategory] = useState('');
  const [sortOption, setSortOption] = useState('publishedAt');
  const [bookmarks, setBookmarks] = useState([]);
  const [page, setPage] = useState(1);
  const [theme, setTheme] = useState('light');

  const fetchNews = (searchQuery = '', selectedCountry = 'us', selectedCategory = '', sortBy = 'publishedAt', pageNum = 1) => {
    setLoading(true);
    const baseUrl = searchQuery
      ? `https://newsapi.org/v2/everything?q=${searchQuery}&sortBy=${sortBy}&page=${pageNum}&apiKey=6e87700877ad4cf6b8861b05cc4f818e`
      : `https://newsapi.org/v2/top-headlines?country=${selectedCountry}&category=${selectedCategory}&page=${pageNum}&apiKey=6e87700877ad4cf6b8861b05cc4f818e`;

    axios
      .get(baseUrl)
      .then((response) => {
        setNews(response.data.articles);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load news. Please try again later.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchNews(query, country, category, sortOption, page);
  }, [query, country, category, sortOption, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page for a new search
    fetchNews(query, country, category, sortOption, 1);
  };

  const handlePageChange = (direction) => {
    const newPage = direction === 'next' ? page + 1 : page - 1;
    setPage(newPage);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const addToBookmarks = (article) => {
    setBookmarks((prev) => [...prev, article]);
  };

  return (
    <div className={`container ${theme}`}>
      <header className="header">
        <h1>Latest News</h1>
        <button onClick={toggleTheme} className="theme-toggle">
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </header>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for news..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* Category Selector */}
      <div className="category-selector">
        <label htmlFor="category">Category: </label>
        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All</option>
          <option value="business">Business</option>
          <option value="technology">Technology</option>
          <option value="sports">Sports</option>
          <option value="health">Health</option>
          <option value="entertainment">Entertainment</option>
        </select>
      </div>

      {/* Country Selector */}
      <div className="country-selector">
        <label htmlFor="country">Select Country: </label>
        <select id="country" value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="us">United States</option>
          <option value="gb">United Kingdom</option>
          <option value="au">Australia</option>
          <option value="ca">Canada</option>
          <option value="in">India</option>
        </select>
      </div>

      {/* Sort Selector */}
      <div className="sort-selector">
        <label htmlFor="sort">Sort By: </label>
        <select id="sort" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="publishedAt">Newest</option>
          <option value="popularity">Most Popular</option>
          <option value="relevancy">Relevance</option>
        </select>
      </div>

      {/* Loading State */}
      {loading && <p className="loading">Loading news...</p>}

      {/* Error State */}
      {error && <p className="error">{error}</p>}

      {/* Display News Articles */}
      {!loading && !error && (
        <ul>
          {news.map((article, index) => (
            <li key={index} className="news-item">
              {article.urlToImage && (
                <img src={article.urlToImage} alt={article.title} />
              )}
              <div className="news-item-content">
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  <h3>{article.title}</h3>
                </a>
                <p>{article.description}</p>
                <button onClick={() => addToBookmarks(article)}>Bookmark</button>
              </div>
            </li>
          ))}
        </ul>
      )}

     
      {bookmarks.length > 0 && (
        <div className="bookmarks">
          <h2>Bookmarked Articles</h2>
          <ul>
            {bookmarks.map((article, index) => (
              <li key={index}>
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  {article.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && news.length > 0 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => handlePageChange('prev')}>
            Previous
          </button>
          <button onClick={() => handlePageChange('next')}>Next</button>
        </div>
      )}
    </div>
  );
};

export default App;

