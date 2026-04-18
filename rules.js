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
    create(key) {
        let locationData = key ? this.engine.storyData.Locations[key] : this.engine.storyData.Locations[this.engine.storyData.InitialLocation]; 
        currentLocation = key || this.engine.storyData.InitialLocation;
        this.engine.visitedLocations.add(currentLocation);
        this.engine.setCurrLocation(currentLocation.replace(/_/g, ' '));
        this.engine.show(locationData.Body); 
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
        if(choice) {
            this.engine.show("&gt; "+choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }

    handleDiscover(discover) {
        console.log(discover.Interacted)
        discover.Interacted = true;
        console.log(discover.Interacted)
        
        if (discover) {
            this.engine.show("&gt; "+discover.Option);
            this.engine.show(discover.Result);
        }
            this.engine.gotoScene(Location, currentLocation);
        
    }

}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');