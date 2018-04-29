const TicketMaster_URL = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=Bnj4KVp4eI7WxBdAPABGCMGAv46XIDD6"

const Youtube_URL = "https://www.googleapis.com/youtube/v3/search"


function watchSubmit() {
  $('.js-form').submit(event, function() {
    event.preventDefault();
    $('#accordion').html(" ");
    $('.instructions').hide();
    $('.hide-element').removeClass('hide-element');
    // clear out previous data
    // $('.event-name').html('');


    // assign form data to variables
    let queryZip = $('#zip');
    let myBudget = $('#my-budget');
    let myDate = $('#today-date').val();
    let myRadius = $('#my-rad');


    // query for ticketmaster call
    // todo validate entry, try catch
    let query = {
      sort: 'date,asc',
      postalCode: queryZip.val(),
      radius: myRadius.val(),
      unit: 'miles',
      startDateTime: `${myDate}T09:00:00Z`,
      size: 200,
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
    error: function(xhr, error) {
      console.debug(xhr);
      console.debug(error);
    },
    success: validateTicketMasterData
  };
  $.ajax(settings);
}


function validateTicketMasterData(data) {
  if (data._embedded) {
    buildTicketMasterData(data);
  } else {
    // notify user if there are no results
    $('.missing-results').html(`<div class="no-results">
  <p>  No results returned in your zip code.</p><p>  Please try a different zip code.</p></div>`);


  }
}

// build ticket master data
function buildTicketMasterData(data) {
  let dataFix = data._embedded.events.map(function(item) {

    if (item.priceRanges) {
      return item;
    } else {
      item.priceRanges = [{
        "min": "-not listed"
      }];
      return item;
    }
  });
  displayTicketMasterData(dataFix);
}




// setting up the data to display

function displayTicketMasterData(data) {
  console.log(data);
  let results = data.map(function(item) {

    return renderResult(item);
  });
  $('#accordion').html(results);
  checkResults();
}



function checkResults() {
  let count = $('.accordion-toggle').length
  console.log(count);
  $('.result-count').html(`${count} events shown.`);
  accordionSetup();
  if (count === 0) {
    $('.missing-results').html(`<div class="no-results">
  <p>  No results returned in your zip code.</p><p>  Please try a different zip code.</p></div>`);
  }
}





function renderResult(results) {
  let myBudget = $('#my-budget').val();
  let eventPrice = Number(results.priceRanges[0].min);
  if (eventPrice < myBudget) {
    return `
    <h2 class="accordion-toggle shadow">${results.dates.start.localDate}<div class="event-name">${results.name}.</div><span class="event-date"><span class="event-price"> $${results.priceRanges[0].min}</span></h2>
    <div class="accordion-content shadow">
    <div class="event-info">
      <p><span class="event-info-format">Date</span>:  ${results.dates.start.localDate}</p>
      <p><span class="event-info-format">Time</span>:  ${results.dates.start.localTime}</p>
      <p><span class="event-info-format">Price</span>:  $${results.priceRanges[0].min}</p>
      <p><span class="event-info-format">Venue</span>:  ${results._embedded.venues[0].name}</p>
      <p><span class="event-info-format"><a href="${results.url}" target="_blank">Get Tickets</a></span></p>
      </div>

      <div class="vid-content"><img src=""</div>
    </div>`;
  } else {
    return
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
  let videoPrev = data.items[0].id.videoId;
  console.log(videoPrev);
  // console.log();
  $('.vid-content').show();
  $('.vid-content').html(`<p>Top Result on Youtube</p><iframe id="ytplayer" type="text/html" width="100%" height="auto" src="https://www.youtube.com/embed/${videoPrev}" frameborder="0" allowfullscreen>`);
}


function getDataFromYoutube(item, youtubeData) {
  // console.log(item);
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
    error: function(xhr, error) {
      console.debug(xhr);
      console.debug(error);
    },
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