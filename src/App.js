import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';


export default function App() {
  const [results, setResults] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const searchInputRef = useRef()

  useEffect(() => {
    fetchResults()
  }, [query])

  const fetchResults = async () => {
    setLoading(true)
    try {
      const response = await axios.get(
        `http://hn.algolia.com/api/v1/search?query={query}`
      )
      setResults(response.data.hits)
    } catch (err) {
      setError(err)
    }
    
    setLoading(false)
  }

  const handleSearch = event => {
    event.preventDefault()
    fetchResults()
  }

  const handleClearQuery = event => {
    setQuery('')
    searchInputRef.current.focus()
  }

  return (
    <>
    <h1>React "Hooker" News</h1>
    <form onSubmit={handleSearch}>
    <input 
      type='text' 
      onChange={event => setQuery(event.target.value)}
      value={query}
      ref={searchInputRef}
    />
    <button type='submit'>Search</button>
    <button type='button' onClick={handleClearQuery}>Clear</button>
    </form>

    <ul>
      {loading ? (<div className='font-bold'>Loading...</div>) : 
      (results.map(result => (
        <li key={result.objectID}>
          <a href={result.url}>{result.title}</a>
        </li>
      )))}
    </ul>

    {error && <div className='font-red font-bold'>{error.message}</div>}
    </>

  );
}
