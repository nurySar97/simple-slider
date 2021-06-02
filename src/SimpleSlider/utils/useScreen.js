import { useState, useEffect, useCallback } from 'react';

const { matchMedia } = window;

export const useScreenSize = () => {
    const [screenSize, setScreenSize] = useState(getScreenSize());
    const onSizeChanged = useCallback(() => setScreenSize(getScreenSize()), [setScreenSize]);

    useEffect(() => {
        subscribe(onSizeChanged);

        return () => unsubscribe(onSizeChanged);
    }, [onSizeChanged]);

    return screenSize;
};

let handlers = [];
const smallMedia = matchMedia('(min-width: 0px) and (max-width: 767px)');
const largeMedia = matchMedia('(min-width: 768px)');

const onScreenSizeChange = event => event.matches && handlers.forEach(handler => handler());

[smallMedia, largeMedia].forEach(media => media.addListener(onScreenSizeChange));

const subscribe = handler => handlers.push(handler);

const unsubscribe = handler => handlers = handlers.filter(item => item !== handler);

function getScreenSize() {
    return {
        isSmall: smallMedia.matches,
        isLarge: largeMedia.matches
    };
};