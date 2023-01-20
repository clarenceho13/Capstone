import React from 'react';

//props { ratings } and { reviewNum } are passed down from Product.jsx
function Ratings(props) {
  const { ratings, reviewNum } = props;
  return (
    <div className="ratings">
      <span> Ratings: {ratings}/5 {''}
      <i className="bi bi-star-fill"></i>
      </span>
      <br />
      <span>Number of reviews: {reviewNum} {''}
      <i className="bi bi-person-fill"></i>
      <i className="bi bi-chat-quote"></i>
      </span>
    </div>
  );
}

export default Ratings;


