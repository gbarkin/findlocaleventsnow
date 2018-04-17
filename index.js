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

function renderResult(result) {
  if (result.priceRanges[0].min < myBudget.val()) {
    return `
<ul><li>Price: ${result.priceRanges[0].min} - ${result.name}</li></ul>
  `;
  } else {
    console.log("yikes")
  }
}

function displayTicketMasterData(data) {
  console.log(data);

  let results = data._embedded.events.map(function(item, index) {
    return renderResult(item);

  });
  $('.js-results').html(results);
}


function watchSubmit() {
  $('.js-form').submit(event, function() {
    event.preventDefault();
    let queryCity = $(event.currentTarget).find('#city');
    let queryArtistName = $(event.currentTarget).find('#artist-name');
    let queryStartDate = $(event.currentTarget).find('#start-date').val().toString() + `T00:00:00Z`;
    let queryEndDate = $(event.currentTarget).find('#end-date').val().toString() + `T00:00:00Z`;
    myBudget = $(event.currentTarget).find('#my-budget');
    $('.event-name').html('');
    let query = {
      keyword: queryArtistName.val(),
      city: queryCity.val(),
      startDateTime: queryStartDate,
      endDateTime: queryEndDate,
      size: 10,
      page: 1
    };
    // findEventsInBudget(queryMyBudget);
    // console.log(query);
    getDataFromApi(query, displayTicketMasterData);

  });
}



$(watchSubmit);