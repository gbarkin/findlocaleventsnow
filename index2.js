const TicketMaster_URL = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=Bnj4KVp4eI7WxBdAPABGCMGAv46XIDD6"

const Youtube_URL = "https://www.googleapis.com/youtube/v3/search"



// form for submiting new event
function watchSubmit() {
  $('.js-form').submit(event, function() {
    event.preventDefault();

    // clear out previous data
    $('.event-name').html('');

    // assign form data to variables
    let queryCity = $(event.currentTarget).find('#city');
    let queryArtistName = $(event.currentTarget).find('#artist-name');
    let myBudget = $(event.currentTarget).find('#my-budget');

    // query for ticketmaster call
    let query = {
      sort: 'date,asc',
      keyword: queryArtistName.val(),
      city: queryCity.val(),
      radius: 100,
      startDateTime: `2018-04-18T00:00:00Z`,
      size: 4,
      page: 0
    };
    getDataFromApi(query);
  });
}

// API request to TicketMaster

function getDataFromApi(searchTerm) {
  let settings = {
    type: "GET",
    url: TicketMaster_URL,
    data: searchTerm,
    dataType: "json",
    success: displayTicketMasterData
  };
  $.ajax(settings);
  // console.log(searchTerm);
}

// callback for the ticket master data
function displayTicketMasterData(data) {
  let returnData = data.hasOwnProperty("_embedded");
  if (returnData === true) {
    let results = data._embedded.events.map(function(item) {
      // start youtube get

      getDataFromYoutube(item, youtubeData);

      function youtubeData(data) {
        console.log(item.name);
        console.log(data.items[0].snippet.title);
        $('.js-results').append(`<div>event name is ${item.name} the youtube video is ${data.items[0].snippet.title}
        </div>`);

      }

    });
  }
}


function getDataFromYoutube(item, youtubeData) {
  // console.log(item.name);
  let search = {
    url: Youtube_URL,
    data: {
      'maxResults': '1',
      'part': 'snippet',
      'key': 'AIzaSyABkh-9aed8ARl7i57TSLwn0CUYu7fvfi4',
      'q': `${item.name}`,
      'type': 'video'
    },
    dataType: 'json',
    type: 'GET',
    success: youtubeData
  };

  $.ajax(search);

  // renderAll(item, youtubeData);
}


function renderResult() {

}

function renderAll(item, youtubeData) {
  // console.log(item);

}

$(watchSubmit)