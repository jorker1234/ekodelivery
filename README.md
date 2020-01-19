Eko Delivery Service
===================

 
Web application for compute the delivery cost of certain route, the number of possible delivery route between two towns, and the cost of cheapest delivery route between two towns.

----------

###Installation
Before installing, [download and install Node.js.](https://nodejs.org/en/download/) 

```
python -m trax.trainer --config_file=$PWD/trax/configs/mlp_mnist.gin
```

### Running

use nodejs command for run application
```
node app.js
```
then open web browser http://localhost:3000/ to start Eko Delivery Service

### File Structure
* **controllers/** - controller for main logic
* **models/** - class for entity
* **test/** - unit tests for controllers
* **views/** - pages and layout folder
* **app.js** - first file start for control router

### Page Structure
* http://localhost:3000 - for calculate delivery cost of certain route.
* http://localhost:3000/deliveryroute - for calculate the number of possible delivery route between two towns.
* http://localhost:3000/deliverycheap - for calculate the cost of cheapest delivery route between two towns.

### Api Structure
* http://localhost:3000/api/deliveryCost - for calculate delivery cost of certain route.
	* Method: POST
	* Input: 
		* **targets** - multiple towns.
	* Output
		* **hasError** - has error.
		* **cost** - total cost of delivery route.
```
Input Example
{
	targets: ["A", "B", "E"]
}

Output Example
{
	hasError: false,
	cost: 4
}
```

 * http://localhost:3000/api/deliveryPosible - for calculate the number of possible delivery route between two towns.
	* Method: POST
	* Input: 
		* **from** - from town.
		* **to** - to town.
		* **maxStop** - no. of max stop. default is 0. (0 is mean no max stop)
		* **maxCost** - no. of max cost delivery route. default is 0. (0 is mean no max cost)
		* **noOfSameRoute** - no. of use the same route. default is 1.
	* Output
		* **hasError** - has error.
		* **routes** - all routes of possible delivery route between two towns.
```
Input Example
{
	from: "E",
	to: "D",
	maxStop: 4,
	maxCost: 0,
	noOfSameRoute: 1
}

Output Example
{
	hasError: false,
	routes: [
		[
			{from: "E", to: "A", cost: 2}, ...
		],
		...
	]
}
```	

 * http://localhost:3000/api/deliveryCheap - for calculate the cost of cheapest delivery route between two towns.
	* Method: POST
	* Input: 
		* **from** - from town.
		* **to** - to town.
	* Output
		* **hasError** - has error.
		* **cost** - cheapest cost of delivery route.
		* **route** - cheapest route.
```
Input Example
{
	from: "E",
	to: "D",
}

Output Example
{
	hasError: false,
	cost: 9,
	route: [
		{from: "E", to: "A", cost: 2}, ...
	]
}
```	

### Unit tests
use jest for test controller
```
npm test
```
###Authors
* **Watcharpong Rungchomkum**

