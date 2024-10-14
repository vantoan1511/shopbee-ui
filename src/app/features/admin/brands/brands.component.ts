import {Component, OnInit} from '@angular/core';
import {DataTableFooterComponent} from "../../../shared/components/pagination/pagination.component";
import {DatePipe} from "@angular/common";
import {ListControlsComponent} from "../../../shared/components/list-controls/list-controls.component";
import {SortableDirective} from "../../../directives/sortable.directive";
import {Perform} from "../../../types/perform.type";
import {Response} from "../../../types/response.type";
import {PageRequest} from "../../../types/page-request.type";
import {Sort, SortField} from "../../../types/sort.type";
import {AlertService} from "../../../services/alert.service";
import {HttpErrorResponse} from "@angular/common/http";
import {RouterLink} from "@angular/router";
import {Brand} from "../../../types/product.type";
import {BrandService} from "../../../services/brand.service";

@Component({
    selector: 'app-brands',
    standalone: true,
    imports: [
        DataTableFooterComponent,
        DatePipe,
        ListControlsComponent,
        SortableDirective,
        RouterLink
    ],
    templateUrl: './brands.component.html',
    styleUrl: './brands.component.scss'
})
export class BrandsComponent implements OnInit {
    brands = new Perform<Response<Brand>>();
    pageRequest: PageRequest = {page: 1, size: 10};
    sort: Sort = {sortBy: SortField.CREATED_AT, ascending: false};
    sortableFields = SortField;
    selectAllChecked = false;

    constructor(
        private brandService: BrandService,
        private alertService: AlertService
    ) {
    }

    ngOnInit(): void {
        this.fetchBrands();
    }

    onRefreshButtonClick() {
        this.fetchBrands();
    }

    onSelectAll(event: Event) {
        const checkbox = event.target as HTMLInputElement;
        this.selectAllChecked = checkbox.checked;
        const selectBoxes: NodeListOf<HTMLInputElement> =
            document.querySelectorAll('.custom-checkbox');
        selectBoxes.forEach((box) => {
            box.checked = this.selectAllChecked;
        });
    }

    onSelect() {
        const selectBoxes: NodeListOf<HTMLInputElement> = document.querySelectorAll(
            '.custom-checkbox:not(#selectAll)'
        );
        const allChecked = Array.from(selectBoxes).every((box) => box.checked);
        this.selectAllChecked = allChecked;

        const selectAllCheckbox = document.querySelector(
            '#selectAll'
        ) as HTMLInputElement;
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = this.selectAllChecked;
        }
    }

    nextPage() {
        if (this.brands.data?.hasNext) {
            this.pageRequest.page++;
            this.fetchBrands();
        }
    }

    previousPage() {
        if (this.brands.data?.hasPrevious) {
            this.pageRequest.page--;
            this.fetchBrands();
        }
    }

    onPageChange(change: 'next' | 'previous') {
        if (change === 'next') {
            this.nextPage();
        } else {
            this.previousPage();
        }
    }

    onPageSizeChange(size: number) {
        this.pageRequest.size = size;
        this.validatePageRequest();
        this.fetchBrands();
    }

    onSortChange(sort: Sort) {
        this.sort = sort;
        this.fetchBrands();
    }

    onDeleteSelected() {
        console.log('INFO - Starting deleting brand...');
        const selectedUsers = this.getSelectedBrandIds();
        const title = `Delete ${selectedUsers.length} brand(s)?`;
        const text =
            'Those brands will be deleted forever! Do you want to continue?';
        this.alertService.showConfirmationAlert(title, text, 'warning', () =>
            this.doDeleteSelectedBrands()
        );
    }

    private fetchBrands() {
        this.brands.load(this.brandService.getBy(this.pageRequest, this.sort));
    }

    private doDeleteSelectedBrands() {
        this.brandService.delete(this.getSelectedBrandIds()).subscribe({
            next: () => {
                this.showSuccess();
                this.fetchBrands();
            },
            error: (error: HttpErrorResponse) => this.showError(error),
        });
    }

    private showSuccess() {
        const text = `${this.getSelectedBrandIds().length} brands deleted`;
        this.alertService.showSuccessToast(text);
    }

    private showError(errorResponse: HttpErrorResponse) {
        const {error} = errorResponse;
        const errorMessage = error.errorMessage || 'Some server issues occurred';
        this.alertService.showErrorToast(errorMessage);
    }

    private getSelectedBrandIds(): number[] {
        const selectBoxes: NodeListOf<HTMLInputElement> = document.querySelectorAll(
            '.custom-checkbox:not(#selectAll)'
        );
        return Array.from(selectBoxes)
            .filter((box) => box.checked)
            .map((box) => parseInt(box.id));
    }

    private validatePageRequest() {
        if (this.brands.data) {
            const itemsLeft =
                this.brands.data.totalItems -
                this.pageRequest.page * this.pageRequest.size;
            if (itemsLeft < 0) {
                this.pageRequest.page = Math.ceil(
                    this.brands.data.totalItems / this.pageRequest.size
                );
            }
        }
    }
}