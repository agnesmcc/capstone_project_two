import { render } from '@testing-library/react';
import ListingCountdown from './ListingCountdown';

test('it renders', () => {
  const { container } = render(
    <ListingCountdown end_datetime="2023-07-01T00:00:00" updateListing={() => {}} />
  );
  expect(container).toMatchSnapshot();
});
