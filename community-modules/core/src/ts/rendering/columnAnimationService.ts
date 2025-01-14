import { Autowired, Bean, PostConstruct } from "../context/context";
import { BeanStub } from "../context/beanStub";
import { GridBodyController } from "../gridBodyComp/gridBodyController";
import { ControllersService } from "../controllersService";

@Bean('columnAnimationService')
export class ColumnAnimationService extends BeanStub {

    @Autowired('controllersService') private controllersService: ControllersService;

    private gridBodyCon: GridBodyController;

    private executeNextFuncs: Function[] = [];
    private executeLaterFuncs: Function[] = [];

    private active = false;

    private animationThreadCount = 0;

    @PostConstruct
    private postConstruct(): void {
        this.controllersService.whenReady(p => this.gridBodyCon = p.gridBodyCon);
    }

    public isActive(): boolean {
        return this.active;
    }

    public start(): void {
        if (this.active) { return; }

        if (this.gridOptionsWrapper.isSuppressColumnMoveAnimation()) { return; }

        // if doing RTL, we don't animate open / close as due to how the pixels are inverted,
        // the animation moves all the row the the right rather than to the left (ie it's the static
        // columns that actually get their coordinates updated)
        if (this.gridOptionsWrapper.isEnableRtl()) { return; }

        this.ensureAnimationCssClassPresent();

        this.active = true;
    }

    public finish(): void {
        if (!this.active) { return; }
        this.flush();
        this.active = false;
    }

    public executeNextVMTurn(func: Function): void {
        if (this.active) {
            this.executeNextFuncs.push(func);
        } else {
            func();
        }
    }

    public executeLaterVMTurn(func: Function): void {
        if (this.active) {
            this.executeLaterFuncs.push(func);
        } else {
            func();
        }
    }

    private ensureAnimationCssClassPresent(): void {
        // up the count, so we can tell if someone else has updated the count
        // by the time the 'wait' func executes
        this.animationThreadCount++;
        const animationThreadCountCopy = this.animationThreadCount;
        this.gridBodyCon.setColumnMovingCss(true);

        this.executeLaterFuncs.push(() => {
            // only remove the class if this thread was the last one to update it
            if (this.animationThreadCount === animationThreadCountCopy) {
                this.gridBodyCon.setColumnMovingCss(false);
            }
        });
    }

    public flush(): void {

        const nowFuncs = this.executeNextFuncs;
        this.executeNextFuncs = [];

        const waitFuncs = this.executeLaterFuncs;
        this.executeLaterFuncs = [];

        if (nowFuncs.length === 0 && waitFuncs.length === 0) { return; }

        window.setTimeout(() => nowFuncs.forEach(func => func()), 0);
        window.setTimeout(() => waitFuncs.forEach(func => func()), 300);
    }
}
