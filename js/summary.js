/* global define */
'use strict';

import Highcharts from 'highcharts/highcharts.src.js';
import * as Utility from 'ccb.util';
import $ from 'jquery';

  /**
  *   Issue #28: Since some crashes may not have any injuries, we need a helper function
  *   that catches this condition and returns 0 instead.
  */

  const injuryFigure = function injuryFigure(injuries) {
      if (injuries === undefined) {
          return 0;
      } else {
          return injuries;
      }
  };

  /**
  *   Outputs the textual representation of crashes located in a given distance.
  */
  const outputCrashDataText = function outputCrashDataText(bikeOutputObj, pedOutputObj) {
      if (bikeOutputObj !== undefined) {
          $('#counterBicyclist').html(bikeOutputObj.crashes);
          $('#counterBicyclistByYear').html('');
          $('#totalBicyclistInjuries').html(bikeOutputObj.totalInjuries);

          const counterBicyclistByYear = Utility.sortObjectByKey(bikeOutputObj.crashesByYear);
          $.each(counterBicyclistByYear, (key, value) => {
           $('#counterBicyclistByYear').append(`<div>${key}: ${Utility.crashOrCrashes(value)} with
               ${injuryFigure(Utility.personOrPeople(bikeOutputObj.injuriesByYear[key]))} injured &
               ${injuryFigure(Utility.personOrPeople(bikeOutputObj.noInjuriesByYear[key]))} uninjured</div>`);
          });
      }

      if (pedOutputObj !== undefined) {
          $('#counterPedestrian').html(pedOutputObj.crashes);
          $('#counterPedestrianByYear').html('');
          $('#totalPedestrianInjuries').html(pedOutputObj.totalInjuries);

          const counterPedestrianByYear = Utility.sortObjectByKey(pedOutputObj.crashesByYear);
          $.each(counterPedestrianByYear, (key, value) => {
           $('#counterPedestrianByYear').append(`<div>${key}: ${Utility.crashOrCrashes(value)} with
               ${injuryFigure(Utility.personOrPeople(pedOutputObj.injuriesByYear[key]))} injured &
               ${injuryFigure(Utility.personOrPeople(pedOutputObj.noInjuriesByYear[key]))} uninjured</div>`);
          });
      }

      $('#status').html('');
  };

  /*
  *   Output our crash data in two separate graphs.
  */
  const outputCrashDataGraph = function outputCrashDataGraph(bikeOutputObj, pedOutputObj) {
      //
      // Output the summary graph (# of total pedestrian injuries, # of total bicycle injuries, total as encap if possible)
      //
      Highcharts.chart('summaryGraph', {
          chart: {
              type: 'bar'
          },
          title: {
              text: 'Injury summary (2009-2014)'
          },
          xAxis: {
              categories: ['Injuries', 'Fatalities']
          },
          yAxis: {
              min: 0,
              title: {
                  text: 'Number of Injuries'
              },
              stackLabels: {
                  enabled: true,
                  style: {
                      fontWeight: 'bold'
                  }
              }
          },
          legend: {
              reversed: true
          },
          plotOptions: {
              series: {
                  stacking: 'normal',
                  dataLabels: {
                      enabled: true,
                      color: 'white',
                      fontWeight: 'bold'
                  }
              }
          },
          tooltip: {
              formatter: function formatter() {
                  return `<b>${this.x}</b><br/>
                      ${this.series.name}: ${this.y}<br/>
                      Total: ${this.point.stackTotal}`;
              }
          },
          series:
              [
                  {
                      name: 'Pedestrian',
                      color: '#fdae68',
                      data: [pedOutputObj === undefined ? '' : pedOutputObj.totalInjuries,
                              pedOutputObj === undefined ? '' : pedOutputObj.totalKilled]
                  },
                  {
                      name: 'Bicycle',
                      color: '#36a095',
                      data: [bikeOutputObj === undefined ? '' : bikeOutputObj.totalInjuries,
                              bikeOutputObj === undefined ? '' : bikeOutputObj.totalKilled]
                  }
              ]
      });

      var annualBreakdownObj = {};

      if (pedOutputObj !== undefined) {
          pedOutputObj.injuriesByYear.forEach((injuries, year) => {
              var annualBreakdownDetailObj = {bikeInjuries: 0, pedInjuries: injuries};
              annualBreakdownObj[year] = annualBreakdownDetailObj;
          });
      }

      if (bikeOutputObj !== undefined) {
          bikeOutputObj.injuriesByYear.forEach((injuries, year) => {
              var annualBreakdownDetailObj;
              if (annualBreakdownObj[year] instanceof Object) {
                  annualBreakdownDetailObj = annualBreakdownObj[year];
                  annualBreakdownDetailObj.bikeInjuries = injuries;
                  annualBreakdownObj[year] = annualBreakdownDetailObj;
              } else {
              annualBreakdownDetailObj = {bikeInjuries: injuries, pedInjuries: 0};
              annualBreakdownObj[year] = annualBreakdownDetailObj;
              }
          });
      }

      var pedInjuryArr = [];
      var bikeInjuryArr = [];
      $.each(annualBreakdownObj, (index, injuryObject) => {
          pedInjuryArr.push(injuryObject.pedInjuries);
          bikeInjuryArr.push(injuryObject.bikeInjuries);
      });

      Highcharts.chart('breakdownGraph', {
          chart: {
              type: 'bar'
          },
          title: {
              text: 'Annual Breakdown'
          },
          xAxis: {
              categories: Object.keys(annualBreakdownObj)
          },
          yAxis: {
              min: 0,
              title: {
                  text: 'Number of Injuries'
              },
              stackLabels: {
                  enabled: true,
                  style: {
                      fontWeight: 'bold'
                  }
              }
          },
          legend: {
              reversed: true
          },
          plotOptions: {
              series: {
                  stacking: 'normal',
                  dataLabels: {
                      formatter: function formatter() {
                          if (this.y === 0) {
                              return '';
                          } else {
                              return this.y;
                          }
                      },
                      enabled: true,
                      color: 'white',
                      fontWeight: 'bold'
                  }
              }
          },
          tooltip: {
              formatter: function formatter() {
                  return `<b>${this.x}</b><br/>
                      ${this.series.name}: ${this.y}<br/>
                      Total: ${this.point.stackTotal}`;
              }
          },
           series:
              [{
                  name: 'Pedestrian',
                  color: '#fdae68',
                  data: pedInjuryArr
              },
              {
                  name: 'Bicycle',
                  color: '#36a095',
                  data: bikeInjuryArr
              }]
      });

  };

  /*
  *   After showing graphs in the sidebar, resize to fit within viewport.
  */
  var resizeGraphs = function resizeGraphs() {
      $('#summaryGraph').width($('#list').width()-15);
      $('#breakdownGraph').width($('#list').width()-15);
  };

  /*
  *   Toggles showing the graph.
  */
  var showGraph = function showGraph() {
      $('#counterTotals').hide();
      $('#graphs').show();
      resizeGraphs();
  };

  /**
  *   Toggles showing text.
  */
  var showText = function showText() {
      $('#counterTotals').show();
      $('#graphs').hide();
      resizeGraphs();
  };

  var populateMetaData = function populateMetaData(metaDataObj) {
      $('#radius').html(Utility.getDistance());
      $('#coords').html(metaDataObj.lat+', '+metaDataObj.lng);
      $('#latitude').html(metaDataObj.lat);
      $('#longitude').html(metaDataObj.lng);
      $('#permalink').html(`<a href="#lat=${metaDataObj.lat}&lon=${metaDataObj.lng}&get=yes">Permalink</a>`);
      $('#metadata-link').show();
  };

  export {
      outputCrashDataGraph,
      outputCrashDataText,
      populateMetaData,
      showGraph,
      showText
  };