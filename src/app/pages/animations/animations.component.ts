import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleComponent } from '../../components/title/title.component';
import { FooterComponent } from '../../components/footer/footer.component';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
    selector: 'app-animations',
    standalone: true,
    imports: [CommonModule, TitleComponent, FooterComponent],
    templateUrl: './animations.component.html',
    styleUrl: './animations.component.scss'
})


export class AnimationsComponent implements AfterViewInit, OnDestroy {
    private cdr = inject(ChangeDetectorRef);

    @ViewChild('animationsRoot') animationsRoot!: ElementRef<HTMLElement>;
    // Equivalente al document.getElementById de Js, se refiere a un identificador del HTML con formato #elemento
    @ViewChild('mouseArea') mouseArea!: ElementRef<HTMLElement>;
    @ViewChild('mouseDot') mouseDot!: ElementRef<HTMLElement>;

    staggerItems = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
    callbackMessage = 'Pulsa el botón para lanzar la animación.';

    // Persistimos la referencia al timeline concreto de las animaciones sólo cuando necesitamos control externo (Play/Restart)
    private context?: gsap.Context;
    private media?: gsap.MatchMedia;
    private sequenceTimeline?: gsap.core.Timeline;
    private staggerTimeline?: gsap.core.Timeline;
    private labelsTimeline?: gsap.core.Timeline;
    private callbackTimeline?: gsap.core.Timeline;
    private controlTimeline?: gsap.core.Timeline;
    private clickTimeline?: gsap.core.Timeline;

    ngAfterViewInit(): void {
        // Usamos context para agrupar y limpiar todo en ngOnDestroy
        this.context = gsap.context(() => {

            // Ejercicio 1: Animación de entrada automática
            gsap.from('.animated-title', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' });

            // Ejercicio 2: Secuencia (Timeline)
            this.sequenceTimeline = gsap.timeline({ paused: true })
                .from('.sequence-title', { y: 15, opacity: 0 })
                .from('.sequence-subtitle', { y: 15, opacity: 0 }, '-=0.1')
                .from('.sequence-button', { scale: 0.8, opacity: 0 }, '-=0.1');
            this.sequenceTimeline.play(0);

            // Ejercicio 3: Stagger
            this.staggerTimeline = gsap.timeline({ paused: true })
                .from('.stagger-item', { y: 20, opacity: 0, stagger: 0.1 });

            // Ejercicio 4: Repetición infinita
            gsap.to('.decorative-orb', { y: -15, repeat: -1, yoyo: true, ease: 'sine.inOut', duration: 1.5 });

            // Ejercicio 5: Labels
            this.labelsTimeline = gsap.timeline({ paused: true })
                .addLabel('start')
                .from('.label-pill.start', { opacity: 0, x: -10 }, 'start')
                .addLabel('middle', '+=0.2')
                .from('.label-pill.middle', { opacity: 0, y: 10 }, 'middle')
                .addLabel('end', '+=0.2')
                .from('.label-pill.end', { opacity: 0, scale: 0.5 }, 'end');

            // Ejercicio 6: Callbacks
            this.callbackTimeline = gsap.timeline({
                paused: true,
                onStart: () => this.updateMessage('La animación empezó.'),
                onComplete: () => this.updateMessage('La animación terminó.')
            }).to('.callback-box', { rotation: 10, scale: 1.1 }).to('.callback-box', { rotation: 0, scale: 1 });

            // Ejercicio 7: Control manual
            this.controlTimeline = gsap.timeline({ paused: true })
                .to('.control-box', { x: 200, rotation: 180, duration: 1.5, ease: 'power2.inOut' });

            // Ejercicio 8: Evento de usuario (Click)
            this.clickTimeline = gsap.timeline({ paused: true })
                .fromTo('.click-burst', { scale: 0, opacity: 1 }, { scale: 1.5, opacity: 0, duration: 0.5 });

            // Ejercicio 9: ScrollTrigger
            gsap.from('.scroll-panel', {
                scrollTrigger: { trigger: '.scroll-card', start: 'top 80%' },
                y: 50, opacity: 0, duration: 1
            });

            // Ejercicio 11: MatchMedia (Responsive)
            this.media = gsap.matchMedia();
            this.media.add({
                isDesktop: "(min-width: 768px)",
                isMobile: "(max-width: 767px)"
            }, (context) => {
                const { isDesktop } = context.conditions as any;
                gsap.from('.responsive-box', {
                    x: isDesktop ? 100 : 0,
                    y: isDesktop ? 0 : 50,
                    opacity: 0, duration: 1
                });
            });

        }, this.animationsRoot.nativeElement);

        // Ejercicio 10: Mouse Tracker con quickSetter para rendimiento
        this.initMouseTracker();
    }

    // Vinculación con los (click) del HTML
    runSequenceAnimation = () => this.sequenceTimeline?.restart();
    runStaggerAnimation = () => this.staggerTimeline?.restart();
    runLabelsAnimation = () => this.labelsTimeline?.restart();
    playCallbackAnimation = () => this.callbackTimeline?.restart();
    runClickAnimation = () => this.clickTimeline?.restart();

    // Control manual 
    playControlTimeline = () => this.controlTimeline?.play();
    pauseControlTimeline = () => this.controlTimeline?.pause();
    reverseControlTimeline = () => this.controlTimeline?.reverse();

    private initMouseTracker() {
        const xSetter = gsap.quickSetter(this.mouseDot.nativeElement, "x", "px");
        const ySetter = gsap.quickSetter(this.mouseDot.nativeElement, "y", "px");

        const onMove = (e: PointerEvent) => {
            const rect = this.mouseArea.nativeElement.getBoundingClientRect();
            xSetter(e.clientX - rect.left - 10);
            ySetter(e.clientY - rect.top - 10);
        };
        this.mouseArea.nativeElement.addEventListener('pointermove', onMove);
    }

    private updateMessage(msg: string) {
        this.callbackMessage = msg;
        this.cdr.detectChanges();
    }

    ngOnDestroy(): void {
        this.media?.revert();
        this.context?.revert();
    }
}

