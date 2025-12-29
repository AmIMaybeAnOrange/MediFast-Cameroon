navigator.geolocation.getCurrentPosition(
  (position)=> {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    console.log(lat, lon);
  },
  (error) => {
    console.error("Location error", error);
  }
  );
