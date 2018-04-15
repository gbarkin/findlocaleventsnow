const TicketMaster_URL = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=Bnj4KVp4eI7WxBdAPABGCMGAv46XIDD6"

function getDataFromApi(searchTerm, callback) {
  let settings = {
    type: "GET",
    url: TicketMaster_URL,
    data: searchTerm,
    async: true,
    dataType: "json",
    success: callback
  };
  $.ajax(settings);
  // console.log(searchTerm);
}

function displayTicketMasterData(data) {
  console.log(data);
  // if (data._embedded.events[0].priceRange[0].min.val() > 20) {
  //   console.log("too much");
  // } else {
  //   console.log("just right");
  // }
  //

}

function watchSubmit() {
  $('.js-form').submit(event, function() {
    event.preventDefault();
    let queryPostalCode = $(event.currentTarget).find('#zip-code');
    let queryArtistName = $(event.currentTarget).find('#artist-name');

    let query = {
      // keyword: queryArtistName.val(),
      city: queryPostalCode.val(),
      page: 3
    };
    console.log(query);
    getDataFromApi(query, displayTicketMasterData);
  });
}

$(watchSubmit);