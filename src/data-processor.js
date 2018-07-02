import { DataProcessorLine } from './data-processor-line';
import { DataProcessorBar } from './data-processor-bar';
import { DataProcessorAnnotation } from './data-processor-annotation';

export class DataProcessor {
    constructor(panel) {
        this.panel = panel;
        this.maxY = 0;

        this.dataProcessorLine = new DataProcessorLine();
        this.dataProcessorBar = new DataProcessorBar();
        this.dataProcessorAnnotation = new DataProcessorAnnotation();

    }

    transformData(type, dataSet) {

        switch (type) {
            default:
            case "line":
                var data = this.dataProcessorLine.transform(dataSet);
                this.maxY = this.dataProcessorLine.getMaxY();
                return data;
            case "bar":
                return this.dataProcessorBar.transform(dataSet);
            case "annotation":
                return this.dataProcessorAnnotation.transform(dataSet);
        }
    }

    getMaxY() {
        return this.maxY;
    }
}

