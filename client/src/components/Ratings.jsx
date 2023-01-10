import React from 'react';

//props { ratings } and { reviewNum } are passed down from Product.jsx
function Ratings(props) {
  const { ratings, reviewNum } = props;
  return (
    <div className="ratings">
      <span>
        <i
          className={
            ratings >= 1
              ? 'fas fa-star'
              : ratings >= 0.5
              ? 'fas fa-star-half-alt'
              : 'far fa-star'
          }
        />
      </span>
      <span>
        <i
          className={
            ratings >= 2
              ? 'fas fa-star'
              : ratings >= 1.5
              ? 'fas fa-star-half-alt'
              : 'far fa-star'
          }
        />
      </span>
      <span>
        <i
          className={
            ratings >= 3
              ? 'fas fa-star'
              : ratings >= 2.5
              ? 'fas fa-star-half-alt'
              : 'far fa-star'
          }
        />
      </span>
      <span>
        <i
          className={
            ratings >= 4
              ? 'fas fa-star'
              : ratings >= 3.5
              ? 'fas fa-star-half-alt'
              : 'far fa-star'
          }
        />
      </span>
      <span>
        <i
          className={
            ratings >= 5
              ? 'fas fa-star'
              : ratings >= 4.5
              ? 'fas fa-star-half-alt'
              : 'far fa-star'
          }
        />
      </span>
      <span> Ratings: {ratings}/5</span>
      <br />
      <span>Number of reviews: {reviewNum}</span>
      
      
    </div>
  );
}

export default Ratings;

//this is not working. maybe the cdn? ( 1 hr 46 min)
