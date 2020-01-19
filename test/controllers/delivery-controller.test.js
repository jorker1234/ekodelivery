const controller = require("../../controllers/delivery-controller");

class ResponseMockup {
    send(output) {
        this.data = output;
    }
}

const getRequestMockup = (data) => {
    return {
        body : data
    }
}

const isValidRoutes = (from, to, routes) =>{
    for(let i = 0; i < routes.length; i++){
        const routeSteps = routes[i];
        if(routeSteps[0].from !== from){
            return false;
        }
        let stepTo = routeSteps[0].to;
        for(let j = 0; j < routeSteps.length; j++){
            const route = routeSteps[j];
            if(j === routeSteps.length - 1 && route.to !== to){
                return false;
            }
            if(j === 0){
                continue;
            }
            if(route.from !== stepTo){
                return false;
            }
            stepTo = route.to;
            
        }
    }
    return true;
}

const getMaxStop = (routes) => {
    const maxStop = routes.reduce((max, o) => { return max > o.length ? max : o.length}, 0);
    return maxStop;
}

const getMaxCost = (routes) => {
    let maxCost = 0;
    for(let i = 0; i < routes.length; i++){
        const routeSteps = routes[i];
        const totalCost = routeSteps.reduce((total, o) => { return total + o.cost}, 0);
        if(totalCost > maxCost){
            maxCost = totalCost;
        };
    }
    return maxCost;
}

describe("1. Test calculate delivery cost", () => {
    test('No send data has error', () => {
        const req = getRequestMockup(null);
        const res = new ResponseMockup();
        controller.getCostDelivery(req, res);
        expect(res.data.hasError).toBeTruthy();
    });

    test('Send null has error', () => {
        const req = getRequestMockup({targets: null});
        const res = new ResponseMockup();
        controller.getCostDelivery(req, res);
        expect(res.data.hasError).toBeTruthy();
    });

    test('Send [] has error', () => {
        const req = getRequestMockup({targets: []});
        const res = new ResponseMockup();
        controller.getCostDelivery(req, res);
        expect(res.data.hasError).toBeTruthy();
    });

    test('Send ["A"] has error', () => {
        const req = getRequestMockup({targets: ["A"]});
        const res = new ResponseMockup();
        controller.getCostDelivery(req, res);
        expect(res.data.hasError).toBeTruthy();
    });

    test('Send [1, 2] has error', () => {
        const req = getRequestMockup({targets: [1, 2]});
        const res = new ResponseMockup();
        controller.getCostDelivery(req, res);
        expect(res.data.hasError).toBeTruthy();
    });

    test('Send ["A","B","E"] equal 4', () => {
      const req = getRequestMockup({targets: ["A", "B", "E"]});
      const res = new ResponseMockup();
      controller.getCostDelivery(req, res);
      expect(res.data.hasError).toBeFalsy();
      expect(res.data.cost).toBe(4);
    });

    test('Send ["A","D"] equal 10', () => {
        const req = getRequestMockup({targets: ["A", "D"]});
        const res = new ResponseMockup();
        controller.getCostDelivery(req, res);
        expect(res.data.hasError).toBeFalsy();
        expect(res.data.cost).toBe(10);
    });

    test('Send ["E","A", "C", "F"] equal 8', () => {
        const req = getRequestMockup({targets: ["E", "A", "C", "F"]});
        const res = new ResponseMockup();
        controller.getCostDelivery(req, res);
        expect(res.data.hasError).toBeFalsy();
        expect(res.data.cost).toBe(8);
    });

    test('Send ["A","D", F"] has error', () => {
        const req = getRequestMockup({targets: ["A", "D", "F"]});
        const res = new ResponseMockup();
        controller.getCostDelivery(req, res);
        expect(res.data.hasError).toBeTruthy();
    });
});

describe("2. Test calculate number of possible delivery route", () => {
    test('No send data has error', () => {
        const req = getRequestMockup(null);
        const res = new ResponseMockup();
        controller.getPosibleDelivery(req, res);
        expect(res.data.hasError).toBeTruthy();
    });

    test('Send null has error', () => {
        const req = getRequestMockup({criteria: null});
        const res = new ResponseMockup();
        controller.getPosibleDelivery(req, res);
        expect(res.data.hasError).toBeTruthy();
    });

    test('Send {from: "A"} has error', () => {
        const criteria = {
            from: "A",
        }
        const req = getRequestMockup(criteria);
        const res = new ResponseMockup();
        controller.getPosibleDelivery(req, res);
        expect(res.data.hasError).toBeTruthy();
    });

    test('Send {to: "A"} has error', () => {
        const criteria = {
            to: "A",
        }
        const req = getRequestMockup(criteria);
        const res = new ResponseMockup();
        controller.getPosibleDelivery(req, res);
        expect(res.data.hasError).toBeTruthy();
    });

    test('Send {from: "E", to: "D"} equal 6', () => {
        const criteria = {
            from: "E",
            to: "D",
        }
        const req = getRequestMockup(criteria);
        const res = new ResponseMockup();
        controller.getPosibleDelivery(req, res);
        expect(res.data.hasError).toBeFalsy();
        expect(res.data.routes.length).toBe(6);
    });

    test('Send {from: "E", to: "D"} route is valid', () => {
        const criteria = {
            from: "E",
            to: "D",
        }
        const req = getRequestMockup(criteria);
        const res = new ResponseMockup();
        controller.getPosibleDelivery(req, res);
        expect(res.data.hasError).toBeFalsy();
        expect(isValidRoutes(criteria.from, criteria.to, res.data.routes)).toBeTruthy();
    });

    test('Send {from: "E", to: "E"} equal 5', () => {
        const criteria = {
            from: "E",
            to: "E",
        }
        const req = getRequestMockup(criteria);
        const res = new ResponseMockup();
        controller.getPosibleDelivery(req, res);
        expect(res.data.hasError).toBeFalsy();
        expect(res.data.routes.length).toBe(5);
    });

    test('Send {from: "E", to: "E"} route is valid', () => {
        const criteria = {
            from: "E",
            to: "E",
        }
        const req = getRequestMockup(criteria);
        const res = new ResponseMockup();
        controller.getPosibleDelivery(req, res);
        expect(res.data.hasError).toBeFalsy();
        expect(isValidRoutes(criteria.from, criteria.to, res.data.routes)).toBeTruthy();
    });

    test('Send {from: "E", to: "D", maxStop: "A"} has error', () => {
        const criteria = {
            from: "E",
            to: "D",
            maxStop: "A",
        }
        const req = getRequestMockup(criteria);
        const res = new ResponseMockup();
        controller.getPosibleDelivery(req, res);
        expect(res.data.hasError).toBeTruthy();
    });

    test('Send {from: "E", to: "D", maxStop: -1} has error', () => {
        const criteria = {
            from: "E",
            to: "D",
            maxStop: -1,
        }
        const req = getRequestMockup(criteria);
        const res = new ResponseMockup();
        controller.getPosibleDelivery(req, res);
        expect(res.data.hasError).toBeTruthy();
    });

    test('Send {from: "E", to: "D", maxStop: 4} equal 6', () => {
        const criteria = {
            from: "E",
            to: "D",
            maxStop: 4,
        }
        const req = getRequestMockup(criteria);
        const res = new ResponseMockup();
        controller.getPosibleDelivery(req, res);
        expect(res.data.hasError).toBeFalsy();
        expect(res.data.routes.length).toBe(4);
    });

    test('Send {from: "E", to: "D", maxStop: 4} route is valid', () => {
        const criteria = {
            from: "E",
            to: "D",
            maxStop: 4,
        }
        const req = getRequestMockup(criteria);
        const res = new ResponseMockup();
        controller.getPosibleDelivery(req, res);
        expect(res.data.hasError).toBeFalsy();
        expect(getMaxStop(res.data.routes)).toBeLessThanOrEqual(criteria.maxStop);
        expect(isValidRoutes(criteria.from, criteria.to, res.data.routes)).toBeTruthy();
    });
    
    test('Send {from: "E", to: "D", maxCost: "A"} has error', () => {
        const criteria = {
            from: "E",
            to: "D",
            maxCost: "A",
        }
        const req = getRequestMockup(criteria);
        const res = new ResponseMockup();
        controller.getPosibleDelivery(req, res);
        expect(res.data.hasError).toBeTruthy();
    });

    test('Send {from: "E", to: "D", maxCost: -1} has error', () => {
        const criteria = {
            from: "E",
            to: "D",
            maxCost: -1,
        }
        const req = getRequestMockup(criteria);
        const res = new ResponseMockup();
        controller.getPosibleDelivery(req, res);
        expect(res.data.hasError).toBeTruthy();
    });

    test('Send {from: "E", to: "D", maxCost: 12} equal 3', () => {
        const criteria = {
            from: "E",
            to: "D",
            maxCost: 12,
        }
        const req = getRequestMockup(criteria);
        const res = new ResponseMockup();
        controller.getPosibleDelivery(req, res);
        expect(res.data.hasError).toBeFalsy();
        expect(res.data.routes.length).toBe(3)
    });

    test('Send {from: "E", to: "D", maxCost: 12} route is valid', () => {
        const criteria = {
            from: "E",
            to: "D",
            maxCost: 12,
        }
        const req = getRequestMockup(criteria);
        const res = new ResponseMockup();
        controller.getPosibleDelivery(req, res);
        expect(res.data.hasError).toBeFalsy();
        expect(getMaxCost(res.data.routes)).toBeLessThanOrEqual(criteria.maxCost);
        expect(isValidRoutes(criteria.from, criteria.to, res.data.routes)).toBeTruthy();
    });

    test('Send {from: "E", to: "E", noOfSameRoute: "A"} has error', () => {
        const criteria = {
            from: "E",
            to: "E",
            noOfSameRoute: "A",
        }
        const req = getRequestMockup(criteria);
        const res = new ResponseMockup();
        controller.getPosibleDelivery(req, res);
        expect(res.data.hasError).toBeTruthy();
    });

    test('Send {from: "E", to: "D", noOfSameRoute: -1} has error', () => {
        const criteria = {
            from: "E",
            to: "E",
            noOfSameRoute: -1,
        }
        const req = getRequestMockup(criteria);
        const res = new ResponseMockup();
        controller.getPosibleDelivery(req, res);
        expect(res.data.hasError).toBeTruthy();
    });

    test('Send {from: "E", to: "E", noOfSameRoute: 2} equal 30', () => {
        const criteria = {
            from: "E",
            to: "E",
            noOfSameRoute: 2,
        }
        const req = getRequestMockup(criteria);
        const res = new ResponseMockup();
        controller.getPosibleDelivery(req, res);
        expect(res.data.hasError).toBeFalsy();
        expect(res.data.routes.length).toBe(30)
    });
});

describe("3. Test calculate the cheapest delivery route between two town", () => {
    test('No send data has error', () => {
        const req = getRequestMockup(null);
        const res = new ResponseMockup();
        controller.getCheapestDelivery(req, res);
        expect(res.data.hasError).toBeTruthy();
    });

    test('Send {} has error', () => {
        const criteria = {

        };
        const req = getRequestMockup(criteria);
        const res = new ResponseMockup();
        controller.getCheapestDelivery(req, res);
        expect(res.data.hasError).toBeTruthy();
    });

    test('Send {from: "A"} has error', () => {
        const criteria = {
            from: "A",
        }
        const req = getRequestMockup(criteria);
        const res = new ResponseMockup();
        controller.getCheapestDelivery(req, res);
        expect(res.data.hasError).toBeTruthy();
    });

    test('Send {to: "A"} has error', () => {
        const criteria = {
            to: "A",
        }
        const req = getRequestMockup(criteria);
        const res = new ResponseMockup();
        controller.getCheapestDelivery(req, res);
        expect(res.data.hasError).toBeTruthy();
    });

    test('Send {from: 1, to: 0} has error', () => {
        const criteria = {
            from: 1,
            to: 0,
        }
        const req = getRequestMockup(criteria);
        const res = new ResponseMockup();
        controller.getCheapestDelivery(req, res);
        expect(res.data.hasError).toBeTruthy();
    });

    test('Send {from: "E", to: "D"} equal 9', () => {
        const criteria = {
            from: "E",
            to: "D",
        }
        const req = getRequestMockup(criteria);
        const res = new ResponseMockup();
        controller.getCheapestDelivery(req, res);
        expect(res.data.hasError).toBeFalsy();
        expect(res.data.cost).toBe(9);
    });

    test('Send {from: "E", to: "D"} route is valid', () => {
        const criteria = {
            from: "E",
            to: "D",
        }
        const req = getRequestMockup(criteria);
        const res = new ResponseMockup();
        controller.getCheapestDelivery(req, res);
        expect(res.data.hasError).toBeFalsy();
        expect(isValidRoutes(criteria.from, criteria.to, [res.data.route])).toBeTruthy();
    });

    test('Send {from: "E", to: "E"} equal 6', () => {
        const criteria = {
            from: "E",
            to: "E",
        }
        const req = getRequestMockup(criteria);
        const res = new ResponseMockup();
        controller.getCheapestDelivery(req, res);
        expect(res.data.hasError).toBeFalsy();
        expect(res.data.cost).toBe(6);
    });

    test('Send {from: "E", to: "E"} route is valid', () => {
        const criteria = {
            from: "E",
            to: "E",
        }
        const req = getRequestMockup(criteria);
        const res = new ResponseMockup();
        controller.getCheapestDelivery(req, res);
        expect(res.data.hasError).toBeFalsy();
        expect(isValidRoutes(criteria.from, criteria.to, [res.data.route])).toBeTruthy();
    });
});
