// --------------------------------------------------------------WRAPPING VIEWS-------------------------------------------------------------------

// An introduction to our experiment
const intro = magpieViews.view_generator("intro", {
  trials: 1,
  name: 'intro',
  text: `Welcome to our experiment!
            <br />
            <br />
            This experiment is divided in two parts. In the first one you will be shown the name of an animal and afterwards you need to choose the category that suits this animal best <b>as fast as possible</b>.
            In the second part you do the same , but with city-names.
            <br />
            <br />
            Don't worry, this experiment is really simple and to get you started, we will properly instruct you and then start with a little practice session.`,
  buttonText: 'Instructions'
});


// First instructions for our participants
const instructions = magpieViews.view_generator("instructions", {
  trials: 1,
  name: 'instructions',
  title: `Let's get you started`,
  text: `
  <br />
  <br />
  The experiments set-up is quite simple:
  <br />

  Before the beginning of each trial you press the little red button at the bottom of your screen. 
  <br />
  <br />
  Afterwards the button will disappear and just above your cursor the word in question will appear. Immediately after that, two catgeories in the upper left and right corner respectively will be visible. 
  <br />
  <br />

  You simply need to pick the correct category <b>as fast as you can</b>. 
  <br />
  That's already it! Let's begin with a short practice. 
  `,
  buttonText: 'Start practice'
});

// Let the participant indicate its cursor device
const mouse_question = magpieViews.view_generator('forced_choice', {
  trials: 1,
  name: 'mouse_question',
  title: 'Technical information',
  data: [
    {
      question: 'Are you using a mouse or a touch pad in this experiment?',
      option1: 'Mouse',
      option2: 'Touch Pad'
    }
  ]
})

// Let the partcipant indicate her strong hand
const hand_question = magpieViews.view_generator('forced_choice', {
  trials: 1,
  name: 'hand_question',
  title: 'Strong hand',
  data: [
    {
      question: 'Are you using your left or right hand in this experiment?',
      option1: 'Left',
      option2: 'Right'
    }
  ]
})

// Transition view to the main trials
const begin = magpieViews.view_generator("begin", {
  trials: 1,
  name: "begin",
  buttonText: "Start with main trials",
  title: "Ready to begin!",
  text: "Now after the practice, we think you're ready for the main trials!"
});

// Transition view to the capital trials
const capitalIntro = magpieViews.view_generator("instructions", {
  trials: 1,
  name: 'capitalIntro',
  text: `Alright, this was a lot. Take a short rest and again try to focus. You are almost through. Now were are done with the animals and can come to the second part of this experiment.
            <br />
            <br />
            But don't worry, this part is way shorter than the first one. In part two you simply need to categorize city-names into capital and non-capital cities.
            <br />
            <br />
            Let's start!`,
  buttonText: 'Part Two'
});

// Post test questionnaire
const post_test = magpieViews.view_generator("post_test", {
  trials: 1,
  name: 'post_test',
  title: 'Additional information',
  text: 'Answering the following questions is not mandatory, but your answers will greatly help us analyze our results.',
  
  age_question: 'Alter',
  gender_question: 'Geschlecht',
  gender_male: 'männlich',
  gender_female: 'weiblich',
  languages_question: 'Muttersprache',
});

// Mandatory thank you view, for data gathering
const thanks = magpieViews.view_generator("thanks", {
  trials: 1,
  name: 'thanks',
  title: 'Thank you for participating in our experiment!',
  prolificConfirmText: 'Press the button'
});


//--------------------------------MAIN VIEWS---------------------------------------------

const training_categorization  = category_choice({
  trials: trials.training_trials.length,
  name: 'training',
  data: _.shuffle(trials.training_trials),
  mousetracking: {
    rate: 90, 
},

});

const main_categorization  = category_choice({
  trials: trials.main_trials.length,
  name: 'main',
  data: _.shuffle(trials.main_trials),
  mousetracking: {
    rate: 90, 
},

});

const capital_categorization  = category_choice({
  trials: trials.exploration_trials.length,
  name: 'exploration',
  data: _.shuffle(trials.exploration_trials),
  mousetracking: {
    rate: 90, 
},

});
