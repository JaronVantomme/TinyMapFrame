// http://127.0.0.1:5500/index.html?lat=50.978840&long=3.121360

require(["esri/Map", "esri/views/MapView", "esri/Graphic", "dojo/domReady!"], function(Map, MapView, Graphic) {
    function getParameterByName(name) {
        const regex = new RegExp(`[?&]${name}=([^&]*)`);
        const results = regex.exec(window.location.search);
        return results ? decodeURIComponent(results[1]) : '';
    }
    
    

    var lat = parseFloat(getParameterByName('lat'));
    var long = parseFloat(getParameterByName('long'));
    var color = getParameterByName('color');
    var outline = getParameterByName('outline');

    if (isNaN(lat) || isNaN(long)) {
        return;
    }

    var map = new Map({
        basemap: "gray"
    });

    var view = new MapView({
        container: "viewDiv",
        map: map,
        center: [long, lat],
        zoom: 15,
    });

    var point = {
        type: "point",
        longitude: long,
        latitude: lat
    };

    var markerSymbol = {
        type: "simple-marker",
        color: `${color ? `#${color}` : [151, 191, 13]}`,
        size: "15px",
        style: "circle",
        outline: {
            color: `${outline ? `#${outline}` : [255, 255, 255]}`,
            width: 3
        }
    };

    var graphic = new Graphic({
        geometry: point,
        symbol: markerSymbol
    });

    view.graphics.add(graphic);

    var overlay = document.getElementById('overlay');
    var isCtrlOrCmdPressed = false;
    var inactivityTimer;
    var overlayDisplayTimeout = 4000;

    const zoomInButton = document.getElementById('zoom-in');
    const zoomOutButton = document.getElementById('zoom-out');

    if (zoomInButton && zoomOutButton) {
        const backgroundColor = color ? `#${color}` : '#cccccc';
        const textColor = outline ? `#${outline}` : '#000000';

        zoomInButton.style.backgroundColor = backgroundColor;
        zoomInButton.style.color = textColor;

        zoomOutButton.style.backgroundColor = backgroundColor;
        zoomOutButton.style.color = textColor;
    }

    function showOverlay() {
        overlay.classList.add('show');
    }

    function hideOverlay() {
        overlay.classList.remove('show');
    }

    function resetInactivityTimer() {
        if (inactivityTimer) {
            clearTimeout(inactivityTimer);
        }
        inactivityTimer = setTimeout(hideOverlay, overlayDisplayTimeout);
    }

    function handleInteraction(event) {
        if (isCtrlOrCmdPressed) {
            hideOverlay();
        } else {
            hideOverlay();
        }
        clearTimeout(inactivityTimer);
    }

    function handleKey(event) {
        if (event.key === 'Control' || event.key === 'Meta') {
            isCtrlOrCmdPressed = true;
            hideOverlay();
        }
    }

    function handleKeyUp(event) {
        if (event.key === 'Control' || event.key === 'Meta') {
            isCtrlOrCmdPressed = false;
        }
        resetInactivityTimer();
    }

    function isMobile() {
        return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    }

    if (!isMobile()) {
        view.on('mouse-wheel', function(event) {
            if (isCtrlOrCmdPressed) {
            } else {
                showOverlay();
                inactivityTimer = setTimeout(hideOverlay, overlayDisplayTimeout);
                event.stopPropagation();
            }
        });
    }

    view.on('click', handleInteraction);
    view.on('pointer-down', handleInteraction);
    view.on('pointer-up', handleInteraction);

    window.addEventListener('keydown', handleKey);
    window.addEventListener('keyup', handleKeyUp);

    overlay.addEventListener('click', hideOverlay);

    // Zoom buttons functionality
    document.getElementById('zoom-in').addEventListener('click', function() {
        view.zoom += 1;
    });

    document.getElementById('zoom-out').addEventListener('click', function() {
        view.zoom -= 1;
    });
});