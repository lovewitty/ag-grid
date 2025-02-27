import { BeanStub } from "../context/beanStub";
import { Autowired, PostConstruct } from "../context/context";
import { ColumnController } from "../columnController/columnController";
import { GridOptionsWrapper } from "../gridOptionsWrapper";
import { Constants } from "../constants/constants";
import { Events } from "../eventKeys";

export class CenterWidthFeature extends BeanStub {

    @Autowired('columnController') private columnController: ColumnController;

    private callback: (width: number) => void;

    constructor(callback: (width: number) => void) {
        super();
        this.callback = callback;
    }

    @PostConstruct
    private postConstruct(): void {
        const listener = this.setWidth.bind(this);
        this.addManagedListener(this.gridOptionsWrapper, GridOptionsWrapper.PROP_DOM_LAYOUT, listener);
        this.addManagedListener(this.eventService, Events.EVENT_DISPLAYED_COLUMNS_CHANGED, listener);
        this.addManagedListener(this.eventService, Events.EVENT_DISPLAYED_COLUMNS_WIDTH_CHANGED, listener);

        this.setWidth();
    }

    private setWidth(): void {
        const {columnController} = this;

        const printLayout = this.gridOptionsWrapper.getDomLayout() === Constants.DOM_LAYOUT_PRINT;

        const centerWidth = columnController.getBodyContainerWidth();
        const leftWidth = columnController.getDisplayedColumnsLeftWidth();
        const rightWidth = columnController.getDisplayedColumnsRightWidth();

        const totalWidth = printLayout ? centerWidth + leftWidth + rightWidth : centerWidth;

        this.callback(totalWidth);
    }
}