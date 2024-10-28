import {Component, OnInit} from '@angular/core';
import {ProductListComponent} from '../product-list/product-list.component';
import {ProductService} from "../../services/product.service";
import {Product} from "../../types/product.type";
import {CurrencyPipe, DatePipe, NgOptimizedImage, SlicePipe} from "@angular/common";
import {constant} from "../../shared/constant";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {ActivatedRoute} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {ReviewService} from "../../services/review.service";
import {PageRequest} from "../../types/page-request.type";
import {Sort, SortField} from "../../types/sort.type";
import {Review, ReviewRequestFilter, ReviewStatistic} from "../../types/review.type";
import {environment} from "../../../environments/environment";
import {PagedResponse} from "../../types/response.type";

@Component({
    selector: 'app-product-details',
    standalone: true,
    imports: [ProductListComponent, CurrencyPipe, NgOptimizedImage, TranslateModule, FormsModule, SlicePipe, DatePipe],
    templateUrl: './product-details.component.html',
    styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
    quantity = 0;
    productSlug: string | null = null;
    product: Product | null = null;
    reviewResponse: PagedResponse<Review> | null = null;
    reviews: Review[] = [];
    reviewStatistic: ReviewStatistic | null = null;
    imageUrls: string[] = [];
    heroUrl = constant.defaultHeroImageUrl;
    showFullDescription = false;

    filter?: ReviewRequestFilter;
    pageRequest: PageRequest = {page: 1, size: 10};
    sort: Sort = {sortBy: SortField.CREATED_AT, ascending: false};

    loading = false;

    constructor(
        private translateService: TranslateService,
        private productService: ProductService,
        private router: ActivatedRoute,
        private reviewService: ReviewService,
    ) {
        this.translateService.setDefaultLang("vi");
    }

    ngOnInit(): void {
        this.router.params.subscribe(params => {
            this.productSlug = params['slug'];
            if (this.productSlug) {
                this.loadProductDetails(this.productSlug);
                this.filter = {productSlug: this.productSlug};
                this.fetchReviews();
                this.fetchReviewStatistic();
            }
        });
    }

    private loadProductDetails(slug: string): void {
        this.productService.getBySlug(slug).subscribe(product => {
            this.product = product;
            this.loadProductImages(product.id);
        });
    }

    private loadProductImages(productId: number): void {
        this.productService.getImagesById(productId).subscribe(images => {
            const featuredImage = images.find(image => image.featured);
            this.heroUrl = featuredImage
                ? this.createImageUrl(featuredImage.imageId)
                : constant.defaultHeroImageUrl;

            this.imageUrls = images.map(image => this.createImageUrl(image.imageId));
        });
    }

    onHoverThumbnail(index: number) {
        this.heroUrl = this.imageUrls[index];
    }

    increaseQuantity(): void {
        if (this.product && this.quantity < this.product?.stockQuantity) {
            this.quantity++;
        }
    }

    decreaseQuantity(): void {
        if (this.quantity > 0) {
            this.quantity--;
        }
    }

    validateQuantity(): void {
        if (isNaN(this.quantity)) {
            this.quantity = 0;
            return;
        }

        this.quantity = Math.ceil(this.quantity);
        if (this.quantity < 0) {
            this.quantity = 0;
            return
        }

        if (this.product && this.quantity > this.product?.stockQuantity) {
            this.quantity = this.product.stockQuantity;
        }
    }

    get discount(): number {
        if (this.product) {
            return Math.round((1 - (this.product?.salePrice / this.product?.basePrice)) * 100)
        }
        return 0;
    }

    protected toggleShowFullDescription() {
        this.showFullDescription = !this.showFullDescription;
    }

    protected createImageUrl(imageId: number) {
        return `${environment.IMAGE_SERVICE_API}/images/${imageId}`;
    }

    protected onRating(rating?: number) {
        if (this.filter) {
            this.filter.rating = rating;
            this.reviews = []
            this.fetchReviews();
        }
    }

    protected onAscending(ascending: boolean) {
        this.sort.ascending = ascending;
        this.fetchReviews();
    }

    private fetchReviews(): void {
        if (!this.filter?.productSlug) return;

        const cleanedFilter = this.cleanFilter(this.filter);

        this.loading = true;
        this.reviewService
            .getByCriteria(cleanedFilter, this.pageRequest, this.sort)
            .subscribe(reviews => {
                this.reviewResponse = reviews;
                this.reviews = [...this.reviews, ...reviews.items];
                this.loading = false;
            });
    }

    private fetchReviewStatistic() {
        if (!this.productSlug) return;

        this.reviewService.getReviewStatistic(this.productSlug)
            .subscribe(statistics => this.reviewStatistic = statistics)
    }

    private cleanFilter(filter: ReviewRequestFilter): ReviewRequestFilter {
        return Object.fromEntries(
            Object.entries(filter).filter(([_, value]) => value !== undefined)
        ) as ReviewRequestFilter;
    }

    protected loadMoreReviews() {
        if (this.reviewResponse?.hasNext) {
            this.pageRequest.page++;
            this.fetchReviews();
        }
    }

    protected readonly constant = constant;
    protected readonly Array = Array;
}
