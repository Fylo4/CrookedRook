import { AUTO_STYLE, animate, style, transition } from "@angular/animations";

export function collapseTransition(fade: number, fadeOut?: number) {
    return [
        transition(':enter', [
            style({height: '0', visibility: 'hidden'}),
            animate(fade+'ms', style({height: AUTO_STYLE, visibility: AUTO_STYLE}))
        ]),
        transition(':leave', [
            style({height: AUTO_STYLE, visibility: AUTO_STYLE}),
            animate((fadeOut??fade)+'ms', style({height: '0', visibility: 'hidden'}))
        ]),
    ];
}