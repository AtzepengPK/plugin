export class DataProcessorBar {
    constructor(dataset) {
        this.dataset = dataset;
    }

    transform() {
        console.log("TRANSFORMING BAR")
        console.log(this.dataset)
    }
}