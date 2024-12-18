import { useState, useEffect } from 'react';
import { intlFormatDistance } from 'date-fns';

/**
 * Displays a countdown timer for a listing, updating every second.
 *
 * @param {Object} props
 * @param {string} props.end_datetime - The end datetime of the listing.
 * @param {Function} props.updateListing - A function to be called when the
 *   auction ends.
 * @returns {JSX.Element}
 */
const ListingCountdown = ({ end_datetime, updateListing }) => {
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      if (end_datetime) {
        const endTime = new Date(end_datetime);
        const currentTime = new Date();
        const timeRemaining = endTime.getTime() - currentTime.getTime();

        if (timeRemaining > 0) {
          const formattedTimeRemaining = intlFormatDistance(endTime, currentTime);
          setTimeRemaining(formattedTimeRemaining);
        } else {
          setTimeRemaining('Ended');
          updateListing();
        }
      }
    };

    calculateTimeRemaining();

    const intervalId = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(intervalId);
  }, [end_datetime, updateListing]);

  return (
    <div>
      {timeRemaining && timeRemaining !== 'Ended' ? 
        <div>Auction ends {timeRemaining}</div>
        : <div>Auction has ended</div>}
    </div>
  );
};

export default ListingCountdown;