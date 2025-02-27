import { DragAndDropService, DraggingEvent, DragSourceType, DropTarget } from "../dragAndDrop/dragAndDropService";
import { Autowired, PostConstruct } from "../context/context";
import { MoveColumnController } from "./moveColumnController";
import { BodyDropPivotTarget } from "./bodyDropPivotTarget";
import { ColumnController } from "../columnController/columnController";
import { Constants } from "../constants/constants";
import { BeanStub } from "../context/beanStub";
import { ControllersService } from "../controllersService";
import { RowContainerController } from "../gridBodyComp/rowContainer/rowContainerController";

export interface DropListener {
    getIconName(): string | null;
    onDragEnter(params: DraggingEvent): void;
    onDragLeave(params: DraggingEvent): void;
    onDragging(params: DraggingEvent): void;
    onDragStop(params: DraggingEvent): void;
}

enum DropType { ColumnMove, Pivot }

export class BodyDropTarget extends BeanStub implements DropTarget {

    @Autowired('dragAndDropService') private dragAndDropService: DragAndDropService;
    @Autowired('columnController') private columnController: ColumnController;
    @Autowired('controllersService') private controllersService: ControllersService;

    private pinned: string | null;
    // public because it's part of the DropTarget interface
    private eContainer: HTMLElement;
    // public because it's part of the DropTarget interface
    private eSecondaryContainers: HTMLElement[];
    private dropListeners: { [type: number]: DropListener; } = {};
    private currentDropListener: DropListener;
    private moveColumnController: MoveColumnController;

    constructor(pinned: string | null, eContainer: HTMLElement) {
        super();
        this.pinned = pinned;
        this.eContainer = eContainer;
    }

    @PostConstruct
    private postConstruct(): void {
        this.controllersService.whenReady(p => {
            let containers: RowContainerController[];
            switch (this.pinned) {
                case Constants.PINNED_LEFT:
                    containers = [p.leftRowContainerCon, p.bottomLeftRowContainerCon, p.topLeftRowContainerCon];
                    break;
                case Constants.PINNED_RIGHT:
                    containers = [p.rightRowContainerCon, p.bottomRightRowContainerCon, p.topRightRowContainerCon];
                    break;
                default:
                    containers = [p.centerRowContainerCon, p.bottomCenterRowContainerCon, p.topCenterRowContainerCon];
                    break;
            }
            this.eSecondaryContainers = containers.map(c => c.getContainerElement());
        });
    }

    public isInterestedIn(type: DragSourceType): boolean {
        return type === DragSourceType.HeaderCell ||
            (type === DragSourceType.ToolPanel && this.gridOptionsWrapper.isAllowDragFromColumnsToolPanel());
    }

    public getSecondaryContainers(): HTMLElement[] {
        return this.eSecondaryContainers;
    }

    public getContainer(): HTMLElement {
        return this.eContainer;
    }

    @PostConstruct
    private init(): void {

        this.moveColumnController = this.createBean(new MoveColumnController(this.pinned, this.eContainer));

        const bodyDropPivotTarget = new BodyDropPivotTarget(this.pinned);
        this.createBean(bodyDropPivotTarget);

        this.dropListeners[DropType.ColumnMove] = this.moveColumnController;
        this.dropListeners[DropType.Pivot] = bodyDropPivotTarget;

        this.dragAndDropService.addDropTarget(this);
    }

    public getIconName(): string | null {
        return this.currentDropListener.getIconName();
    }

    // we want to use the bodyPivotTarget if the user is dragging columns in from the toolPanel
    // and we are in pivot mode, as it has to logic to set pivot/value/group on the columns when
    // dropped into the grid's body.
    private getDropType(draggingEvent: DraggingEvent): DropType {
        if (this.columnController.isPivotMode()) {
            // in pivot mode, then if moving a column (ie didn't come from toolpanel) then it's
            // a standard column move, however if it came from the toolpanel, then we are introducing
            // dimensions or values to the grid
            if (draggingEvent.dragSource.type === DragSourceType.ToolPanel) {
                return DropType.Pivot;
            }

            return DropType.ColumnMove;
        }

        // it's a column, and not pivot mode, so always moving
        return DropType.ColumnMove;
    }

    public onDragEnter(draggingEvent: DraggingEvent): void {
        // we pick the drop listener depending on whether we are in pivot mode are not. if we are
        // in pivot mode, then dropping cols changes the row group, pivot, value stats. otherwise
        // we change visibility state and position.

        // if (this.columnController.isPivotMode()) {
        const dropType: DropType = this.getDropType(draggingEvent);

        this.currentDropListener = this.dropListeners[dropType];
        this.currentDropListener.onDragEnter(draggingEvent);
    }

    public onDragLeave(params: DraggingEvent): void {
        this.currentDropListener.onDragLeave(params);
    }

    public onDragging(params: DraggingEvent): void {
        this.currentDropListener.onDragging(params);
    }

    public onDragStop(params: DraggingEvent): void {
        this.currentDropListener.onDragStop(params);
    }

}
