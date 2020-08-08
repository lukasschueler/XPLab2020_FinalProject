
/**
 * This is our main view. Here the participant needs to assign a presented word to two given categories, by clicking the respective button. The mouse-cursors movement
 * gets recorded with the help of magpie. At the end we calculate all neccessary information for our analyses from the mousetracking-data
 */
category_choice = function (config) {
    const categorization = {
        name: config.name,
        CT: 0,
        trials: config.trials,

        render: function (CT, magpie) {

            // Manually initializing mousetracking, since custom views have a lot of problems
            // with magPies mousetracking
            //------------------------------------
            if (config.mousetracking != undefined) {
                magpieMousetracking(config.mousetracking, config.data[CT]);
            }
            //------------------------------------

            // Function to randomly assign a competing category
            // If assignment equals the correct categor, try again
            // ----------------------------------------------------------------------------
            typicalMainCategories = ["Bird", "Mammal", "Reptile", "Amphibian", "Insect", "Fish"];
            function assignRandomCategory(excluded) {

                let assignment = _.sample(typicalMainCategories);
                if (assignment.localeCompare(excluded) == 0) {
                    assignment = assignRandomCategory(excluded);
                }

                return assignment;
            }
            // ----------------------------------------------------------------------------




            // Accessing the for the experiment needed values from our configuration data
            //------------------------------------------
            const data = config.data[CT]
            const question = data.question;
            const category_One = data.option1;

            if (data.option2 === undefined) {
                data.option2 = assignRandomCategory(category_One)
            }

            const category_Two = data.option2;
            const correct = data.correct;
            //------------------------------------------

            //Filling our trial_data object with its first attributes
            let trial_data = {
                trial_name: config.name,
                trial_number: CT + 1,
                question: question,
                typicality: data.typicality,
                option1: category_One,
                option2: category_Two,
                correct: correct,
            };

            // To enable a random assignment of each categories location, we just shuffle the selection before allocation 
            //------------------------------------------------
            randomPlacement = [category_One, category_Two];
            randomPlacement = _.shuffle(randomPlacement)
            //------------------------------------------------


            // The HTML-template for the experimemts main view
            const viewTemplate =
                `<div class="magpie-view">
            <link rel="stylesheet" href="01_custom_styles.css">
            
            <button id="upperLeft" class='categoryButton' value = "${randomPlacement[0]}">${randomPlacement[0]}</button>
            <button id="upperRight" class='categoryButton' value = "${randomPlacement[1]}">${randomPlacement[1]}</button>
            <button id = "calibrationButton" >&#9673;</button>
            
            <div id="question">${question}</div><br>
            
            <div id="feedbackIncorrect">Incorrect: The correct category would be <b>${correct}</b></div><br>
            <div id="feedbackCorrect">Correct!</div><br>
            
            </div>`;
            $("#main").html(viewTemplate);
            
            // Fade in of the buttons for a nicer appearance
            $(document).ready(function () {
                $('#upperLeft').fadeIn(1);
                $('#upperRight').fadeIn(1);
                setTimeout(function(){
                    $('#calibrationButton').fadeIn(10);
                 }, 2000);
            });


            
            
            // When the calibrationbutton gets clicked, this function gets started
            // It gathers the trials starting time, the coordinates of the cursors click and with these calls the mousetracking
            // ------------------------------------------------------------------------------------
            function initialize(e) {
                
                // Set up event-handlers for the category selection
                $('#upperLeft').on("click", category_selection);
                $('#upperRight').on("click", category_selection);
                // Gather
                startingTime = Date.now();
                trial_data.startingTime = startingTime;
                trial_data.originX = e.originalEvent.clientX;
                trial_data.originY = e.originalEvent.clientY;

                // Call
                if (config.mousetracking != undefined) {
                    // Origin is at start of mouse position
                    const origin = { x: trial_data.originX, y: trial_data.originY };
                    data.mousetracking.start(origin);
                }

                // Add listener to access data of mousemovement initiation
                document.addEventListener('mousemove', moveListener, false);

                // Change the HTML-Layout
                $('#calibrationButton').hide();
                $('#question').show();

            };
            // ------------------------------------------------------------------------------------



            // This function saves the time the cursors movement after calibration is initiated and cleans up afterwards 
            //----------------------------------------------------------------------------------------
            function moveListener() {

                trial_data.MI = Date.now() - trial_data.startingTime;
                document.removeEventListener('mousemove', moveListener, false);

            };
            //----------------------------------------------------------------------------------------



            /**
             * This function calculates the average vector of the first points measured through the mousetracking and 
             * from that then calculates the for our analyses necessary angle of the mouse-cursors initial movement in degrees
             * @param mousetrackingX An array of the mouse-cursors x-coordinates
             * @param mousetrackingY An array of the mouse-cursors y-coordinates
             * @param numberOfPoints The number of initial measurements taht shall be included in the calculation
             * @returns the mouse-cursors angle of initial movement in degrees
             */
            //-----------------------------------------------------------------------------------------
            function angleOfMovement(mousetrackingX, mousetrackingY, numberOfPoints) {

                // If there are not enough datapoints, take the first quarter of the trajectory
                if (numberOfPoints >= mousetrackingX.length || numberOfPoints >= mousetrackingY.length) {
                    numberOfPoints = mousetrackingX.length / 4;
                }

                // Only take the first datapoints determined by numberOfPoints
                const initialX = mousetrackingX.slice(numberOfPoints)
                const initialY = mousetrackingY.slice(numberOfPoints)

                // Then sum over the respective sliced arrays and divide by their length to get the average
                const reducer = (accumulator, currentValue) => accumulator + currentValue;
                if (initialX.length != 0 || initialY.length != 0) {

                    const avgVectorX = initialX.reduce(reducer) / initialX.length
                    const avgVectorY = initialY.reduce(reducer) / initialY.length

                    // Calculate the angle of the vector in radians using the arcus tangens
                    var angleRad = Math.atan(avgVectorY / avgVectorX);
                    // Convert from radians to degree
                    var angleDeg = angleRad * 180 / Math.PI;

                    return Math.abs(angleDeg);
                }
                return -1;

            }
            //-----------------------------------------------------------------------------------------



            //Get traveled Distance of mouse cursor in pixels
            //-----------------------------------------------------------------------------------------
            function traveledDistance() {
                if (data.mousetrackingX !== undefined) {
                    if (data.mousetrackingX.length === data.mousetrackingY.length) {
                        return data.mousetrackingX.length;
                    }
                }
                return -1;
            }
            //-----------------------------------------------------------------------------------------



            // This fucntion is the response to the partcipants selection of a category
            // It just gathers the recorded data and saves it on our trial_data object
            //---------------------------------------------------------------------------------------------------
            const category_selection = function (e) {
                data.mousetracking.cleanup();
                const endingTime = Date.now();

                const RT = endingTime - startingTime;
                trial_data.RT = RT;

                let correctness = "Incorrect";
                let answer = $(this).val();

                // Check the correctness of the selection and if in training, give a short feedback
                if (answer === correct) {
                    correctness = "Correct";
                    if (config.name === 'training') {
                        $('#feedbackCorrect').toggle();
                    }
                } else {
                    correctness = "Incorrect"
                    if (config.name === 'training') {
                        $('#feedbackIncorrect').toggle();
                    }
                }

                // Magpies y-values in mousetracking, all have the wrong sign. 
                // This we correct with a short mapping
                const mousetrackingY_revised = data.mousetrackingY.map(x => x * (-1));


                // Push all left data onto the trial_data object
                trial_data.correctness = correctness;
                trial_data.response = answer;
                trial_data.mousetrackingX = data.mousetrackingX;
                trial_data.mousetrackingY = mousetrackingY_revised;
                trial_data.mousetrackingStartTime = data.mousetrackingStartTime;
                trial_data.mousetrackingTime = data.mousetrackingTime;
                trial_data.mousetrackingDuration = data.mousetrackingDuration;


                // Get the cursors movement direction derived by the first numberOfPoints measurements
                // This number was not supplied by the original-experiment and is thus arbitrary
                const numberOfPoints = 29;
                trial_data.movementDirection = angleOfMovement(data.mousetrackingX, data.mousetrackingY, numberOfPoints);

                // Get the mouse-cursors traveled distance
                trial_data.traveledDistance = traveledDistance();

                // Push the trial_data to magpie
                magpie.trial_data.push(trial_data);

                //In trainig trials make delay to accomodate feedback
                if (config.name === 'training') {
                    setTimeout(magpie.findNextView, 1000);
                } else {
                    magpie.findNextView();
                }
            };
            //---------------------------------------------------------------------------------------------------

            // Eventlisteners for the calibration-button
            $('#calibrationButton').on("click", initialize);
        }
    };
    return categorization;
};
