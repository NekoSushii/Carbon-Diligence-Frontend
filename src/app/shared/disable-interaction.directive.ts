import { Directive, ElementRef, Renderer2, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadingService } from '../loading/loading.service';

@Directive({
  selector: '[appDisableInteraction]'
})
export class DisableInteractionDirective implements OnInit, OnDestroy {
  private loadingSubscription: Subscription = new Subscription();

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.loadingSubscription = this.loadingService.loading$.subscribe(isLoading => {
      if (isLoading) {
        this.renderer.setStyle(this.el.nativeElement, 'pointer-events', 'none');
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '0.5');
      } else {
        this.renderer.removeStyle(this.el.nativeElement, 'pointer-events');
        this.renderer.removeStyle(this.el.nativeElement, 'opacity');
      }
    });
  }

  ngOnDestroy() {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }
}
