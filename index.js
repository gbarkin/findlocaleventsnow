const TicketMaster_URL = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=Bnj4KVp4eI7WxBdAPABGCMGAv46XIDD6"



budgetEvents = {
    watchSubmit: function() {
      $('.js-form').submit(event, function() {
        event.preventDefault();
        let queryCity = $(event.currentTarget).find('#city');
        let queryArtistName = $(event.currentTarget).find('#artist-name');
        let queryStartDate = $(event.currentTarget).find('#start-date').val().toString() + `T00:00:00Z`;
        let myBudget = $(event.currentTarget).find('#my-budget');
        $('.event-name').html('');
        $('.my-price').html(myBudget.val());
        let query = {
          sort: 'date,asc',
          keyword: queryArtistName.val(),
          city: queryCity.val(),
          startDateTime: queryStartDate,
          size: 200,
          page: 1
        };
        budgetEvents.getDataFromApi(query, budgetEvents.displayTicketMasterData);
        budgetEvents.showMoreDetails();
      });
    },


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



    renderResult: function(result) {

      let myPrice = Number($('.my-price').html());
      let returnPrice = result.hasOwnProperty("priceRanges");
      if (returnPrice === true) {
        let actualPrice = Number(result.priceRanges[0].min);
        if (actualPrice < myPrice) {
          return `
<ul><li class="in-budget"><button type="button" class="more-details">+</button>Price: $${result.priceRanges[0].min} - Event Name: ${result.name} - Event Date: ${result.dates.start.localDate}<div class='.venue-details'></div></li></ul>
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



    displayTicketMasterData: function(data) {
      console.log(data);
      let returnData = data.hasOwnProperty("_embedded");
      if (returnData === true) {
        let results = data._embedded.events.map(function(item) {
          return budgetEvents.renderResult(item);

        });
        $('.js-results').html(results);
      } else

      {
        $('.event-name').html('');
        return `<div class="no-data"><p> Your search returned no results.  Try using a different city</p></div>`;
      }
    },
    showMoreDetails: function() {
      console.log("works");
      $('.more-details').click(function() {
        console.log("works");
        $('this.venue-details').html(`more detail`);

      });

    }

  },









  $(budgetEvents.watchSubmit);