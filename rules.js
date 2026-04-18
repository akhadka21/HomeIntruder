let currentLocation = null;


class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title); 
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); 
    }


}

class Location extends Scene {
    create(key, showBody = true) {
        let locationData = key ? this.engine.storyData.Locations[key] : this.engine.storyData.Locations[this.engine.storyData.InitialLocation]; 
        currentLocation = key || this.engine.storyData.InitialLocation;
        this.engine.visitedLocations.add(currentLocation);
        if (showBody) {
            this.engine.setCurrLocation(currentLocation.replace(/_/g, ' '));
            this.engine.show(locationData.Body); 
        }
        if(locationData.Choices) { 
            for(let choice of locationData.Choices) { 
                this.engine.addChoice(choice.Text, choice); 
            }
            if(locationData.Discover) {
                for(let discover of locationData.Discover) {
                    this.engine.addDiscover(discover.Option, discover);
                }
            }

        } else {
            this.engine.addChoice("The end.")
        }
    }

    handleChoice(choice) {
        this.engine.clearText();
        choice.Travelled = true;
        console.log(choice);
        console.log("lantern: " + this.engine.GameWorldItem.hasLantern + ", book key: " + this.engine.GameWorldItem.hasBookKey + ", vault key: " + this.engine.GameWorldItem.hasVaultKey);
        console.log("------------------");
        if (this.engine.GameWorldItem.carouselStatus) {
            let rooms = Object.keys(this.engine.storyData.Locations).filter(room => room !== currentLocation);
            let randomTarget = rooms[Math.floor(Math.random() * rooms.length)];
            this.engine.show("The carousel spins you away to a different room...");
            this.engine.gotoScene(Location, randomTarget);
            
            
        }
        else if (choice){
            switch(choice.Target) {
                case "Basement":
                    if(this.engine.GameWorldItem.hasLantern) {
                        this.engine.gotoScene(Location, choice.Target);
                    }
                    else {
                        this.engine.show("The basement is pitch black, you can't see anything. You need a light source to enter the basement.");
                        this.create(currentLocation, false); 
                    }
                    break;
                case "Garage":
                    if(this.engine.GameWorldItem.hasBookKey){
                        this.engine.gotoScene(Location, choice.Target);
                    }
                    else {
                        this.engine.show("The door appears to be locked. You need a key to enter the garage.");
                        this.create(currentLocation, false);
                    }
                    break;
                case "Vault":
                    if(this.engine.GameWorldItem.hasVaultKey){
                        this.engine.gotoScene(Location, choice.Target);
                    }
                    else {
                        this.engine.show("The door appears to be locked. You need a key to enter the vault.");
                        this.create(currentLocation, false);
                    }
                    break;
                default:
                    this.engine.gotoScene(Location, choice.Target);
            }
        }
        else {
            this.engine.gotoScene(End);
        }
        
    }

    handleDiscover(discover) {
        if(discover.Option == "Look under the car") {
            this.engine.GameWorldItem.hasVaultKey = true;
        }
        if(discover.Option == "Look at the table") {
            this.engine.GameWorldItem.hasLantern = true;
        }

        if(discover.Option == "Look at the bookshelf") {
            this.engine.GameWorldItem.hasBookKey = true;
        }

        if(discover.Option == "Play with the carousel toy") {
            this.engine.GameWorldItem.carouselStatus = true;
        }

        discover.Interacted = true;
        
        if (discover) {
            this.engine.show("&gt; "+discover.Option);
            this.engine.show(discover.Result);
        }
        this.create(currentLocation, false); 
    }

}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');