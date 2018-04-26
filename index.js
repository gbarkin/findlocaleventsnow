const TicketMaster_URL = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=Bnj4KVp4eI7WxBdAPABGCMGAv46XIDD6"

const Youtube_URL = "https://www.googleapis.com/youtube/v3/search"

budgetEvents = {

    // form for submiting new event
    watchSubmit: function() {
      $('.js-form').submit(event, function() {
        event.preventDefault();
        // clear out previous data
        $('.event-name').html('');

        // assign form data to variables
        let queryCity = $(event.currentTarget).find('#city');
        let queryArtistName = $(event.currentTarget).find('#artist-name');
        let myBudget = $(event.currentTarget).find('#my-budget');



        // query for ticketmaster

        let query = {
          sort: 'date,asc',
          keyword: queryArtistName.val(),
          city: queryCity.val(),
          radius: 100,
          startDateTime: `2018-04-18T00:00:00Z`,
          size: 200,
          page: 0
        };
        budgetEvents.getDataFromApi(query, budgetEvents.displayTicketMasterData);
      });
    },



    // API request to TicketMaster

    getDataFromApi: function(searchTerm, callback) {
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
    },


    // callback for the ticket master data
    displayTicketMasterData: function(data) {
      console.log(data);
      let returnData = data.hasOwnProperty("_embedded");
      if (returnData === true) {
        let results = data._embedded.events.map(function(item) {
          // start youtube get
          return budgetEvents.renderResult(item)


        });


        $('.js-results').html(results);
        budgetEvents.showMoreDetails();
      } else

      {
        $('.event-name').html('');
        return `<div class="no-data"><p> Your search returned no results.  Try using a different city</p></div>`;
      }
    },

    addVideo: function(item, data) {
      console.log(item);
      console.log(data);
    }
  },

  // render the results of events
  renderResult: function(result) {
    let myPrice = Number($('.my-budget').val());
    let returnPrice = result.hasOwnProperty("priceRanges");
    let venueInfo = result.hasOwnProperty("venues");
    // console.log(venueInfo);
    if (returnPrice === true) {
      let actualPrice = Number(result.priceRanges[0].min);

      if (actualPrice < myPrice) {

        //this is a experiment to see if i can add the youtube results to each list

        return `
<ul class="in-budget"><li><button type="button" class="more-details">+</button>Price: $${result.priceRanges[0].min} - Event Name: ${result.name} - Event Date: ${result.dates.start.localDate}<div class='.venue-details'></div></li><div class="more-info">${result._embedded.venues[0].name}</div></ul>
  `;
      } else {
        return `
<ul><li class="out-budget">Price: $${result.priceRanges[0].min} - Event Name: ${result.name} - Event Date: ${result.dates.start.localDate}</li></ul>
  `;
      }
    } else {
      return `
<ul><li class="out-budget">Price not listed - Event Name: ${result.name} - Event Date: ${result.dates.start.localDate}</li></ul>
  `;
    }

  },


  // shows additional information about event
  showMoreDetails: function() {
    $('.more-details').click(function() {
      console.log("works");
      $('.in-budget div').show();

    });

  },





  //return data from youtube api

  getDataFromYoutube: function(searchTerm, callback) {

    const settings = {
      url: Youtube_URL,
      data: {
        'maxResults': '1',
        'part': 'snippet',
        'key': 'AIzaSyABkh-9aed8ARl7i57TSLwn0CUYu7fvfi4',
        'q': `${searchTerm}`,
        'type': 'video'
      },
      dataType: 'json',
      type: 'GET',
      success: callback
    };

    $.ajax(settings);
  },

  // youtubeSearch(item);
  // youtubeData: function(data) {
  //   return data.name;
  //
  // }


}
//
// function youtubeData(data) {
//   console.log(data);
//   let dataItem = data.hasOwnProperty('items');
//   if (dataItem === true) {
//     let dataSnip = data.hasOwnProperty('snippet');
//     if (dataSnip === true) {
//       budgetEvents.pushItem(data.items[0].snippet.title)
//     } else {
//       console.log('no snip')
//     }
//
//   } else {
//     console.log("no item");
//   }
//
// }
//
// }

budgetEvents.youtubeSearch(result);
youtubeData: function(data) {
  return data.name;

}


$(budgetEvents.watchSubmit);