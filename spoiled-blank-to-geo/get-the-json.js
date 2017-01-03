var data = require('./_spoiled')

var fs = require('fs');
var log_file = fs.createWriteStream(__dirname + '/_json_data_sum.json', {flags : 'w'});

var deleg = 'Beja Sud';
var spoiled = 0, canceled = 0, blank = 0, SigningVoters = 0 ;
var obj ={}
var tab = [];
for (i in data){
	if (data[i].deleg_name == deleg){
		spoiled+=Number(data[i].cSpoiledBallots);
		canceled+=Number(data[i].kCancelledVotes);
		blank+=Number(data[i].lBlankVotes);
		SigningVoters+=Number(data[i].SigningVoters);

	}else{
		/*when the delegation name changes*/

		
/*-----------create the obj-----------*/
		obj.delegation = deleg;
		
		destrict = data[i].circ_name
		obj.destrict = destrict;

		delegationId = data[i].delegationId
		obj.delegationId = delegationId;

		destrictId = data[i].circonscriptionId
		obj.destrictId = destrictId;
/*-------------------Calculate the percentege---------------------*/
		canceledPercentage = (canceled *100 )/SigningVoters;
		blankPercentage = (blank *100 )/SigningVoters;
		spoiledPercentege = (spoiled *100 )/SigningVoters;
/*----------------------------------------------------------------*/
		obj.spoiled = spoiled;
		obj.canceled = canceled;
		obj.blank = blank;
		obj.SigningVoters = SigningVoters;
		//percentege obj
		obj.canceledPercentage=canceledPercentage.toFixed(2)
		obj.blankPercentage=blankPercentage.toFixed(2)
		obj.spoiledPercentege=spoiledPercentege.toFixed(2)
/*----------------------------------------*/
		tab.push(obj); //append the obj to the array
		deleg = data[i].deleg_name //init with the next cityname
		/*-----------------------------------*/
		/*//start a new percentege somme for the next city*/
		spoiled=Number(data[i].cSpoiledBallots);
		canceled=Number(data[i].kCancelledVotes);
		blank=Number(data[i].lBlankVotes);
		SigningVoters=Number(data[i].SigningVoters);
		/*-----------------------------------*/
		obj = {} //prepare new obj for the next city
	}
}


log_file.write(JSON.stringify(tab))
