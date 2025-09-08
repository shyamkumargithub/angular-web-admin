import { Component, Input } from '@angular/core';
import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';


@Component({
  selector: 'app-breacrumb',
  templateUrl: './breacrumb.component.html',
  styleUrls: ['./breacrumb.component.scss']
})
export class BreacrumbComponent {
  @Input() breadcrumbs: { label: string | string[]; url?: string }[] = [];

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  constructor(private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.breadcrumbs$.subscribe((breadcrumbs) => {
      this.breadcrumbs = breadcrumbs;
    });
  }

}