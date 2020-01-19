Eko Delivery Service
===================

 
Web application for compute the delivery cost of certain route, the number of possible delivery route between two towns, and the cost of cheapest delivery route between two towns.

----------

### Installation
Before installing, [download and install Node.js.](https://nodejs.org/en/download/) 

```
git clone https://github.com/jorker1234/ekodelivery.git
```

### Running

use nodejs command for run application
```
node app.js
```
then open web browser http://localhost:3000/ to start Eko Delivery Service

### How to use
#### Calculate the delivery cost
 open web browser http://localhost:3000/

![image](https://drive.google.com/uc?export=view&id=1j8w-VaPDbMU4fZAsFJjYJDXlpBa43759)

* **From Town** (drop down list) - select from town
* **Target Town** (drop down list) - select target town
* **Add Target** (Button) - add more target town
* **x** (delete button) - delete target town (will show when target town is more then 1)
* **Calculate** (Button) - calculate cost from criteria
* **Result** - will show delivery cost in blue box

#### Calculate the number of possible delivery route
open web browser http://localhost:3000/deliveryroute
![image](https://drive.google.com/uc?export=view&id=1EKhsbtwsrYjWtb5FmfRTV8r1FIGTg6g7)

* **From** (drop down list) - select from town
* **To** (drop down list) - select to town
* **Max Stop** (numeric textbox) - number of max stop (0 is no limit max stop)
* **Max Cost** (numeric textbox) - number of max cost (0 is no limit max cost)
* **No. of use the same route** (drop down list) - number of use the same route (default is 1)
* **Enable same to town** (checkbox) - enable/disable can stop when to town (please example note below)
*  **Calculate** (button) - Calculate number of possible from criteria
* **Result** - will show number of possible in blue box , Show more detail from **Show Detail** (Button)
* **Detail List** - will show each delivery route (left) and total cost (right)

```
Note from E to E
1. Disable same to town result is: E-B-E
2. Enable same to town result is: E-B-E-A-D-E
```

```
Example. from E to E and cost is less then 20 and same delivery route
Criteria is
1.From - E
2.To - E
3.Max Stop - 0
4.Max Cost - 19
5.No. of use the same route - 3
6.Enable same to town - On
```
#### Calculate the cheapest delivery route
open web browser http://localhost:3000/deliverycheap
![image](https://drive.google.com/uc?export=view&id=1O-dQ9eUH8J-OnPS7VJGO6z-oZ1RiEzFD)

* **From** (drop down list) - select from town
* **To** (drop down list) - select to town
*  **Calculate** (button) - Calculate cheapest cost from criteria
* **Result** - will show cheapest delivery cost in blue box , Show more detail from **Show Detail** (Button)
* **Detail List** - will show route cheapest cost each step (left) and cost (right)

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
		* **enableSameTo** - enable/disable can stop when to town (Example E-E | off is E-B-E, on is E-B-E-A-D-E)
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
	noOfSameRoute: 1,
	enableSameTo: false,
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
### Authors
* **Watcharpong Rungchomkum**

