let map, infoWindow;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 32.068687, lng: 34.776688 },
    zoom: 9,
  });
  
  infoWindow = new google.maps.InfoWindow();
  const locationButton = document.createElement("button");
  locationButton.textContent = "Where am I ?";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          infoWindow.setPosition(pos);
          infoWindow.setContent("You are here.");
          infoWindow.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });

  let MarkerArray =
   [ 
    
    {location:{lat: 37.9922, lng: -1.1307}, 
    imageIcon: "https://img.icons8.com/nolan/2x/marker.png", 
    content: `<h2>Murcia City</h2>`},
  
    {location:{lat: 39.4699, lng: -0.3763}},
  
    {location:{lat: 38.5411, lng: -0.1225},content: `<h2>Benidorm City</h2>` }
  
   ]
  

      // loop through marker
      for (let i = 0; i < MarkerArray.length; i++){
        addMarker(MarkerArray[i]);
  
    }


    function addMarker(property){
  
      const marker = new google.maps.Marker({
          position:property.location,
          map:map,
          //icon: property.imageIcon
          });
  
          // Check for custom Icon
  
          if(property.imageIcon){
              // set image icon
              marker.setIcon(property.imageIcon)
          }
  
          if(property.content){
  
          const detailWindow = new google.maps.InfoWindow({
          content: property.content
  });
  
  marker.addListener("click", () =>{
      detailWindow.open(map, marker);
  })
  }
  }

}
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}



