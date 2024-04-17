class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title); // TODO: replace this text using this.engine.storyData to find the story title
        this.engine.addChoice("Begin your journey");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); // TODO: replace this text by the initial location of the story
    }
}

let retrievedKeys = 0;
let subLocation = false;
let openedTombs = 0;

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key]; // TODO: use `key` to get the data object for the current story location
        console.log(key);
        console.log(retrievedKeys);
        console.log(subLocation);

        // Location Specific Mechanic that changes the location after you attack skeleton
        if(locationData == this.engine.storyData.Locations.Attack) {
            subLocation = true;
            console.log("subLocation is " + subLocation);
        } else if(subLocation == true) {
            // Makes original location into new location with new choices
            if(locationData == this.engine.storyData.Locations.RightRoom) {
                locationData = locationData.NewRightRoom;
                for(let choice of locationData.NewChoices) {
                    this.engine.addChoice(choice.Text, choice);
                }
            }
        }

        // Replace original location with new location after attack (sublocation ==)
        if(locationData == this.engine.storyData.Locations.NewRightRoom & subLocation == true) {
            return;
        } else if(locationData == this.engine.storyData.Locations.NewHallway) {
            this.engine.addChoice("The end");
        }

        this.engine.show(locationData.Body); // TODO: replace this text by the Body of the location data
        if(locationData.Choices) { // TODO: check if the location has any Choices
            for(let choice of locationData.Choices) { // TODO: loop over the location's Choices
                this.engine.addChoice(choice.Text, choice); // TODO: use the Text of the choice
                // TODO: add a useful second argument to addChoice so that the current code of handleChoice below works
            }
        }
        
        // Location Specific Mechanism that tracks how many tombs you've opened and shows new text
        if(locationData == this.engine.storyData.Locations.OpenTombs) {
            openedTombs = openedTombs + 1;
            if(openedTombs >= 9) {
                // Guilt text is shown after more than 9 tombs are opened in the location
                this.engine.show(locationData.GuiltText);
            }
        }
        
        // Lock and Key puzzle for the Crypt Entrance
        // Checks to see if the player's current location matches the location where they get the key
        if(locationData == this.engine.storyData.Locations.GotKey) {
            // Variable tracks that player has a key on them
            retrievedKeys = retrievedKeys + 1;
            console.log(retrievedKeys + " New key");
            // Else if checks if player has a key
         } else if(retrievedKeys > 0) {
            if(locationData == this.engine.storyData.Locations.CryptEntrance) {
                console.log("You have the key!");
                // Creates a new choice for an unlocked door to go into the next area
                for(let lock of locationData.Locks) {
                    this.engine.addChoice(lock.Text, lock);
                } 
            }   
        }
    } 

    handleChoice(choice) {
        if(choice) {
            this.engine.show("&gt; "+choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.creditsShow(this.engine.storyData.Credits);
        this.engine.creditsShow(this.engine.storyData.Music);
    }
}

Engine.load(Start, 'myStory.json');