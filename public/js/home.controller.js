angular.module('strainKeeper')
  .controller('homeController', homeController);

homeController.$inject = ['strainFactory'];

function homeController(strainFactory) {
  var home = this;
  // home.greeting = "WTF!";
  home.displayStrains = [];
  // home.allStrains = [];
  var viewWidth = $(window).width();

    strainFactory.getStrains()
    .then(function(res) {
      // home.allStrains = res.data;
      home.homeStrains = res.data;

      // home.filteredStrains = [];

      // Merge and get rid of duplicate strains
      var seen = {};
    home.homeStrains = home.homeStrains.filter(function(strain) {
      var previous;

      // Have we seen this strain before?
      if (seen.hasOwnProperty(strain.dataName)) {
         // Yes, grab it and add this data to it
         previous = seen[strain.dataName];
         for (var i = 0; i < strain.goodEffects.length; i++){
           previous.goodEffects.push(strain.goodEffects[i]);
        }
        for (var i = 0; i < strain.badEffects.length; i++){
          previous.badEffects.push(strain.badEffects[i]);
       }
         previous.rating.push(strain.rating);
         // Don't keep this strain, we've merged it into the previous one
         return false;
     }

     // strain.rating probably isn't an array; make it one for consistency
     if (!Array.isArray(strain.rating)) {
       strain.rating = [strain.rating];
     }

     // Remember that we've seen it
     seen[strain.dataName] = strain;

     // Keep this one, we'll merge any others that match into it
     return true;
 });
// FUNCTION USED IN STRAIN EFFECT ARRAYS TO DETERMINE IF IT IS A POSITIVE OR NEGATIVE EFFECT
 function checkToSeeIfGood(effectName) {
   if (effectName === "Dry Mouth" || effectName === "Red Eyes" || effectName === "Paranoid" || effectName === "Anxious" || effectName === "Tired" || effectName === "Foggy") {
     return true;
   } else {
     return false;
   }
 }

      // THIS LOOP IS TO ADD AVERAGE RATING AND EFFECTS-ARRAY TO EACH STRAIN
      for (var i = 0; i < home.homeStrains.length; i++){
        // Create an avgRating property on each strain using reduce function
        home.homeStrains[i].avgRating = home.homeStrains[i].rating.reduce(function(a, b){return a+b;}, 0) / home.homeStrains[i].rating.length;

          // Declare new effects objects
          var goodEffectsObj = {
              happy : 0,
              hungry : 0,
              energetic : 0,
              relaxed : 0,
              creative : 0,
              flavorful : 0
            }

            var badEffectsObj = {
                dryMouth : 0,
                redEyes : 0,
                paranoid : 0,
                anxious : 0,
                tired : 0,
                foggy : 0
              }

        // Go through each GOOD effect and add 1 to each variable for each effect
        home.homeStrains[i].goodEffects.forEach(function(element){

          switch (element){
            case "Happy":
              goodEffectsObj.happy++;
              break;
            case "Hungry":
              goodEffectsObj.hungry++;
              break;
            case "Energetic":
              goodEffectsObj.energetic++;
              break;
            case "Relaxed":
              goodEffectsObj.relaxed++;
              break;
            case "Creative":
              goodEffectsObj.creative++;
              break;
            case "Flavorful":
              goodEffectsObj.flavorful++;
              break;
          }
        })

        // Go through each bad effect and add 1 to each variable for each effect
        home.homeStrains[i].badEffects.forEach(function(element){

          switch (element){
            case "Dry Mouth":
              badEffectsObj.dryMouth++;
              break;
            case "Red Eyes":
              badEffectsObj.redEyes++;
              break;
            case "Paranoid":
              badEffectsObj.paranoid++;
              break;
            case "Anxious":
              badEffectsObj.anxious++;
              break;
            case "Tired":
              badEffectsObj.tired++;
              break;
            case "Foggy":
              badEffectsObj.foggy++;
              break;
          }
        })

                  // Total up the number of good effects that were chosen for that strain
                  var goodEffectsVotes = Object.values(goodEffectsObj).reduce(function(a, b){return a+b;});

                  // Total up the number of bad effects that were chosen for that strain
                  var badEffectsVotes = Object.values(badEffectsObj).reduce(function(a, b){return a+b;});

                  var effectsVotesSum = goodEffectsVotes + badEffectsVotes;

                  var happyPercent = Math.round((goodEffectsObj.happy/effectsVotesSum)*100);
                  var hungryPercent = Math.round((goodEffectsObj.hungry/effectsVotesSum)*100);
                  var energeticPercent = Math.round((goodEffectsObj.energetic/effectsVotesSum)*100);
                  var relaxedPercent = Math.round((goodEffectsObj.relaxed/effectsVotesSum)*100);
                  var creativePercent = Math.round((goodEffectsObj.creative/effectsVotesSum)*100);
                  var flavorfulPercent = Math.round((goodEffectsObj.flavorful/effectsVotesSum)*100);

                  var dryMouthPercent = Math.round((badEffectsObj.dryMouth/effectsVotesSum)*100);
                  var redEyesPercent = Math.round((badEffectsObj.redEyes/effectsVotesSum)*100);
                  var paranoidPercent = Math.round((badEffectsObj.paranoid/effectsVotesSum)*100);
                  var anxiousPercent = Math.round((badEffectsObj.anxious/effectsVotesSum)*100);
                  var tiredPercent = Math.round((badEffectsObj.tired/effectsVotesSum)*100);
                  var foggyPercent = Math.round((badEffectsObj.foggy/effectsVotesSum)*100);


                  home.homeStrains[i].effectsArray = [{
                    effectName: 'Happy',
                    percent: happyPercent,
                    value: goodEffectsObj.happy,
                    isBad: checkToSeeIfGood('Happy')
                  }, {
                    effectName: 'Hungry',
                    percent: hungryPercent,
                    value: goodEffectsObj.hungry,
                    isBad: checkToSeeIfGood('Hungry')
                  }, {
                    effectName: 'Energetic',
                    percent: energeticPercent,
                    value: goodEffectsObj.energetic,
                    isBad: checkToSeeIfGood('Energetic')
                  }, {
                    effectName: 'Relaxed',
                    percent: relaxedPercent,
                    value: goodEffectsObj.relaxed,
                    isBad: checkToSeeIfGood('Relaxed')
                  }, {
                    effectName: 'Creative',
                    percent: creativePercent,
                    value: goodEffectsObj.creative,
                    isBad: checkToSeeIfGood('Creative')
                  }, {
                    effectName: 'Flavorful',
                    percent: flavorfulPercent,
                    value: goodEffectsObj.flavorful,
                    isBad: checkToSeeIfGood('Flavorful')
                  }, {
                    effectName: 'Dry Mouth',
                    percent: dryMouthPercent,
                    value: badEffectsObj.dryMouth,
                    isBad: checkToSeeIfGood('Dry Mouth')
                  }, {
                    effectName: 'Red Eyes',
                    percent: redEyesPercent,
                    value: badEffectsObj.redEyes,
                    isBad: checkToSeeIfGood('Red Eyes')
                  }, {
                    effectName: 'Paranoid',
                    percent: paranoidPercent,
                    value: badEffectsObj.paranoid,
                    isBad: checkToSeeIfGood('Paranoid')
                  }, {
                    effectName: 'Anxious',
                    percent: anxiousPercent,
                    value: badEffectsObj.anxious,
                    isBad: checkToSeeIfGood('Anxious')
                  }, {
                    effectName: 'Tired',
                    percent: tiredPercent,
                    value: badEffectsObj.tired,
                    isBad: checkToSeeIfGood('Tired')
                  }, {
                    effectName: 'Foggy',
                    percent: foggyPercent,
                    value: badEffectsObj.foggy,
                    isBad: checkToSeeIfGood('Foggy')
                  }
                ];

      }

      // ASSIGN STRAINS TO DISPLAY TO exploreStrains ARRAY
      home.exploreStrains = [];
      for (var i =0; i < home.homeStrains.length; i++){
        home.exploreStrains.push(home.homeStrains[i]);
      }

      // if statement to deteremine how many strains to show on landing page depending on device width
      if (viewWidth < 675) {

        for (var i = 0; i < 2; i++){
          var displayStrain = home.homeStrains.splice(getRandomInt(0, home.homeStrains.length), 1);
          home.displayStrains.push(displayStrain[0]);
        }

      } else if (viewWidth < 1335) {

        for (var i = 0; i < 3; i++){
          var displayStrain = home.homeStrains.splice(getRandomInt(0, home.homeStrains.length), 1);
          home.displayStrains.push(displayStrain[0]);
        }

      } else if (viewWidth < 1650) {

        for (var i = 0; i < 4; i++){
          var displayStrain = home.homeStrains.splice(getRandomInt(0, home.homeStrains.length), 1);
          home.displayStrains.push(displayStrain[0]);
        }

      } else {

        for (var i = 0; i < 5; i++){
          var displayStrain = home.homeStrains.splice(getRandomInt(0, home.homeStrains.length), 1);
          home.displayStrains.push(displayStrain[0]);
        }

      }

  }, function(err) {
      console.error(err);
  });


  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }









}
