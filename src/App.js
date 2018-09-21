import React, { Component } from 'react';
import './App.css';

class App extends Component {

  constructor(props) {
    // The constructor of the class
    super(props);
    this.state = {
      // The JSON data
      data: {
            "grill": {
              "width": 20,
              "height": 15,
              "grillitems": {
                "grillitem": [
                  {
                    "width": 5,
                    "height": 4,
                    "count": 6,
                    "title": "Steak"
                  },
                  {
                    "width": 8,
                    "height": 2,
                    "count": 5,
                    "title": "Sausage"
                  },
                  {
                    "width": 3,
                    "height": 3,
                    "count": 4,
                    "title": "Tomato"
                  },
                  {
                    "width": 4,
                    "height": 3,
                    "count": 8,
                    "title": "Veal"
                  }
                ]
              }
            }
          }
        }
  }

  render() {

    //console.log(this.state.data);
    let objects = this.state.data.grill.grillitems.grillitem;
    let allGrill = this.state.data.grill;

    // Maximize the elements on the grill by the external function
    let theResult = maximizeObjects(allGrill, objects);
    // Count them for a better showing
    let countItems = count(theResult);

    // What's not in the grill
    let notInTheGill = objects.map((item, index) => {
      let objectTimes = item.count - countItems[index].times;
      if (objectTimes > 0) {
        // If have a number let's put it
        return (
          <li key={index}>
            <span className="itemName">{item.title}</span> (<span className="theData">{objectTimes}</span>)
          </li>
        )
      } else {
        // If not, put "none" as a number
        return (
          <li key={index}>
            <span className="itemName">{item.title}</span> (<span className="theData">none</span>)
          </li>
        )
      }
    });

    // Create the propper jsx for showing the results elements
    let showResults = theResult.map((item, index) => {
      return (
        <li key={index}>
          <span className="itemName">{item.title}</span> (Size: <span className="theData">{item.height}x{item.width}</span>)
        </li>
      )
    });

    // Creating the propper jsx for the count elements
    // The same than before
    let showCount = countItems.map((item, index) => {
      return (
        <li key={index}>
          <span className="itemName">{item.item}</span> (<span className="theData">{item.times}</span>)
        </li>
      )
    });

    // The draw
    // I have selected to use svg and not canvas thanks that it's more easy to draw rectangles
    // Important: This can be refactored in a .reduce method and it will be more elegant
    // but I prefeer to make it at the "old way" and then refactor it
    let drawItems = theResult.map((item, index) => {
      // Create some temporal variables for knowing when a new row of components is needed
      // A temporal index of the item, the X and Y position
      let indexTmp = index;
      let posX;
      let posY;
      console.log('posX='+posX+' | posY='+posY+' | index='+index+' | indexTmp='+indexTmp);
      if (item.width*30*index > allGrill.width*30) {
        console.log('se pasa');
        indexTmp = 0 + index;
        posY = item.height*30;
      }
      posX = item.width*30*indexTmp;

      return (
        <rect key={index} width={item.width*30} height={item.height*30} x={posX} y={posY} className={item.title}/>
      )
    });

    return (
      <div className="App">
        <h1>The best to put into the grill</h1>

          <div className="grillCanvas">
            <svg id="grillCanvas" width={allGrill.width*30} height={allGrill.height*30}>
                {drawItems}
            </svg >
          </div>
          <div className="Result">
            <h2>Elements to put on the grill</h2>
            <ul>
              {showResults}
            </ul>
          </div>
          <div className="Count">
            <h2>A resume of the elements on the grill</h2>
            <ul>
              {showCount}
            </ul>
          </div>
          <div className="Lack">
            <h2>What are NOT in the grill</h2>
            <ul>
              {notInTheGill}
            </ul>
          </div>

      </div>
    );
  }
}

export default App;

// Private functions

// Changes XML to JSON (https://davidwalsh.name/convert-xml-json)
// This is not needed because I used the json version
function xmlToJson(xml) {

	// Create the return object
	var obj = {};

	if (xml.nodeType === 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType === 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) === "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) === "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
};

// Function to maximize the objects can be on the grid
function maximizeObjects(grid, objects) {
  // This function will maximize the objects size can be putted on the grill
  // The way it's to use the area of every one and the area of the grill
  // Dividing the sum area of the objects by the area of the grill and
  // trying to go to 1 (witch is the 100% of the grid used)
  // Or in other words, the sum of the area of the objects must be the best
  // approach to the sum of the area of the grill

  // Needs the calculateArea function in order to calculate the area of the
  // object

  // This is the first approximation, it can be refactored in something better

  // Creating the returning array
  let resultArray = [];

  // Let first calculate the area of the grid
  let gridSize = calculateArea(grid);

  // Creating some extra variables like the total of the sum
  let totalSum = 0;
  let beforeSum;

  // Walking through the elements
  for (let i = 0; i < objects.length; i++) {
    // Using the element as a pivote
    for (let j = 0; j < objects[i].count; j++) {
      // Addiding the element
      beforeSum = totalSum;
      totalSum = totalSum + calculateArea(objects[i]);
      if (totalSum > gridSize) {
        // If the sum of the elements are bigger than the size of the grid
        // let's jump to the next (of the for) to know if enters or no
        continue;
      } else {
        totalSum = beforeSum + calculateArea(objects[i]);
      }
      // Add the element
      resultArray.push(objects[i]);
    }
  }

  // Return the result
  return resultArray;
}

// Function to caculate the area of an object
function calculateArea(object) {
  // This function calculates and returns the area of an object
  // Object can be the grid :)
  return object.height * object.width;
}

// Function that calculates the number of times something is on an array
function count(theArray) {
    // theArray = array wich will count repeated elements
    // First, I must create the return array (empty)
    let returnArray = [];
    // And some extra variables
    // Where I am
    let current = null;
    // How many elements
    let cnt = 0;
    for (let i = 0; i < theArray.length; i++) {
        // Walk the array
        if (theArray[i] !== current) {
            // If not the current element
            if (cnt > 0) {
                // If we have cont all the items of theArray
                // Add the item to the returned array
                returnArray.push({
                  "item": current.title,
                  "times": cnt
                });
            }
            // Only one
            current = theArray[i];
            cnt = 1;
        } else {
            // Lets add one element!
            cnt++;
        }
    }
    // If there's only one!
    if (cnt > 0) {
      returnArray.push({
        "item": current.title,
        "times": cnt
      });
    }
    // Return it!
    return returnArray;
}
