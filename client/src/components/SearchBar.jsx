import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import { useNavigate } from 'react-router-dom';

function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const submitHandle = (e) => {
    e.preventDefault();
    navigate(query ? `/search/?query=${query}` : '/search');
  };
  return (
    <Form className="d-flex me-auto" onSubmit={submitHandle}>
      <InputGroup>
        <FormControl
          type="text"
          name="queries"
          id="q"
          placeholder="Search Products..."
          aria-label="Search Products"
          aria-describedby="button-search"
          onChange={(e) => setQuery(e.target.value)}></FormControl>
          <Button variant="warning" type="submit" id="button-search">
          <i className="bi bi-search"></i>
          </Button>

      </InputGroup>
    </Form>
  );
}

export default SearchBar;
