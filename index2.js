const TicketMaster_URL = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=Bnj4KVp4eI7WxBdAPABGCMGAv46XIDD6"

const Youtube_URL = "https://www.googleapis.com/youtube/v3/search"



// form for submiting new event
function watchSubmit() {
  $('.js-form').submit(event, function() {
    event.preventDefault();

    // clear out previous data
    $('.event-name').html('');

    // assign form data to variables
    let queryCity = $('#city');
    let queryArtistName = $('#artist-name');
    let myBudget = $('#my-budget');
    let myDate = $('#today-date');


    // query for ticketmaster call
    // todo validate entry, try catch
    let query = {
      sort: 'date,asc',
      keyword: queryArtistName.val(),
      city: queryCity.val(),
      radius: 100,
      startDateTime: `2018-04-26T00:00:00Z`,
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
    success: buildTicketMasterData
  };
  $.ajax(settings);
}

// callback for the ticket master data
// build ticket master data
function buildTicketMasterData(data) {
  if (data._embedded) {
    console.log(data._embedded);
    let results = data._embedded.events.map(function(item) {
      return renderResult(item);
    });
    $('#accordion').html(results);
    accordionSetup();

  }
}


function renderResult(results) {
  let myBudget = $('#my-budget').val();
  if (results.priceRanges) {
    let eventPrice = Number(results.priceRanges[0].min);
    console.log(eventPrice)
    if (eventPrice < myBudget) {
      return `
    <h4 class="accordion-toggle">Event: ${results.name}. <span class="min-price">$${results.priceRanges[0].min}</span></h4>
    <div class="accordion-content">
      <p> Date: ${results.dates.start.localDate}</p>
      <p>Time:${results.dates.start.localTime}</p>
      <p>Price: $${results.priceRanges[0].min}</p>
    </div>`;
    } else {}

  } else {
    return `
    <h4 class="accordion-toggle">Event: ${results.name}.</h4>
    <div class="accordion-content">
      <p> Date: ${results.dates.start.localDate}</p>
      <p>Time:${results.dates.start.localTime}</p>
    </div>`;
  }
}


function accordionSetup() {
  $(".accordion-content").hide();
  $(".accordion-content").not($(this).next()).slideUp('fast');
  $('#accordion').find('.accordion-toggle').click(function() {
    $(this).next().slideToggle('fast');
  });
}





//
// function addYoutubeResults(item) {
//   console.log(item);
//   for (let i = 0; i < item.length; i++) {
//     //
//   //
//   // getDataFromYoutube(item, youtubeData);
//   //
//   // function youtubeData(data) {
//   //   // console.log(data);
//   //   // console.log(item)
//   //   arr = [data, item]
//   //   // myArray.push(arr);
//   // }
//
//   }
//   // await console.log(myArray);
//
// }






// function addYoutubeResults(results) {
//   for (i = 0; i < result.length; i++) {
//     return
//
//   }
// }






// function youtubeData(data) {
//   console.log(data)
// }
//
// function getDataFromYoutube(item, youtubeData) {
//   // console.log(item);
//   let search = {
//     url: Youtube_URL,
//     data: {
//       'maxResults': '1',
//       'part': 'snippet',
//       'key': 'AIzaSyABkh-9aed8ARl7i57TSLwn0CUYu7fvfi4',
//       'q': `
//     // $ {
//     //   item.name
//     // }
//     `,
//       'type': 'video'
//     },
//     type: 'GET',
//     success: youtubeData
//   };
//
//   $.ajax(search);
//
// }



//
//
//


//     }.Youtube Image < img src = '${updateItem.snippet.thumbnails.medium}' > < /div>
//

//   return `${item.priceRanges[0].min}& ${item.name} & ${item.dates.start.localDate} `
//
// }


// getDataFromYoutube(item, youtubeData);
//
//
// function youtubeData(data) {
//   // updateItem = addYoutubeObj(item, data);
//   console.log(data);
// }
//
// function addYoutubeObj(item, data) {
//   return $.extend(item, data.items[0]);

$(watchSubmit)
$()