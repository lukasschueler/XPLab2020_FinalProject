$("document").ready(function() {
    // prevent scrolling when space is pressed
    window.onkeydown = function(e) {
        if (e.keyCode === 32 && e.target === document.body) {
            e.preventDefault();
        }
    };

    window.magpie_monitor = magpieInit({
        views_seq: [
            intro,
            mouse_question,
            hand_question,
            instructions,
            training_categorization,                    
            begin,
            main_categorization,
            capitalIntro,
            capital_categorization,
            post_test,
            thanks,
        ],
        // Here, you can specify all information for the deployment
        deploy: {
            experimentID: "164",
            serverAppURL: "https://magpie-demo.herokuapp.com/api/submit_experiment/",
            // Possible deployment methods are:
            // "debug" and "directLink"
            // As well as "MTurk", "MTurkSandbox" and "Prolific"
            deployMethod: "directLink",
            contact_email: "lukas@newconnexxions.de",
            prolificURL: "https://app.prolific.ac/submissions/complete?cc=SAMPLE1234"
        },
        // Here, you can specify how the progress bar should look like
        progress_bar: {
            in: [],
             // Possible styles are "default", "separate" and "chunks"
            style: "default",
            width: 60
        }
    });
}); 
