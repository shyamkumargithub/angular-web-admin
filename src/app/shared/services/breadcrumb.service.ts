import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private breadcrumbSubject = new BehaviorSubject<{ label: string; url: string }[]>([]);
  breadcrumbs$ = this.breadcrumbSubject.asObservable();

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    // Update breadcrumbs on NavigationEnd
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.updateBreadcrumbs(this.activatedRoute.root, '');
    });

    // Initialize breadcrumbs on service load (for page refreshes)
    this.updateBreadcrumbs(this.activatedRoute.root, '');
  }

  private updateBreadcrumbs(
    route: ActivatedRoute,
    parentUrl: string,
    breadcrumbs: { label: string; url: string }[] = []
  ): void {
    const routeConfig = route.snapshot.routeConfig;

    if (routeConfig?.data?.breadcrumb) {
      const breadcrumbData = routeConfig.data.breadcrumb;
      const url = `${parentUrl}/${routeConfig.path}`;

      // Handle array or single string for breadcrumb
      if (Array.isArray(breadcrumbData)) {
        breadcrumbData.forEach((label: string) => {
          breadcrumbs.push({ label, url });
        });
      } else {
        breadcrumbs.push({ label: breadcrumbData, url });
      }
    }

    // Recursively process child routes
    if (route.firstChild) {
      this.updateBreadcrumbs(route.firstChild, `${parentUrl}/${routeConfig?.path || ''}`, breadcrumbs);
    } else {
      // Emit the final breadcrumbs
      this.breadcrumbSubject.next(breadcrumbs);
    }
  }
}
