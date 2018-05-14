/**
 * Created by sunshine(514360255@qq.com)
 * User: Sunshine
 * Date: 2018/5/7 0007
 * Time: 上午 11:34
 */

import {
    Component, ComponentFactoryResolver, EventEmitter, HostListener, OnInit, Output, ViewChild, ViewContainerRef,
    ReflectiveInjector, ComponentRef, Inject} from '@angular/core';

@Component({
    selector: 'dialog-box',
    templateUrl: './dialog-box.component.html',
    styleUrls: ['../dialog.scss']
})

export class DialogBoxComponent implements OnInit {

    public className: string;
    public customEvent: string;
    public headerData: any = {
        icon: '',
        title: '提醒',
        sizeClassName: 'dialog-box-width400'
    };
    public btnList: Array<any> = [
        {icon: 'fa-close', type: 'secondary', name: '取消', status: false},
        {icon: 'fa-check', type: 'blue', name: '确认', status: true}
    ];
    public content: DialogBoxComponent;

    @ViewChild('dialogBoxAnimation') public dialogBoxAnimation: any;
    @ViewChild('element', {read: ViewContainerRef}) public element: any;

    @Output() public outputEvent: any = new EventEmitter<any>();

    @HostListener('document:click', ['$event.target'])
    onclick(btn: HTMLElement) {
        const className: string = btn.className;
        if (className.indexOf('dialog-animation') > -1) {
            this.dialogButton(false);
        }
    }

    constructor(
        public componentFactoryResolver: ComponentFactoryResolver,
        @Inject('dialog.service') public dialogService: any
    ) {}

    ngOnInit() {
    }

    /**
     * 设置头部信息
     * @param data
     * @param btnList
     * @param className
     */
    setHeaderData(data: any, btnList: Array<any>, className: string) {
        for(const key in data) {
            this.headerData[key] = data[key];
        }
        this.className = className;
        if(JSON.stringify(btnList) === '[]') {
            this.btnList = [];
        }else if (btnList) {
            this.btnList = btnList;
        }
        this.setClassName();
    }

    /**
     * 添加component
     * @param component
     * @param data
     * @returns {any}
     */
    addComponent(component: any, data: any): any {

        this.customEvent = data.customEvent;

        const componentFactory: any = this.componentFactoryResolver.resolveComponentFactory(component);

        const injector: any = ReflectiveInjector.fromResolvedProviders([], this.element.injector);

        const componentRef: ComponentRef<any> = componentFactory.create(injector);

        this.element.insert(componentRef.hostView);

        this.content = componentRef.instance;

        this.content['setDialogData'] = data;

        if(this.content.outputEvent) {
            this.content.outputEvent.subscribe(event => {
                data.confirmOutEmit(event);
            });
        }

        this.content['wrapper'] = this;

        return this.content;
    }

    /**
     * dialog 按钮
     * @param {boolean} status
     */
    dialogButton(status: boolean) {
        if (!status) {
            this.dialogService.removeDialog(this.content);
        } else {
            if (this.customEvent && (typeof this.customEvent === 'string')) {
                this.content[this.customEvent]();
            }
        }
    }

    /**
     * 添加class name
     */
    setClassName() {
        this.dialogBoxAnimation.nativeElement.classList.add(this.className);
    }

}
