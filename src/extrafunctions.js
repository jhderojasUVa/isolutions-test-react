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
  // This function will maximize the objects can be putted on the grid
  // The way it's to use the area of every one and the area of the grid
  // Dividing the sum area of the objects by the area of the grid and
  // trying to go to 1 (witch is the 100% of the grid used)

  let resultArray = [];

  // Let first calculate the area of the grid
  let gridSize = calculateArea(grid);

  /*for (let i = 0; i < objects.length; i++) {
    console.log(objects[i]);
    console.log(object[i].reduce())
  }*/
  let totalSum = 0;
  let beforeSum;

  for (let i = 0; i < objects.length; i++) {
    for (let j = 0; j < objects[i].count; j++) {
      totalSum = totalSum + calculateArea(objects[i]);
      console.log('totalSum = '+ totalSum);
      if (totalSum > gridSize) {
        console.log('break!');
        continue;
      }
      resultArray.push(objects[i]);
      beforeSum = totalSum;
      console.log('Fin = '+ beforeSum +' | i = '+ i +' | j = '+ j);
    }
  }

  console.log('Finished!');
  console.log(resultArray);

  /*objects.forEach((object) => {
    for (let i = 0; i < object.count; i++) {
      totalSum = totalSum + calculateArea(object);
      console.log(totalSum);
      if (totalSum > calculateArea(grid)) {
        console.log('supera');
      } else {
        console.log('no supera');
      }
    }
  });*/

}

// Function to caculate the area of an object
function calculateArea(object) {
  // This function calculates and returns the area of an object
  // Object can be the grid :)
  return object.height * object.width;
}
