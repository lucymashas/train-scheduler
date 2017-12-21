
 $( document ).ready(function() {

 var config = {
    apiKey: "AIzaSyBWOx2t16X3Lz-djYYmQRVY8upBSWBildM",
    authDomain: "train-scheduler-lnm.firebaseapp.com",
    databaseURL: "https://train-scheduler-lnm.firebaseio.com",
    projectId: "train-scheduler-lnm",
    storageBucket: "train-scheduler-lnm.appspot.com",
    messagingSenderId: "100173439602"
  };
  firebase.initializeApp(config);

var database = firebase.database();  

    
	$("#addTrain").on("click",function(){
		event.preventDefault();
		
		//input information from form
		var trainName = $("#trainName").val().trim();
		var finalDestination = $("#destination").val().trim();
		var firstTrain = $("#firstTraintime").val().trim();
		var trainFrequency = $("#frequency").val().trim();
		
		currentTime=(moment());

		// First Time (pushed back 1 year to make sure it comes before current time)
    	var firstTrainConverted = moment(firstTrain, "hh:mm").subtract(1, "years");

    	//difference between the first train and current time
		var diff = moment().diff(moment(firstTrainConverted),"minutes");

		//divide diff by frequency
		var remainder = diff % trainFrequency;
		var	minutesAway = trainFrequency - remainder;
		var	nextArrival = moment(currentTime,'hh:mm').add(minutesAway,'minutes').format('hh:mm');
		console.log(nextArrival);
		
		//creates local object
		var trainSchedule = {
			train: trainName,
			destination: finalDestination,
			tFrequency: trainFrequency,
			narrival: nextArrival,
			minAway: minutesAway
		};

	//upload train info to the database
		database.ref().push(trainSchedule);

		console.log(trainSchedule.train);
		console.log(trainSchedule.destination);
		console.log(trainSchedule.tFrequency);
		console.log(trainSchedule.narrival);
		console.log(trainSchedule.minAway);

		//Clear textboxes
		$("#traindata").trigger("reset");
	});



	database.ref().on("child_added", function(childSnapshot, prevChildKey) {
	var trainName = childSnapshot.val().train;
	var finalDestination = childSnapshot.val().destination;
	var trainFrequency = childSnapshot.val().tFrequency;
	var nextArrival = childSnapshot.narrival;
	var minutesAway = childSnapshot.val().minAway;

	var tbltemplate = `<tr>
	     <td>${trainName}</td>
	     <td>${finalDestination}</td>
	     <td>${trainFrequency}</td>
	     <td>${moment().add(minutesAway,'minutes').format('hh:mm')}</td>
	     <td>${minutesAway}</td>
	     </tr>`

	$("#trainscheduler > tbody").append(tbltemplate);

	}, function(errorObject) {
	console.log("Errors handled: " + errorObject.code);
	});
	

});




