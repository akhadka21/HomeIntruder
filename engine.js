class Engine {

    static load(...args) {
        window.onload = () => new Engine(...args);
    }

    constructor(firstSceneClass, storyDataUrl) {

        this.firstSceneClass = firstSceneClass;
        this.storyDataUrl = storyDataUrl;

        this.header = document.body.appendChild(document.createElement("h1"));
        this.output = document.body.appendChild(document.createElement("div"));

        this.choiceTitle = document.body.appendChild(document.createElement("h2"));
        this.choiceTitle.innerText = "Choices";
        this.choicesContainer = document.body.appendChild(document.createElement("div"));

        this.discoverTitle = document.body.appendChild(document.createElement("h2"));
        this.discoverTitle.innerText = "Discoveries";
        this.discoversContainer = document.body.appendChild(document.createElement("div"));

        this.currLocationTitle = document.body.appendChild(document.createElement("h2"));
        this.currLocationTitle.innerText = "Current Location";
        this.currLocationContainer = document.body.appendChild(document.createElement("div"));

        this.visitedLocations = new Set();

        fetch(storyDataUrl).then(
            (response) => response.json()
        ).then(
            (json) => {
                this.storyData = json;
                this.gotoScene(firstSceneClass)
            }
        );
    }

    gotoScene(sceneClass, data) {
        this.scene = new sceneClass(this);
        this.scene.create(data);
    }

    clearActions() {
        [this.choicesContainer, this.discoversContainer].forEach(container => {
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
        });
    }

    addChoice(action, data) {
        let button = this.choicesContainer.appendChild(document.createElement("button"));
        button.className = "choice-button";
        if (data && (data.Travelled || (data.Target && this.visitedLocations.has(data.Target)))) {
            button.classList.add("travelled");
        }
        button.innerText = action;
        button.onclick = () => {
            this.clearActions();
            this.scene.handleChoice(data);
        }
    }

    addDiscover(action, data) {
        let button = this.discoversContainer.appendChild(document.createElement("button"));
        button.className = "discover-button";
        if (data && data.Interacted) {
            button.classList.add("interacted");
        }
        button.innerText = action;
        button.onclick = () => {
            this.clearActions();
            this.scene.handleDiscover(data);
        }
    }


    setCurrLocation(location) {
        this.currLocationTitle.innerText = `Current Location: ${location}`;
    }

    setTitle(title) {
        this.header.innerText = title;
    }
    

    show(msg) {
        let div = document.createElement("div");
        div.innerHTML = msg;
        this.output.appendChild(div);
    }

    clearText(){
        while (this.output.firstChild) {
            this.output.removeChild(this.output.firstChild);
        }
    }

}

class Scene {
    constructor(engine) {
        this.engine = engine;
    }

    create() { }

    update() { }

    handleChoice(action) {
        console.warn('no choice handler on scene ', this);
    }
    handleDiscover(action) {
        console.warn('no discover handler on scene ', this);
    }

}