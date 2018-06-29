import { DataProcessorLine } from './data-processor-line';
import { DataProcessorBar } from './data-processor-bar';
import { DataProcessorAnnotation } from './data-processor-annotation';

export class DataProcessor {
    constructor(panel) {
        this.panel = panel;
        this.maxY = 0;
    }

    transformData(type, dataSet) {

        switch (type) {
            default:
            case "line":
                var dataProcessorLine = new DataProcessorLine(dataSet);
                var data = dataProcessorLine.transform();
                this.maxY = dataProcessorLine.getMaxY();
                return data;
            case "bar":
                return new DataProcessorBar(dataSet).transform();
            case "annotation":
                return new DataProcessorAnnotation(dataSet, this.panel).transform();
        }
    }

    getMaxY() {
        return this.maxY;
    }
}

