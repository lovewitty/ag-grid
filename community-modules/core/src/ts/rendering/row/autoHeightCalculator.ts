import { Autowired, Bean, PostConstruct } from "../../context/context";
import { Beans } from "../beans";
import { RowNode } from "../../entities/rowNode";
import { CellComp } from "../cellComp";
import { ColumnController } from "../../columnController/columnController";
import { BeanStub } from "../../context/beanStub";
import { addCssClass } from "../../utils/dom";
import { RowCssClassCalculator, RowCssClassCalculatorParams } from "./rowCssClassCalculator";
import { AngularRowUtils } from "./angularRowUtils";
import { ControllersService } from "../../controllersService";
import { RowContainerController } from "../../gridBodyComp/rowContainer/rowContainerController";

@Bean('autoHeightCalculator')
export class AutoHeightCalculator extends BeanStub {

    @Autowired('beans') private beans: Beans;
    @Autowired("$scope") private $scope: any;
    @Autowired("columnController") private columnController: ColumnController;
    @Autowired("rowCssClassCalculator") private rowCssClassCalculator: RowCssClassCalculator;
    @Autowired('$compile') public $compile: any;
    @Autowired('controllersService') public controllersService: ControllersService;

    private centerRowContainerCon: RowContainerController;

    @PostConstruct
    private postConstruct(): void {
        this.controllersService.whenReady(p => {
            this.centerRowContainerCon = p.centerRowContainerCon;
        });
    }

    public getPreferredHeightForRow(rowNode: RowNode): number {

        const eDummyContainer = document.createElement('div');
        this.addInRowCssClasses(rowNode, eDummyContainer);

        // we put the dummy into the body container, so it will inherit all the
        // css styles that the real cells are inheriting
        const eBodyContainer = this.centerRowContainerCon.getContainerElement();
        eBodyContainer.appendChild(eDummyContainer);

        const scopeResult = AngularRowUtils.createChildScopeOrNull(rowNode, this.$scope, this.beans.gridOptionsWrapper);
        const scope = scopeResult ? scopeResult.scope : undefined;
        const scopeDestroyFunc = scopeResult ? scopeResult.scopeDestroyFunc : undefined;

        const cellComps: CellComp[] = [];
        const autoRowHeightCols = this.columnController.getAllAutoRowHeightCols();
        const displayedCols = this.columnController.getAllDisplayedColumns();
        const visibleAutoRowHeightCols = autoRowHeightCols.filter(col => displayedCols.indexOf(col) >= 0);

        visibleAutoRowHeightCols.forEach(col => {
            const cellComp = new CellComp(
                scope,
                this.beans,
                col,
                rowNode,
                null,
                true,
                false,
                eDummyContainer,
                false
            );
            cellComps.push(cellComp);
        });

        cellComps.forEach(cellComp => eDummyContainer.appendChild(cellComp.getGui()))

        if (scope) {
            this.$compile(eDummyContainer)(scope);
        }

        // we should be able to just take the height of the row at this point, however
        // the row isn't expanding to cover the cell heights, i don't know why, i couldn't
        // figure it out so instead looking at the individual cells instead
        let maxCellHeight = 0;
        for (let i = 0; i < eDummyContainer.children.length; i++) {
            const child = eDummyContainer.children[i] as HTMLElement;
            if (child.offsetHeight > maxCellHeight) {
                maxCellHeight = child.offsetHeight;
            }
        }

        // we are finished with the dummy container, so get rid of it
        eBodyContainer.removeChild(eDummyContainer);

        cellComps.forEach(cellComp => {
            // dunno why we need to detach first, doing it here to be consistent with code in RowComp
            cellComp.detach();
            cellComp.destroy();
        });

        if (scopeDestroyFunc) {
            scopeDestroyFunc();
        }

        return maxCellHeight;
    }

    private addInRowCssClasses(rowNode: RowNode, eDummyContainer: HTMLDivElement) {
        // so any styles on row also get applied in dummy, otherwise
        // the content in dummy may differ to the real
        const rowIndex = rowNode.rowIndex!;
        const params: RowCssClassCalculatorParams = {
            rowNode: rowNode,
            rowIsEven: rowIndex % 2 === 0,
            rowLevel: this.rowCssClassCalculator.calculateRowLevel(rowNode),
            firstRowOnPage: rowIndex === this.beans.paginationProxy.getPageFirstRow(),
            lastRowOnPage: rowIndex === this.beans.paginationProxy.getPageLastRow(),
            printLayout: false,
            expandable: rowNode.isExpandable()
        };
        const classes = this.rowCssClassCalculator.getInitialRowClasses(params);
        addCssClass(eDummyContainer, classes.join(' '));
    }
}
