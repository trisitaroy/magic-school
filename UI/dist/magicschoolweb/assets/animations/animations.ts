import {
    animation,
    trigger,
    animateChild,
    group,
    transition,
    animate,
    style,
    query,
    state,
    keyframes
} from '@angular/animations';
import { APP_CONST } from '@app/app.constant';

/**
 * Animation Constants
 */
const TRANSLATE_POSITION = {
    positiveY: 'translateY(100%)',
    negativeY: 'translateY(-100%)',
    positiveX: 'translateX(100%)',
    negativeX: 'translateX(-100%)',
    none: 'none'
};
const ANIMATION_TIME = '400ms';
const ANIMATION_FUNC = 'ease-in-out';
const ROUTER_ANIMATION_TIME = '1s';
const ROUTER_ANIMATION_FUNC = 'ease-in-out';

/**
 * Router Animation Constants
 */
const ROUTE_ABSOLUTE_POSITION = query(':enter, :leave', [
    style({
        position: 'absolute',
        left: 0,
        width: '100%'
    })
]);

const HIDDEN_HEADER = query('#HBFullLayoutHeader', [
    style({
        display: 'none'
    })
], { optional: true });

const HIDDEN_FOOTER = query('#HBFullLayoutFooter', [
    style({
        display: 'none'
    })
], { optional: true });

const ROUTE_SLIDE_UP = [
    style({ position: 'relative' }),
    ROUTE_ABSOLUTE_POSITION,
    HIDDEN_HEADER,
    HIDDEN_FOOTER,
    group([
        query(
            ':enter',
            [
                style({ transform: TRANSLATE_POSITION.positiveY }),
                animate(
                    ROUTER_ANIMATION_TIME + ' ' + ROUTER_ANIMATION_FUNC,
                    style({ transform: TRANSLATE_POSITION.none })
                )
            ],
            { optional: true }
        ),
        query(
            ':leave',
            [
                style({ transform: TRANSLATE_POSITION.none }),
                animate(
                    ROUTER_ANIMATION_TIME + ' ' + ROUTER_ANIMATION_FUNC,
                    style({ transform: TRANSLATE_POSITION.negativeY })
                )
            ],
            { optional: true }
        ),
    ])
];
const ROUTE_SLIDE_DOWN = [
    style({ position: 'relative' }),
    ROUTE_ABSOLUTE_POSITION,
    HIDDEN_HEADER,
    HIDDEN_FOOTER,
    group([
        query(
            ':enter',
            [
                style({ transform: TRANSLATE_POSITION.negativeY }),
                animate(
                    ROUTER_ANIMATION_TIME + ' ' + ROUTER_ANIMATION_FUNC,
                    style({ transform: TRANSLATE_POSITION.none })
                )
            ],
            { optional: true }
        ),
        query(
            ':leave',
            [
                style({ transform: TRANSLATE_POSITION.none }),
                animate(
                    ROUTER_ANIMATION_TIME + ' ' + ROUTER_ANIMATION_FUNC,
                    style({ transform: TRANSLATE_POSITION.positiveY })
                )
            ],
            { optional: true }
        ),
    ])
];
const ROUTE_SLIDE_RIGHT = [
    style({ position: 'relative' }),
    ROUTE_ABSOLUTE_POSITION,
    HIDDEN_FOOTER,
    group([
        query(
            ':enter',
            [
                style({ transform: TRANSLATE_POSITION.negativeX }),
                animate(
                    ROUTER_ANIMATION_TIME + ' ' + ROUTER_ANIMATION_FUNC,
                    style({ transform: TRANSLATE_POSITION.none })
                )
            ],
            { optional: true }
        ),
        query(
            ':leave',
            [
                style({ transform: TRANSLATE_POSITION.none }),
                animate(
                    ROUTER_ANIMATION_TIME + ' ' + ROUTER_ANIMATION_FUNC,
                    style({ transform: TRANSLATE_POSITION.positiveX })
                )
            ],
            { optional: true }
        ),
    ])
];
const ROUTE_SLIDE_LEFT = [
    style({ position: 'relative' }),
    ROUTE_ABSOLUTE_POSITION,
    HIDDEN_FOOTER,
    group([
        query(
            ':enter',
            [
                style({ transform: TRANSLATE_POSITION.positiveX }),
                animate(
                    ROUTER_ANIMATION_TIME + ' ' + ROUTER_ANIMATION_FUNC,
                    style({ transform: TRANSLATE_POSITION.none })
                )
            ],
            { optional: true }
        ),
        query(
            ':leave',
            [
                style({ transform: TRANSLATE_POSITION.none }),
                animate(
                    ROUTER_ANIMATION_TIME + ' ' + ROUTER_ANIMATION_FUNC,
                    style({ transform: TRANSLATE_POSITION.negativeX })
                )
            ],
            { optional: true }
        ),
    ])
];

/**
 * Router Animation
 */
export const routeAnimation = trigger('routeAnimations', [
    transition(
        `${APP_CONST.routeAnimations.login} => ${APP_CONST.routeAnimations.home}`, ROUTE_SLIDE_UP
    ),
    transition(
        `${APP_CONST.routeAnimations.home} => ${APP_CONST.routeAnimations.login}`, ROUTE_SLIDE_DOWN
    )
]);

/**
 * Show Hide Animation
 */
export const showHideAnimation = trigger('showHideAnimation', [
    transition(
        ':enter',
        [
            style({
                transform: '{{ transform }}'
            }),
            animate(
                ANIMATION_TIME + ' ' + ANIMATION_FUNC,
                keyframes([
                    style({
                        transform: TRANSLATE_POSITION.none
                    })
                ])
            )
        ],
        {
            params: {
                transform: TRANSLATE_POSITION.none
            }
        }
    ),
    transition(
        ':leave',
        [
            style({
                transform: TRANSLATE_POSITION.none
            }),
            animate(
                ANIMATION_TIME + ' ' + ANIMATION_FUNC,
                keyframes([
                    style({
                        transform: '{{ transform }}'
                    })
                ])
            )
        ],
        {
            params: {
                transform: TRANSLATE_POSITION.none
            }
        }
    )
]);

/**
 * Slide In / Slide Out Animation
 */
export const slideInOutAnimation = trigger('slideInOutAnimation', [
    transition(':enter', [
        style({
            height: '0',
            overflow: 'hidden'
        }),
        animate(
            ANIMATION_TIME + ' ' + ANIMATION_FUNC,
            keyframes([
                style({
                    height: '*',
                    overflow: 'hidden'
                })
            ])
        )
    ]),
    transition(':leave', [
        style({
            overflow: 'hidden'
        }),
        animate(
            ANIMATION_TIME + ' ' + ANIMATION_FUNC,
            keyframes([
                style({
                    height: '0',
                    overflow: 'hidden'
                })
            ])
        )
    ])
]);

/**
 * Stepper Step Transition Animation
 */
export const stepTransition = trigger('stepTransition', [
    state(
        'previous',
        style({
            transform: TRANSLATE_POSITION.negativeX,
            visibility: 'hidden'
        })
    ),
    state(
        'current',
        style({
            transform: TRANSLATE_POSITION.none,
            visibility: 'visible'
        })
    ),
    state(
        'next',
        style({
            transform: TRANSLATE_POSITION.positiveX,
            visibility: 'hidden'
        })
    ),
    transition('* => *', animate('500ms cubic-bezier(0.35, 0, 0.25, 1)'))
]);

/**
 * Slide Out Animation
 */
export const slideOutAnimation = trigger('slideOutAnimation', [
    state(
        'show',
        style({
            transform: TRANSLATE_POSITION.none,
            display: 'block',
            opacity: '1'
        })
    ),
    state(
        'hide',
        style({ transform: '{{ transform }}', opacity: '0' }),
        {
            params: {
                transform: TRANSLATE_POSITION.none
            }
        }
    ),
    transition('* => *', animate(ANIMATION_TIME + ' ' + ANIMATION_FUNC))
]);

/**
 * Fade In Animation
 */
export const fadeInAnimation = trigger('fadeInAnimation', [
    state('show', style({ opacity: '1' })),
    state('hide', style({ opacity: '0' })),
    transition('* => *', animate('10ms ' + ANIMATION_TIME + ' ' + ANIMATION_FUNC))
]);
