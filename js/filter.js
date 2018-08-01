
var FilterWidget = function() {
  var that = this;
  var availableFilters = ["all", "identity", "digital", "print"];
  var filterName = {
    forNone: "all",
    forIdentity: "identity",
    forDigital: "digital",
    forPrint: "print"
  };
  var selector = {
    forFilterButton: ".js-filterLink",
    forFilterButtonOfType: function (t) {
      return "[data-controls-filter=" + t + "]";
    },
    forProject: ".js-project",
    forProjectsOfType: function (t) {
      return ".js-projectType-" + t;
    }
  };
  var className = {
    forActiveState: "is-active"
  };
  
  this._parameterName = "filter";
  this._state = null;
  this._defaultState = filterName.forNone;
  this._pageTitle = document.title;
  
  // Helpers to manage active filter and URL state
  this._resetState = function () {
    this._state = null;
    history.replaceState({}, this._pageTitle, "/work/");
  };
  
  this._setState = function (newState) {
    if (newState !== this._state) {
      this._state = newState;
      this._setStateParams();
    }
  };
  
  this._getStateParams = function () {
    return document.location.search;
  };
  
  this._setStateParams = function() {
    var state = this._state;
    var newParams = this._createQueryString(state);
    var stateObj = {
      filter: state
    };
    
    history.replaceState(stateObj, this._pageTitle, newParams);
  };
  
  this._createQueryString = function (state) {
    return "?" + this._parameterName + "=" + state;
  };
  
  this._getFilterFromUrl = function() {
    var queryString = location.search;

    if (queryString) {
      var pairs = queryString.slice(1).split('&');
      var result = {};
      
      pairs.forEach(function(pair) {
        pair = pair.split('=');
        result[pair[0]] = decodeURIComponent(pair[1] || '');
      });

      return JSON.parse(JSON.stringify(result))[this._parameterName];
    }
  };
  
  this._handleFilterUpdate = function (e) {
    var filterToApply = that._getFilterNameFromElement(e.target);

    that._setState(filterToApply);
    that._applyFilter(filterToApply);
  };
  
  // Helpers that interact with DOM
  this._bindFilterChanges = function () {
    $("body").on("click", selector.forFilterButton, this._handleFilterUpdate);
  };
  this._getProjectsOfType = function (name) {
    $(selector.forProjectsOfType(name));
  };
  this._getFilterNameFromElement = function (el) {
    return $(el).data("controlsFilter");
  };
  
  this._applyFilter = function(newFilter) {
    if ( availableFilters.indexOf(newFilter) < 0 ) {
      this._resetState();
    }
    else if ( newFilter === filterName.forNone ) {
      $(selector.forProject).fadeOut(function() {
        $(selector.forProject).fadeIn();
      });
    }
    else {
      $(selector.forProject).fadeOut(function() {
        $(selector.forProjectsOfType(newFilter)).fadeIn();
      });
    }
    
    this._showActiveFilter();
  };
  
  this._showActiveFilter = function () {
    var currentFilter = this._state || this._defaultState;

    $(selector.forFilterButton).removeClass(className.forActiveState);
    $(selector.forFilterButtonOfType(currentFilter)).addClass(className.forActiveState);
  };
  
  // Set initial state of widget and bind user events
  function initialize() {
    var filterApplied = that._getFilterFromUrl();

    if (filterApplied) {
      that._state = filterApplied;
      that._applyFilter(filterApplied);
    }
    
    that._showActiveFilter();
    that._bindFilterChanges();
  };
  
  return {
    init: initialize
  };
};


$(document).ready(function(){
  var filter = new FilterWidget();
  filter.init();
});
