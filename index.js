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
  var displayResults = $('.results');
  data._embedded.events.forEach(function(item, index) {
    let elem = $('.results-temp').children().clone();
    console.log(item.name);
    let title = (item.name);
    $('.event-name').append(`${title}<br>`);
  });

}

function watchSubmit() {
  $('.js-form').submit(event, function() {
    event.preventDefault();
    let queryCity = $(event.currentTarget).find('#city');
    let queryArtistName = $(event.currentTarget).find('#artist-name');
    let queryMyBudget = $(event.currentTarget).find('#my-budget');
    let queryStartDate = $(event.currentTarget).find('#start-date').val().toString() + `T00:00:00Z`;
    let queryEndDate = $(event.currentTarget).find('#end-date').val().toString() + `T00:00:00Z`;

    console.log(queryStartDate);
    $('.event-name').html('');
    let query = {
      keyword: queryArtistName.val(),
      city: queryCity.val(),
      startDateTime: queryStartDate,
      endDateTime: queryEndDate,
      size: 20,
      page: 1
    };
    // findEventsInBudget(queryMyBudget);
    console.log(query);
    getDataFromApi(query, displayTicketMasterData);

  });
}



$(watchSubmit);