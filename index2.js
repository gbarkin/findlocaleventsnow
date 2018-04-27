const TicketMaster_URL = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=Bnj4KVp4eI7WxBdAPABGCMGAv46XIDD6"

const Youtube_URL = "https://www.googleapis.com/youtube/v3/search"

//shrink inputs
//add header to columns
//make key/value bold
// add labels for the form
// form for submiting new event
function watchSubmit() {
  $('.js-form').submit(event, function() {
    event.preventDefault();
    $('.instructions').hide();

    // clear out previous data
    $('.event-name').html('');

    // assign form data to variables
    let queryCity = $('#city');
    let queryArtistName = $('#artist-name');
    let myBudget = $('#my-budget');
    let myDate = $('#today-date').val();

    // query for ticketmaster call
    // todo validate entry, try catch
    let query = {
      sort: 'date,asc',
      keyword: queryArtistName.val(),
      city: queryCity.val(),
      radius: 100,
      startDateTime: `${myDate}T09:00:00Z`,
      size: 100,
      page: 0
    };
    // getDataFrom Api ticketmaster
    getDataFromApi(query, buildTicketMasterData);
  });
}

// API request to TicketMaster

function getDataFromApi(searchTerm, callback) {
  let settings = {
    // todo make capital Youtube_URL
    url: TicketMaster_URL,
    data: searchTerm,
    //check is json is default
    dataType: "json",
    //todo add error callback 'non-success'
    success: buildTicketMasterData
  };
  $.ajax(settings);
}

// callback for the ticket master data
// build ticket master data
function buildTicketMasterData(data) {
  if (data._embedded) {
    let results = data._embedded.events.map(function(item) {
      return renderResult(item);
    });
    $('#accordion').html(results);
    accordionSetup();

  }
}
//clean data etc prior to moving data to template

function renderResult(results) {
  let myBudget = $('#my-budget').val();
  if (results.priceRanges) {
    let eventPrice = Number(results.priceRanges[0].min);
    if (eventPrice < myBudget) {
      return `
    <h2 class="accordion-toggle"> Date: ${results.dates.start.localDate}</span><span class="event-name">${results.name}.</span><span class="event-date"><span class="event-price"> $${results.priceRanges[0].min}</span></h2>
    <div class="accordion-content">
    <div class="event-date-time">
      <p>  ${results.dates.start.localDate}</p>
      <p>Time:${results.dates.start.localTime}</p>
      </div>
      <div class="event-price-venue">
      <p>Price: $${results.priceRanges[0].min}</p>
      <p>Venue: ${results._embedded.venues[0].name}</p>
      </div>
      <div class="vid-content"></div>
    </div>`;
    } else {
      console.log("to be determined")
    }

  } else {
    return `
  <h2 class="accordion-toggle"> Date: ${results.dates.start.localDate}</span><span class="event-name">${results.name}.</span><span class="event-date"><span class="event-price"> Price Unavailable</span></h2>
    <div class="accordion-content">
    <div class="event-date-time">
      <p>  ${results.dates.start.localDate}</p>
      <p>Time:${results.dates.start.localTime}</p>
      </div>
      <div class="event-price-venue">
      <p>Venue: ${results._embedded.venues[0].name}</p>
      </div>
      <div class="vid-content"></div>
    </div>`;
  }
}


function accordionSetup() {
  $(".accordion-content").hide();

  $('#accordion').find('.accordion-toggle').click(function() {
    $('.vid-content').hide();
    let eventName = $(event.currentTarget).find('.event-name').text();
    getDataFromYoutube(eventName, youtubeData);
    $(this).next().slideToggle('fast');
    $(".accordion-content").not($(this).next()).slideUp('fast');
  });
}

function youtubeData(data) {
  console.log(data);
  let videoPrev = data.items[0].videoId;
  // console.log();
  $('.vid-content').show();
  $('.vid-content').html(`<iframe id="ytplayer" type="text/html" width="360" height="202.5" src="https://www.youtube.com/embed/fOERHGU4aF4" frameborder="0" allowfullscreen>`);
}


function getDataFromYoutube(item, youtubeData) {
  console.log(item);
  let search = {
    url: Youtube_URL,
    data: {
      'maxResults': '1',
      'part': 'snippet',
      'key': 'AIzaSyABkh-9aed8ARl7i57TSLwn0CUYu7fvfi4',
      'q': item,
      'type': 'video'
    },
    type: 'GET',
    success: youtubeData
  };

  $.ajax(search);

}





$(document).ready(function() {
  $(watchSubmit)
  let today = new Date().toISOString().substr(0, 10);
  document.querySelector("#today-date").valueAsDate = new Date();
  console.log("ready")
});