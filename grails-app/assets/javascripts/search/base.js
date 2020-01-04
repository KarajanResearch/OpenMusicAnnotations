/**
 * search/base.js
 * @author Martin Aigner
 *
 * any grails view may include this script to search for a string in any fields of
 * a data set (a table, set of domain objects, ...) provided through newSearchBase.
 * The view must contain an input element of type text (the search field). On update
 * of the input element's value, we trigger updateResult to view the search results
 * in a text area with id "search-results" provided in the view.
 * updateResults is O(searchBase)
 *
 * searchBase is created in the associated controller (index) called something like
 * "partyListJson" (from party example) as JSON
 */

var searchBase;
var searchTarget;
var resultElement;
var inputField;
var resultAction;

var limit = 50; //your input limit


/**
 * Initialize JS search utility
 * @param id ID of the search base. Different IDs refer to different search bases per view
 * @param base An JSON encoded list of domain objects
 * @param result The HTML element id where the results will be rendered
 * @param target The grails controller and action to refer to from the result
 * @param input The id of the HTML input where the search string is entered
 * @param action A JS function (id, name) to execute on a search result
 */ // TODO: separate setting target, action, etc... from setting data (used for lazy init)
function newSearchBase(id, base, result, target, input, action) {

    if (typeof searchBase === 'undefined') searchBase = {};
    if (typeof searchTarget === 'undefined') searchTarget = {};
    if (typeof resultElement === 'undefined') resultElement = {};
    if (typeof inputField === 'undefined') inputField = {};
    if (typeof resultAction === 'undefined') resultAction = {};

    searchBase[id] = base;
    searchTarget[id] = typeof target !== 'undefined' ? target : null;
    resultElement[id] = typeof result !== 'undefined' ? result : null;
    resultAction[id] = typeof action !== 'undefined' ? action : null;
    inputField[id] = typeof input !== 'undefined' ? input : null;

    bindUpdateActions();
}

/**
 * used to lazily load data to searchBase after calling newSearchBase
 * @param id
 * @param base
 */
function updateSearchBase(id, base) {
    searchBase[id] = base;
}

/**
 * performs the actual text search (linear scan) and propagates result list
 * @param searchBaseId
 * @param needle
 */
function updateResults(searchBaseId, needle) {
    //console.log ("searching for..." + search);

    // TODO: a better way
    var resultList = document.getElementById(resultElement[searchBaseId]);
    $(resultList).empty();

    if (needle.toString().length < 2) {
        return;
    }

    // tokenize needle, to support boolean AND search
    var needles = needle.toString().split(" ");
    var validatedNeedles = [];


    for (var i = 0; i < needles.length; i++) {
        //console.log(needles[i]);
        if (needles[i].length < 2) {
            //return;
        } else {
            validatedNeedles.push(needles[i]);
        }
    }

    $.each(searchBase[searchBaseId], function(i, entry) {
        //console.log(i);
        $.each(entry, function(index, hayStack) {
            //console.log (index);
            if (hayStack == null) {
                //console.log("value null at index: " + index);
                return;
            }
            // prepare hay stack h
            var h = hayStack.toString().toLowerCase();


            var needleOccursAt = {};

            for (var i = 0; i < validatedNeedles.length; i++) {

                var searchFor = validatedNeedles[i].toLowerCase();
                var matchIndex = h.indexOf(searchFor);

                if (matchIndex >= 0) {
                    needleOccursAt[searchFor] = matchIndex;
                    //console.log("Match at: " + needleOccursAt[index] + " for " + value);
                } else {
                    return;
                }
            }

            // logical AND search

            var url = searchTarget[searchBaseId] + entry['id'];
            var message = ""; // "found " + searchBaseId + ": ";
            var linkText = hayStack; //todo highlight

            if (resultAction[searchBaseId] == null && searchTarget[searchBaseId] != null) {
                $("<li>" + message + "<a href='" + url + "'>" + linkText + "</a></li>").appendTo(resultList);
            } else if (resultAction[searchBaseId] != null && searchTarget[searchBaseId] == null) {
                var link = $("<li>" + message + "<a href='#'>" + linkText + "</a></li>");
                link.click(function (e) {
                    e.preventDefault();
                    resultAction[searchBaseId](entry['id'], entry['name']);
                    return false;
                });
                link.appendTo(resultList);

            } else {
                console.log("TODO: result action not implemented yet. Use either JS action or link target");
            }

        });
    });
}

/**
 * binds events to search field: getting focus and entering text to trigger live search
 */
function bindUpdateActions() {

    //console.log(searchBase);

    for (var fieldWrap in inputField) {
        // wrap field in function to not overwrite previous callback creation
        //console.log("Wrapping: " + fieldWrap);
        (function (field) {
            var oldValue = $( field ).val();

            // when user enters search field, delete previous content
            $( inputField[field] ).focus(function(e) {
                $( this ).val("");
            });

            $( inputField[field] ).off("keydown");
            $( inputField[field] ).on('keydown',function(e) {
                oldValue = $( this ).val();
            });
            $( inputField[field] ).off("input propertychange");
            $( inputField[field] ).on('input propertychange',function(e) {
                var newValue = $(this).val();
                // work with what was entered
                // wrapper for each field
                (function (f, n) {
                    // f: searchBaseId console.log(f);
                    // n: current search field value console.log(n);
                    // console.log("Update: " + n);
                    updateResults(f, n);
                }(field, newValue));
                if(newValue.length > limit) {
                    $(this).val(oldValue);
                    alert('String too long.');
                }
            });
        }(fieldWrap));
    }

}
