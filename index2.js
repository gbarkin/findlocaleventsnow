//ticketmaster endpoint
const TicketMaster_URL = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=Bnj4KVp4eI7WxBdAPABGCMGAv46XIDD6"
//youtube endpoint
const Youtube_URL = "https://www.googleapis.com/youtube/v3/search"
//state ids for validation
const stateID = ['AK', 'NC', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY', 'AS', 'GU', 'MP', 'PR', 'VI', 'UM', 'FM', 'MH', 'PW']

//Checks that the state is correct
function validateFormData() {
  $('.js-form').submit(event, function() {
    event.preventDefault();
    let myState = $('#state').val().toUpperCase();
    if (stateID.includes(myState)) {
      collectFormData();
    } else {
      $('#state-error').html("enter valid state");
      $('#state').addClass('error');
    };
  });
}

//sets today's date as default

function setDate() {
  let today = new Date().toISOString().substr(0, 10);
  document.querySelector("#today-date").valueAsDate = new Date();
}

//progress waiting

$('body').ajaxStart(function() {
$(this).css({'cursor':'wait'})
}).ajaxStop(function() {
$(this).css({'cursor':'default'})
});



//prepare form data for GET
function collectFormData() {
  $('#state-error').html("");
  $('#accordion').html(" ");
  $('.instructions').hide();
  $('.hide-element').removeClass('hide-element');



  // assign form data to variables
  let myCity = $('#city');
  let myState = $('#state');
  let myDate = $('#today-date').val();
  let newDate = new Date(myDate);

  //create new date
  newDate.setDate(newDate.getDate() + 5);
  //convert new date
  let endDate = newDate.toISOString();
  let shortDate = endDate.substr(0, 10);



  // query for ticketmaster GET
  let query = {
    sort: 'date,asc',
    city: myCity.val(),
    stateCode: myState.val(),
    radius: 10,
    unit: 'miles',
    startDateTime: `${myDate}T00:00:00Z`,
    endDateTime: `${shortDate}T00:00:00Z`,
    size: 50,
    page: 0
  };
  // getDataFrom Api ticketmaster
  getDataFromApi(query, buildTicketMasterData);
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

//Checks that data returned as expected
function validateTicketMasterData(data) {
  if (data._embedded) {
    buildTicketMasterData(data);
  } else {
    // notify user if there are no results
    $('.missing-results').html(`<div class="no-results shadow">
  <p>  No results returned in your zip code.</p><p>  Please try a different zip code.</p></div>`);


  }
}

// build ticket master data add missing pricing element
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
  //count number of div results
  let count = $('.accordion-toggle').length;
  console.log(count);

  //display number of results
  $('.result-count').html(`${count} events shown.`);

  if (count === 0) {
    $('.missing-results').html(`<div class="no-results">
  <p>  No results returned in your zip code.</p><p>  Please try a different zip code.</p></div>`);
  }

  accordionSetup();
}


//render the results for the page
function renderResult(results) {
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
}


//setup accordion to display results
function accordionSetup() {
  $(".accordion-content").hide();

  //method for hiding and showing the accordion
  $('#accordion').find('.accordion-toggle').click(function() {
    $('.vid-content').html('');
    let eventName = $(event.currentTarget).find('.event-name').text();

    //on click, look up youtube video
    getDataFromYoutube(eventName, youtubeData);
    $(this).next().slideToggle('fast');
    $(".accordion-content").not($(this).next()).slideUp('fast');
  });
}


//manage the youtube data, add to event div
function youtubeData(data) {
  let videoPrev = data.items[0].id.videoId;
  console.log(videoPrev);
  // console.log();
  $('.vid-content').show();
  $('.vid-content').html(`<p>Top Result on Youtube</p><iframe id="ytplayer" type="text/html" width="100%" height="auto" src="https://www.youtube.com/embed/${videoPrev}" frameborder="0" allowfullscreen>`);
}

//get data from youtube api
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
  $(validateFormData);
  $(setDate);
  console.log("ready");
});
