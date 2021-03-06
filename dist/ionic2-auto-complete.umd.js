(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/forms'), require('rxjs/util/noop'), require('rxjs/Subject'), require('rxjs/Observable'), require('rxjs/observable/fromPromise'), require('ionic-angular')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common', '@angular/forms', 'rxjs/util/noop', 'rxjs/Subject', 'rxjs/Observable', 'rxjs/observable/fromPromise', 'ionic-angular'], factory) :
	(factory((global['ionic2-auto-complete'] = {}),global.ng.core,global.ng.common,global.ng.forms,global.noop,global.Rx.Subject,global.Rx.Observable,global.fromPromise,global.ionicAngular));
}(this, (function (exports,core,common,forms,noop,Subject,Observable,fromPromise,ionicAngular) { 'use strict';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
// searchbar default options
var defaultOpts = {
    cancelButtonText: 'Cancel',
    showCancelButton: false,
    debounce: 250,
    placeholder: 'Search',
    autocomplete: 'off',
    autocorrect: 'off',
    spellcheck: 'off',
    type: 'search',
    value: '',
    noItems: '',
    clearOnEdit: false,
    clearInput: false
};
var AutoCompleteComponent = (function () {
    function AutoCompleteComponent() {
        this.hideListOnSelection = true;
        this.onTouchedCallback = noop.noop;
        this.onChangeCallback = noop.noop;
        this.showListChanged = false;
        this.keyword = '';
        this.suggestions = [];
        this._showList = false;
        this.itemSelected = new core.EventEmitter();
        this.itemsShown = new core.EventEmitter();
        this.itemsHidden = new core.EventEmitter();
        this.ionAutoInput = new core.EventEmitter();
        this.autoFocus = new core.EventEmitter();
        this.autoBlur = new core.EventEmitter();
        this.options = {};
        // set default options
        this.defaultOpts = defaultOpts;
    }
    Object.defineProperty(AutoCompleteComponent.prototype, "showList", {
        get: /**
         * @return {?}
         */
        function () {
            return this._showList;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            if (this._showList === value) {
                return;
            }
            this._showList = value;
            this.showListChanged = true;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * handle tap
     * @param {?} event
     * @return {?}
     */
    AutoCompleteComponent.prototype.handleTap = /**
     * handle tap
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (this.showResultsFirst || this.keyword.length > 0) {
            this.getItems();
        }
    };
    /**
     * @param {?} value
     * @return {?}
     */
    AutoCompleteComponent.prototype.writeValue = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        if (value !== this.selection) {
            this.selection = value || null;
            this.formValue = this.getFormValue(this.selection);
            this.keyword = this.getLabel(this.selection);
        }
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    AutoCompleteComponent.prototype.registerOnChange = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) {
        this.onChangeCallback = fn;
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    AutoCompleteComponent.prototype.registerOnTouched = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) {
        this.onTouchedCallback = fn;
    };
    /**
     * @return {?}
     */
    AutoCompleteComponent.prototype.updateModel = /**
     * @return {?}
     */
    function () {
        this.onChangeCallback(this.formValue);
    };
    /**
     * @return {?}
     */
    AutoCompleteComponent.prototype.ngAfterViewChecked = /**
     * @return {?}
     */
    function () {
        if (this.showListChanged) {
            this.showListChanged = false;
            this.showList ? this.itemsShown.emit() : this.itemsHidden.emit();
        }
    };
    /**
     * get items for auto-complete
     * @param {?=} e
     * @return {?}
     */
    AutoCompleteComponent.prototype.getItems = /**
     * get items for auto-complete
     * @param {?=} e
     * @return {?}
     */
    function (e) {
        var _this = this;
        var /** @type {?} */ result;
        if (this.showResultsFirst && this.keyword.trim() === '') {
            this.keyword = '';
        }
        else if (this.keyword.trim() === '') {
            this.suggestions = [];
            return;
        }
        if (typeof this.dataProvider === 'function') {
            result = this.dataProvider(this.keyword);
        }
        else {
            result = this.dataProvider.getResults(this.keyword);
        }
        // if result is instanceof Subject, use it asObservable
        if (result instanceof Subject.Subject) {
            result = result.asObservable();
        }
        if (result instanceof Promise) {
            result = fromPromise.fromPromise(result);
        }
        // if query is async
        if (result instanceof Observable.Observable) {
            result
                .subscribe(function (results) {
                _this.suggestions = results;
                _this.showItemList();
            }, function (error) { return console.error(error); });
        }
        else {
            this.suggestions = result;
            this.showItemList();
        }
        // emit event
        this.ionAutoInput.emit(this.keyword);
    };
    /**
     * show item list
     * @return {?}
     */
    AutoCompleteComponent.prototype.showItemList = /**
     * show item list
     * @return {?}
     */
    function () {
        this.showList = true;
    };
    /**
     * hide item list
     * @return {?}
     */
    AutoCompleteComponent.prototype.hideItemList = /**
     * hide item list
     * @return {?}
     */
    function () {
        this.showList = this.alwaysShowList;
    };
    /**
     * select item from list
     *
     * @param {?} selection
     *
     * @return {?}
     */
    AutoCompleteComponent.prototype.select = /**
     * select item from list
     *
     * @param {?} selection
     *
     * @return {?}
     */
    function (selection) {
        this.keyword = this.getLabel(selection);
        this.formValue = this.getFormValue(selection);
        this.hideItemList();
        // emit selection event
        this.updateModel();
        if (this.hideListOnSelection) {
            this.hideItemList();
        }
        // emit selection event
        this.itemSelected.emit(selection);
        this.selection = selection;
    };
    /**
     * @return {?}
     */
    AutoCompleteComponent.prototype.getSelection = /**
     * @return {?}
     */
    function () {
        return this.selection;
    };
    /**
     * @return {?}
     */
    AutoCompleteComponent.prototype.getValue = /**
     * @return {?}
     */
    function () {
        return this.formValue;
    };
    /**
     * set current input value
     * @param {?} selection
     * @return {?}
     */
    AutoCompleteComponent.prototype.setValue = /**
     * set current input value
     * @param {?} selection
     * @return {?}
     */
    function (selection) {
        this.formValue = this.getFormValue(selection);
        this.keyword = this.getLabel(selection);
        return;
    };
    /**
     * /**
     * clear current input value
     * @param {?=} hideItemList
     * @return {?}
     */
    AutoCompleteComponent.prototype.clearValue = /**
     * /**
     * clear current input value
     * @param {?=} hideItemList
     * @return {?}
     */
    function (hideItemList) {
        if (hideItemList === void 0) { hideItemList = false; }
        this.keyword = '';
        this.selection = null;
        this.formValue = null;
        if (hideItemList) {
            this.hideItemList();
        }
        return;
    };
    /**
     * set focus of searchbar
     * @return {?}
     */
    AutoCompleteComponent.prototype.setFocus = /**
     * set focus of searchbar
     * @return {?}
     */
    function () {
        if (this.searchbarElem) {
            this.searchbarElem.setFocus();
        }
    };
    /**
     * fired when the input focused
     */
    /**
     * fired when the input focused
     * @return {?}
     */
    AutoCompleteComponent.prototype.onFocus = /**
     * fired when the input focused
     * @return {?}
     */
    function () {
        this.autoFocus.emit();
    };
    /**
     * fired when the input focused
     */
    /**
     * fired when the input focused
     * @return {?}
     */
    AutoCompleteComponent.prototype.onBlur = /**
     * fired when the input focused
     * @return {?}
     */
    function () {
        this.autoBlur.emit();
    };
    /**
     * handle document click
     * @param {?} event
     * @return {?}
     */
    AutoCompleteComponent.prototype.documentClickHandler = /**
     * handle document click
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if ((this.searchbarElem
            && !this.searchbarElem._elementRef.nativeElement.contains(event.target))
            ||
                (!this.inputElem && this.inputElem._elementRef.nativeElement.contains(event.target))) {
            this.hideItemList();
        }
    };
    /**
     * @param {?} selection
     * @return {?}
     */
    AutoCompleteComponent.prototype.getFormValue = /**
     * @param {?} selection
     * @return {?}
     */
    function (selection) {
        if (selection == null) {
            return null;
        }
        var /** @type {?} */ attr = this.dataProvider.formValueAttribute == null ? this.dataProvider.labelAttribute : this.dataProvider.formValueAttribute;
        if (typeof selection === 'object' && attr) {
            return selection[attr];
        }
        return selection;
    };
    /**
     * @param {?} selection
     * @return {?}
     */
    AutoCompleteComponent.prototype.getLabel = /**
     * @param {?} selection
     * @return {?}
     */
    function (selection) {
        if (selection == null) {
            return '';
        }
        var /** @type {?} */ attr = this.dataProvider.labelAttribute;
        var /** @type {?} */ value = selection;
        if (this.dataProvider.getItemLabel) {
            value = this.dataProvider.getItemLabel(value);
        }
        if (typeof value === 'object' && attr) {
            return value[attr] || '';
        }
        return value || '';
    };
    AutoCompleteComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'ion-auto-complete',
                    template: "\n        <ion-input\n                #inputElem\n                (keyup)=\"getItems($event)\"\n                (tap)=\"handleTap($event)\"\n                [(ngModel)]=\"keyword\"\n                (ngModelChange)=\"updateModel()\"\n                [placeholder]=\"options.placeholder == null ? defaultOpts.placeholder : options.placeholder\"\n                [type]=\"options.type == null ? defaultOpts.type : options.type\"\n                [clearOnEdit]=\"options.clearOnEdit == null ? defaultOpts.clearOnEdit : options.clearOnEdit\"\n                [clearInput]=\"options.clearInput == null ? defaultOpts.clearInput : options.clearInput\"\n                [disabled]=\"disabled\"\n                [ngClass]=\"{'hidden': !useIonInput}\"\n                (ionFocus)=\"onFocus()\"\n                (ionBlur)=\"onBlur()\"\n        >\n        </ion-input>\n        <ion-searchbar\n                #searchbarElem\n                (ionInput)=\"getItems($event)\"\n                (tap)=\"handleTap($event)\"\n                [(ngModel)]=\"keyword\"\n                (ngModelChange)=\"updateModel()\"\n                [cancelButtonText]=\"options.cancelButtonText == null ? defaultOpts.cancelButtonText : options.cancelButtonText\"\n                [showCancelButton]=\"options.showCancelButton == null ? defaultOpts.showCancelButton : options.showCancelButton\"\n                [debounce]=\"options.debounce == null ? defaultOpts.debounce : options.debounce\"\n                [placeholder]=\"options.placeholder == null ? defaultOpts.placeholder : options.placeholder\"\n                [autocomplete]=\"options.autocomplete == null ? defaultOpts.autocomplete : options.autocomplete\"\n                [autocorrect]=\"options.autocorrect == null ? defaultOpts.autocorrect : options.autocorrect\"\n                [spellcheck]=\"options.spellcheck == null ? defaultOpts.spellcheck : options.spellcheck\"\n                [type]=\"options.type == null ? defaultOpts.type : options.type\"\n                [disabled]=\"disabled\"\n                [ngClass]=\"{'hidden': useIonInput}\"\n                (ionClear)=\"clearValue(true)\"\n                (ionFocus)=\"onFocus()\"\n                (ionBlur)=\"onBlur()\"\n        >\n        </ion-searchbar>\n        <ng-template #defaultTemplate let-attrs=\"attrs\">\n            <span [innerHTML]='attrs.label | boldprefix:attrs.keyword'></span>\n        </ng-template>\n        <ul *ngIf=\"!disabled && suggestions.length > 0 && showList\">\n            <li *ngFor=\"let suggestion of suggestions\" (tap)=\"select(suggestion);$event.srcEvent.stopPropagation()\">\n                <ng-template\n                        [ngTemplateOutlet]=\"template || defaultTemplate\"\n                        [ngTemplateOutletContext]=\"\n                        {attrs:{ \n                          data: suggestion, \n                          label: getLabel(suggestion),\n                          keyword: keyword,\n                          formValue: getFormValue(suggestion), \n                          labelAttribute: dataProvider.labelAttribute, \n                          formValueAttribute: dataProvider.formValueAttribute }}\"></ng-template>\n            </li>\n        </ul>\n        <p *ngIf=\"suggestions.length == 0 && showList && options.noItems\">{{ options.noItems }}</p>\n    ",
                    providers: [
                        { provide: forms.NG_VALUE_ACCESSOR, useExisting: AutoCompleteComponent, multi: true }
                    ]
                },] },
    ];
    /** @nocollapse */
    AutoCompleteComponent.ctorParameters = function () { return []; };
    AutoCompleteComponent.propDecorators = {
        "dataProvider": [{ type: core.Input },],
        "options": [{ type: core.Input },],
        "disabled": [{ type: core.Input },],
        "keyword": [{ type: core.Input },],
        "showResultsFirst": [{ type: core.Input },],
        "alwaysShowList": [{ type: core.Input },],
        "hideListOnSelection": [{ type: core.Input },],
        "template": [{ type: core.Input },],
        "useIonInput": [{ type: core.Input },],
        "autoFocus": [{ type: core.Output },],
        "autoBlur": [{ type: core.Output },],
        "itemSelected": [{ type: core.Output },],
        "itemsShown": [{ type: core.Output },],
        "itemsHidden": [{ type: core.Output },],
        "ionAutoInput": [{ type: core.Output },],
        "searchbarElem": [{ type: core.ViewChild, args: ['searchbarElem',] },],
        "inputElem": [{ type: core.ViewChild, args: ['inputElem',] },],
        "documentClickHandler": [{ type: core.HostListener, args: ['document:click', ['$event'],] },],
    };
    return AutoCompleteComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * bolds the beggining of the matching string in the item
 */
var BoldPrefix = (function () {
    function BoldPrefix() {
    }
    /**
     * @param {?} value
     * @param {?} keyword
     * @return {?}
     */
    BoldPrefix.prototype.transform = /**
     * @param {?} value
     * @param {?} keyword
     * @return {?}
     */
    function (value, keyword) {
        if (!keyword)
            return value;
        var /** @type {?} */ escaped_keyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return value.replace(new RegExp(escaped_keyword, 'gi'), function (str) { return str.bold(); });
    };
    BoldPrefix.decorators = [
        { type: core.Pipe, args: [{
                    name: 'boldprefix'
                },] },
        { type: core.Injectable },
    ];
    /** @nocollapse */
    BoldPrefix.ctorParameters = function () { return []; };
    return BoldPrefix;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var AutoCompleteModule = (function () {
    function AutoCompleteModule() {
    }
    /**
     * @return {?}
     */
    AutoCompleteModule.forRoot = /**
     * @return {?}
     */
    function () {
        return {
            ngModule: AutoCompleteModule,
            providers: []
        };
    };
    AutoCompleteModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [
                        common.CommonModule,
                        forms.FormsModule,
                        ionicAngular.IonicModule
                    ],
                    declarations: [
                        AutoCompleteComponent,
                        BoldPrefix
                    ],
                    exports: [
                        AutoCompleteComponent,
                        BoldPrefix
                    ]
                },] },
    ];
    /** @nocollapse */
    AutoCompleteModule.ctorParameters = function () { return []; };
    return AutoCompleteModule;
}());

exports.AutoCompleteModule = AutoCompleteModule;
exports.AutoCompleteComponent = AutoCompleteComponent;
exports.BoldPrefix = BoldPrefix;

Object.defineProperty(exports, '__esModule', { value: true });

})));
