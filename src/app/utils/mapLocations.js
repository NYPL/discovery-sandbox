const mapLocations = (locations) =>
  (locations ? locations.split(';') : []).map((location) =>
    location === 'all' ? '' : location,
  );

export default mapLocations;
