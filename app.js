//LIB INIT
var qv = require("quartzserver")
var _ = require("underscore")

//SERVER INIT
server = new qv.server()

//AUDIO INIT
var totalPeak = undefined
var peakCnt = 0
var timer = undefined

//OPTIONS
var outPoints = [{"X": 0,"Y": 0,"Z": 0}];
var options = { newPath : true, snakeSize : 1, maxSize : 1400, length : 0.3}

//DEFINE
var smartExtend = function (objects,callback) {
    var ignore = {}
    return _.reduce( objects, function (memo,obj) {
        _.map(obj, function (val,key) {
            if (!memo[key] && !ignore[key]) {
                if (!(memo[key] = callback(key, _.filter( _.pluck(objects,key), _.identity)))) { ignore[key] = true }
            }
        })
        return memo
        
    }, {})
}



//CUBE.json
var popThree = function (input){
			return {"X": input.pop(), "Y": input.pop(), "Z": input.pop()}
		}




function makeObject(v) {
	var parseV = function (list, scale) {
		var resultList = []
		while (list.length){
			resultList.push(popThree(list))
		}
		return resultList
	}

	data = parseV(v)

	tempData = _.clone(data)

	return function(options) {
		/*
		index = Math.floor(tempData.length*Math.random());
		res = tempData[index]
		tempData.splice(index,1)
		*/
		
		if (!tempData.length) {
			data.unshift(data.pop())

			tempData = _.clone(data)
			
		}
		return tempData.pop()

	}

}

var drawCube = makeObject([-4.07656,-0.795651,-0.410529,-3.9264,-0.725067,-0.198684,-4.26039,-0.941944,-0.654938,-4.59941,-1.01196,-1.00671,-4.64572,-1.11249,-1.0066,-4.22393,-1.34788,-0.510455,-3.98572,-0.148321,-0.251441,-4.26037,-0.941944,-0.646124,-4.22194,-0.042952,-0.60705,-4.41824,-0.461657,-0.822042,-4.55554,-0.84243,-1.10378,-4.65138,-1.32113,-1.05065,-4.49112,-1.7653,-0.683152,-3.44404,0.17188,-0.278127,-3.78833,0.152127,-0.389783,-4.24415,0.332536,-0.662852,-4.47605,-0.213455,-0.979295,-4.63516,-0.715003,-1.31175,-4.85783,-1.32777,-1.23801,-4.51031,-2.05543,-0.728792,-3.71216,0.609601,-0.264805,-3.92906,0.469691,-0.461376,-4.52212,0.579379,-0.971034,-4.76255,0.288811,-1.48631,-4.96734,-0.523703,-1.53941,-5.15309,-1.51684,-1.40483,-4.83061,-2.43947,-0.697556,-4.19267,1.18967,-0.227118,-4.26131,1.735,-0.178229,-4.30655,1.82811,-0.417861,-4.82906,1.2044,-0.964224,-5.10418,1.21811,-1.47942,-5.9512,1.00802,-2.4826,-4.83336,1.44511,-0.605452,-4.33429,2.10683,-0.923455,-4.77164,2.12739,-1.72658,-5.66968,1.57414,-2.33974,-4.78017,1.57842,-0.971114,-4.8608,1.60863,-1.47048,-5.2167,1.4903,-1.8839,-4.43303,1.02264,-0.423632,-4.83239,1.3482,-0.605452,-5.31255,1.38297,-1.8871,-5.99932,-0.380493,-2.30457,-5.93032,-1.45882,-1.88548,-5.65602,-2.28336,-1.06112,-7.52728,-0.36412,-2.52755,-7.20576,-1.36079,-2.0652,-6.67827,-2.1828,-1.24144,-7.50326,1.04179,-2.78594,-3.80732,-0.755569,0.00155,-4.07459,-0.795631,0.414913,-3.92545,-0.725058,0.20235,-3.89953,-0.235447,0.001758,-4.25725,-0.941913,0.660205,-4.59458,-1.01191,1.0136,-4.6409,-1.11244,1.01371,-4.22148,-1.34786,0.515569,-3.98858,-1.40528,0.001999,-3.98451,-0.148309,0.255362,-4.25727,-0.941913,0.651391,-4.21903,-0.042922,0.61209,-4.4143,-0.461618,0.828039,-4.55025,-0.842377,1.11045,-4.64634,-1.32107,1.0578,-4.48784,-1.76527,0.689561,-4.23748,-1.70166,0.002601,-3.29875,0.134623,0.000314,-3.44271,0.171893,0.279445,-3.78646,0.152146,0.392745,-4.24097,0.332568,0.66798,-4.47136,-0.213408,0.985554,-4.62888,-0.71494,1.31879,-4.8519,-1.32771,1.24614,-4.50681,-2.0554,0.735305,-4.15575,-2.18186,0.002417,-3.61175,0.660744,0.001049,-3.71089,0.609613,0.267383,-3.92685,0.469713,0.464995,-4.51747,0.579425,0.977475,-4.75543,0.288882,1.4939,-4.95997,-0.523629,1.54803,-5.14635,-1.51677,1.41438,-4.82726,-2.43944,0.705619,-4.60984,-2.66946,0.003513,-4.19157,1.18969,0.231964,-4.08475,1.27325,0.002165,-4.1763,1.72374,0.002373,-4.26044,1.73501,0.183378,-4.30454,1.82813,0.423219,-4.82443,1.20444,0.972102,-5.09709,1.21818,1.4886,-5.9393,1.00814,2.49584,-4.83045,1.44514,0.613343,-4.32986,2.10687,0.928926,-4.76337,2.12747,1.73413,-5.65848,1.57425,2.3516,-4.77551,1.57846,0.978741,-4.85375,1.6087,1.47849,-5.20768,1.49039,1.8936,-4.431,1.02266,0.429632,-4.82948,1.34823,0.613343,-5.30351,1.38306,1.89727,-5.98828,-0.380383,2.3181,-5.92128,-1.45873,1.89873,-5.65093,-2.28331,1.07311,-5.26665,-2.66812,0.005082,-7.51516,-0.363999,2.54837,-7.19585,-1.36069,2.08454,-6.6723,-2.18274,1.25832,-6.0514,-2.53353,0.006954,-7.4899,1.04192,2.80659])



function makeMetaPointer(functions) {
	var currentF

	var metaPointer = function (options) {
		if (!currentF) { currentF = randomWalk(options)}
		point = currentF(options)

		if (!point) {
			currentF = undefined
			return metaPointer(options)
		} else {
			return point
		}
	}	
}

//options.nextPoint = makeMetaPointer([drawCube, randomWalk])

var randomWalk = function (options) {
	//ovo returna
	//return {"X": Math.random()*2*length-length, "Y": Math.random()*2*length-length , "Z": Math.random()*2*length-length}
    
	var length = options.length
	var choices = [
        
		{"X": +length*Math.sqrt(3)/2, "Y": +length*Math.sqrt(3)/2, "Z": -length*Math.sqrt(3)/2},
		{"X": +length*Math.sqrt(3)/2, "Y": +length*Math.sqrt(3)/2, "Z": -length*Math.sqrt(3)/2},
		{"X": -length*Math.sqrt(3)/2, "Y": +length*Math.sqrt(3)/2, "Z": -length*Math.sqrt(3)/2},
		{"X": -length*Math.sqrt(3)/2, "Y": +length*Math.sqrt(3)/2, "Z": -length*Math.sqrt(3)/2},
		{"X": -length*Math.sqrt(3)/2, "Y": -length*Math.sqrt(3)/2, "Z": -length*Math.sqrt(3)/2},
		{"X": -length*Math.sqrt(3)/2, "Y": -length*Math.sqrt(3)/2, "Z": -length*Math.sqrt(3)/2},
		{"X": +length*Math.sqrt(3)/2, "Y": -length*Math.sqrt(3)/2, "Z": -length*Math.sqrt(3)/2},
		{"X": +length*Math.sqrt(3)/2, "Y": -length*Math.sqrt(3)/2, "Z": -length*Math.sqrt(3)/2},
        
		{"X": +length, "Y": 0 , "Z": 0},
		{"X": -length, "Y": 0 , "Z": 0},
		{"X": 0, "Y": +length,"Z" : 0},
		{"X": 0, "Y": -length,"Z" : 0},
		{"X": 0, "Y": 0 ,"Z": +length},
		{"X": 0, "Y": 0 ,"Z": -length}
	]

	var lastChoice = Math.floor(choices.length*Math.random())
	var newMerge = [options.lastPoint, choices[lastChoice]]
    
	return smartExtend(newMerge, function (key,values) {
		return _.reduce(values, function (memo,x) { return memo + x }, 0)
	})
    
    
}

options.nextPoint = randomWalk

//RUN
server.on ("msg", function (msg) {
	msg = msg.split(" ");
	peak = Number(msg[0])

	if (!timer && peakCnt) {
		var waitTime = (1 - totalPeak) * 200
		console.log(waitTime)
	
		timer = setTimeout(function(){
			timer = undefined
			draw()
		}, waitTime)

		totalPeak = undefined
		peakCnt = 0

	} else {
		if (!peakCnt) { totalPeak = peak } else {
			totalPeak = (totalPeak - (totalPeak / peakCnt)) + (peak / peakCnt)
		}

		peakCnt++
		}

})

function draw () {
	outPoints.push(options.nextPoint(options))
	options.lastPoint = _.last(outPoints)
	if (outPoints.length > options.maxSize) { outPoints.shift() }
	server.send(outPoints);
}


