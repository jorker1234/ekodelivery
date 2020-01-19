const Route = require('../entities/Route');

const routes = [
    new Route("A", "B", 1),
    new Route("A", "C", 4),
    new Route("A", "D", 10),
    new Route("B", "E", 3),
    new Route("C", "D", 4),
    new Route("C", "F", 2),
    new Route("D", "E", 1),
    new Route("E", "B", 3),
    new Route("E", "A", 2),
    new Route("F", "D", 1),
];


let cheapRoute = null;
let cheapCost = 0;

const setCheapestDelivery = (from, to, steps = []) => {
    const routeList  = routes.filter(o => o.from === from);
    if(routeList.length === 0){
        return
    }
    for(let i = 0; i < routeList.length; i++){
        const route = routeList[i];
        const newSteps = [...steps, route];
        const totalCost = newSteps.reduce((total, o) => { return total + o.cost}, 0);
        const isDuplicateRoute = newSteps.filter(o => o === route).length > 1;
        if(!isDuplicateRoute && (cheapCost === 0 || totalCost < cheapCost)){
            if(route.to === to){
                cheapRoute = newSteps;
                cheapCost = totalCost;
            }else {
                setCheapestDelivery(route.to, to, newSteps);
            }
        }
    }
}
const getCheapestDelivery = (req, res) => {
    const result = {
        hasError: true,
        cost: 0,
        route: null,
    };
    if(!req.body || !req.body.from || !req.body.to){
        res.send(result);
        return;
    }

    const from = req.body.from;
    const to = req.body.to;
    cheapRoute = null;
    cheapCost = 0;
    setCheapestDelivery(from, to);
    result.hasError = cheapRoute == null;
    result.cost = cheapCost;
    result.route = cheapRoute;
    res.send(result);
}

module.exports.getCheapestDelivery = getCheapestDelivery;


const getCost= (targets) => {
    if(!targets || targets.length < 2){
        return null;
    }
    let cost = 0;
    for(let i = 0; i < targets.length - 1; i++){
        const from = targets[i];
        const to = targets[i + 1];
        const route = routes.find(o => o.from === from && o.to === to);
        if(!route){
            return null;
        }
        cost += route.cost;
    }
    return cost;
}

const getCostDelivery = (req, res) => {
    const result = {
        hasError: true,
        cost: 0,
    };
    if(!req.body || !req.body.targets){
        res.send(result);
        return;
    }

    const targets = req.body.targets;
    const cost = getCost(targets);
    result.hasError = cost == null;
    result.cost = cost;
    res.send(result);
}

module.exports.getCostDelivery = getCostDelivery;

const getDirectRoutes = (criteria, steps = [], results = []) => {
    const routeList = routes.filter(o => o.from === criteria.from);
    if(routeList.length === 0 || (criteria.maxStop > 0 && steps.length >= criteria.maxStop)){
        return
    }
    const totalCost = steps.reduce((total, o) => { return total + o.cost}, 0);
    for(let i = 0; i < routeList.length; i++){
        const route = routeList[i];
        const newSteps = [...steps, route];

        const noOfSameRoute = newSteps.filter(o => o === route).length;
        
        if(noOfSameRoute > criteria.noOfSameRoute){
            continue;
        }
        if(criteria.maxCost > 0 && totalCost + route.cost > criteria.maxCost){
            continue;
        }
        
        if(route.to === criteria.to){
            results.push(newSteps);
            if(!criteria.enableSameTo){
                continue;
            }
        }

        const newCriteria = {
            from: route.to,
            to: criteria.to,
            maxStop: criteria.maxStop,
            maxCost: criteria.maxCost,
            noOfSameRoute: criteria.noOfSameRoute,
            enableSameTo: criteria.enableSameTo,
        }
        getDirectRoutes(newCriteria, newSteps, results);
    }
    return results;
}

const getPosibleDelivery = (req, res) => {
    const result = {
        hasError: true,
        routes: null,
    };
    if(!req.body || !req.body.from || !req.body.to){
        res.send(result);
        return;
    }

    const from = req.body.from;
    const to = req.body.to;
    const maxStop = req.body.maxStop || 0;
    const maxCost = req.body.maxCost || 0;
    const noOfSameRoute = req.body.noOfSameRoute || 1;
    const enableSameTo = req.body.enableSameTo || false;
    if(isNaN(maxStop) || isNaN(maxCost) || isNaN(noOfSameRoute) || maxStop < 0 || maxCost < 0 || noOfSameRoute < 0|| typeof(enableSameTo) != "boolean"){
        res.send(result);
        return;
    }
    const criteria = {
        from: from,
        to: to,
        maxStop: maxStop,
        maxCost: maxCost,
        noOfSameRoute: noOfSameRoute,
        enableSameTo: enableSameTo,
    }
    const routes = getDirectRoutes(criteria);
    result.hasError = routes == null || routes.length === 0;
    result.routes = routes;
    res.send(result);
}

module.exports.getPosibleDelivery = getPosibleDelivery;