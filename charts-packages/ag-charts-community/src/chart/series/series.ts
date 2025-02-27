import { Group } from "../../scene/group";
import { LegendDatum } from "../legend";
import { Observable, reactive } from "../../util/observable";
import { ChartAxis, ChartAxisDirection } from "../chartAxis";
import { Chart } from "../chart";
import { createId } from "../../util/id";

/**
 * Processed series datum used in node selections,
 * contains information used to render pie sectors, bars, markers, etc.
 */
export interface SeriesNodeDatum {
    // For example, in `sectorNode.datum.seriesDatum`:
    // `sectorNode` - represents a pie slice
    // `datum` - contains metadata derived from the immutable series datum and used
    //           to set the properties of the node, such as start/end angles
    // `seriesDatum` - raw series datum, an element from the `series.data` array
    readonly series: Series;
    readonly seriesDatum: any;
    readonly point?: { // in local (series) coordinates
        readonly x: number;
        readonly y: number;
    }
}

export interface TooltipRendererParams {
    readonly datum: any;
    readonly title?: string;
    readonly color?: string;
}

export interface CartesianTooltipRendererParams extends TooltipRendererParams {
    readonly xKey: string;
    readonly xValue: any;
    readonly xName?: string;

    readonly yKey: string;
    readonly yValue: any;
    readonly yName?: string;
}

export interface PolarTooltipRendererParams extends TooltipRendererParams {
    readonly angleKey: string;
    readonly angleValue: any;
    readonly angleName?: string;

    readonly radiusKey?: string;
    readonly radiusValue?: any;
    readonly radiusName?: string;
}

export interface HighlightStyle {
    fill?: string;
    stroke?: string;
}

export class SeriesTooltip extends Observable {
    @reactive('change') enabled = true;
}

export abstract class Series extends Observable {

    readonly id = createId(this);

    get type(): string {
        return (this.constructor as any).type || '';
    }

    /**
     * The group node that contains all the nodes used to render this series.
     */
    readonly group: Group = new Group();

    // Package-level visibility, not meant to be set by the user.
    chart?: Chart;
    xAxis: ChartAxis;
    yAxis: ChartAxis;

    directions: ChartAxisDirection[] = [ChartAxisDirection.X, ChartAxisDirection.Y];
    directionKeys: { [key in ChartAxisDirection]?: string[] };

    /**
     * @deprecated Use {@link tooltip.enabled} instead.
     */
    tooltipEnabled: boolean = true;
    tooltip: SeriesTooltip;

    @reactive('dataChange') data?: any[] = undefined;
    @reactive('dataChange') visible = true;
    @reactive('layoutChange') showInLegend = true;

    cursor = 'default';

    setColors(fills: string[], strokes: string[]) { }

    /**
     * Returns the actual keys used (to fetch the values from `data` items) for the given direction.
     */
    getKeys(direction: ChartAxisDirection): string[] {
        const { directionKeys } = this;
        const keys = directionKeys && directionKeys[direction];
        const values: string[] = [];

        if (keys) {
            keys.forEach(key => {
                const value = (this as any)[key];

                if (value) {
                    if (Array.isArray(value)) {
                        values.push(...value);
                    } else {
                        values.push(value);
                    }
                }
            });
        }

        return values;
    }

    abstract getDomain(direction: ChartAxisDirection): any[];

    abstract processData(): boolean;
    abstract update(): void;

    abstract getTooltipHtml(seriesDatum: any): string;

    // Returns node data associated with the rendered portion of the series' data.
    getNodeData(): SeriesNodeDatum[] {
        return [];
    }

    fireNodeClickEvent(event: MouseEvent, datum: SeriesNodeDatum): void {}

    /**
     * @private
     * Populates the given {@param data} array with the items of this series
     * that should be shown in the legend. It's up to the series to determine
     * what is considered an item. An item could be the series itself or some
     * part of the series.
     * @param data
     */
    abstract listSeriesItems(data: LegendDatum[]): void;

    toggleSeriesItem(itemId: any, enabled: boolean): void {
        this.visible = enabled;
    }

    // Each series is expected to have its own logic to efficiently update its nodes
    // on hightlight changes.
    onHighlightChange() {}

    readonly scheduleLayout = () => {
        this.fireEvent({ type: 'layoutChange' });
    }

    readonly scheduleData = () => {
        this.fireEvent({ type: 'dataChange' });
    }

    protected fixNumericExtent(extent?: [number | Date, number | Date], type?: string): [number, number] {
        if (!extent) {
            // if (type) {
            //     console.warn(`The ${type}-domain could not be found (no valid values), using the default of [0, 1].`);
            // }
            return [0, 1];
        }

        let [min, max] = extent;

        if (min instanceof Date) {
            min = min.getTime();
        }
        if (max instanceof Date) {
            max = max.getTime();
        }

        if (min === max) {
            const padding = Math.abs(min * 0.01);
            min -= padding;
            max += padding;
            // if (type) {
            //     console.warn(`The ${type}-domain has zero length and has been automatically expanded`
            //         + ` by 1 in each direction (from the single valid ${type}-value: ${min}).`);
            // }
        }

        if (!isFinite(min) || !isFinite(max)) {
            min = 0;
            max = 1;
            // if (type) {
            //     console.warn(`The ${type}-domain has infinite length, using the default of [0, 1].`);
            // }
        }

        return [min, max];
    }
}
