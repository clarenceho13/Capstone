import React from 'react';

//props { ratings } and { reviewNum } are passed down from Product.jsx
function Ratings(props) {
  const { ratings, reviewNum } = props;
  return (
    <div className="ratings">
      <span> Ratings: {ratings}/5</span>
      <br />
      <span>Number of reviews: {reviewNum}</span>
    </div>
  );
}

export default Ratings;


