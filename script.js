class ChristmasLightsApp {
    constructor() {
        this.map = null;
        this.markers = [];
        this.locations = {};
        this.selectedLocations = new Set();
        this.filteredLocations = {};
        this.routingControl = null;
        this.userLocation = null;
        this.tripStops = [];
        this.tripRoute = null;
        this.radiusCircle = null;
        this.radiusCenterMarker = null;
        
        this.init();
    }

    async init() {
        await this.loadLocations();
        this.initMap();
        this.setupEventListeners();

        // Collapse search on mobile by default
        if (window.innerWidth <= 768) {
            document.getElementById('search-content').classList.add('collapsed');
            document.getElementById('toggle-icon').textContent = '▶';
        }
        setTimeout(() => {
            this.applyFilters();
            this.renderLocationsList();
            this.updateTripButton();   
        }, 100);
        this.addMarkersToMap();
        
    }

    async loadLocations() {
        try {
            const response = await fetch('address_data.json');
            this.locations = await response.json();
            this.filteredLocations = {...this.locations};
        } catch (error) {
            console.error('Error loading locations:', error);
            // Embedded data as fallback
            this.locations = {
                "16327 70th St N, Loxahatchee, FL 33470": {
                    "title": "Arancibia Household",
                    "description": "Our first show will be this Friday December 6th at 7:00 pm</br>Show Days:</br>Friday 7:00 pm</br>Saturday 6:30 pm and 8:00 pm</br>Sunday 7:00 pm</br>We hope you enjoy this show made with lots of love for our friends and neighbors!</br>Happy Holidays to everyone and thank you!❤️</br>",
                    "image_url": "/static/images/ArancibiaHouse.jpg",
                    "website_url": "https://www.facebook.com/viviana.b.gonella/videos/931308408949650",
                    "confirmed_2025": false
                },
                "12401 80th Lane N": {
                    "title": "12401 80th Lane N",
                    "description": "",
                    "image_url": "/static/images/lightshow1.jpg",
                    "website_url": "",
                    "confirmed_2025": false
                },
                "12218 54th St N, West Palm Beach, FL 33411": {
                    "title": "A Miracle on 54th St",
                    "description": "Tune to 88.7 FM Lights and music on at 6:30 pm Off at 10pm Friday and Saturday. Off at 9 pm Sunday through Thursday.",
                    "image_url": "/static/images/Hammerle.png",
                    "website_url": null,
                    "confirmed_2025": true
                },
                "4840 123rd trail ": {
                    "title": "The acreage",
                    "description": "",
                    "image_url": "placeholder.png",
                    "website_url": "",
                    "confirmed_2025": false
                },
                "405 Las Palmas St, Royal Palm Beach, FL 33411": {
                    "title": "Whoville",
                    "description": "THE GRINCH IS BACK IN TOWN </br>Come visit the GRINCH in Whooville and take your </br>holiday pics. Tunnel of lights, scavenger hunt and interact with the Grinch.</br>405 Las Palmas Street in La Mancha </br>Tonight Friday 7:30 - 9</br>Saturday 12/7  6:30 -930</br>Sunday 12/8 6:30 -9</br>",
                    "image_url": "/static/images/whoville.jpg",
                    "website_url": null,
                    "confirmed_2025": false
                },
                "14876 Stirrup Lane Wellington, FL, 33414": {
                    "title": "Martino Family Lightshow",
                    "description": "The Martino Family Christmas Lights in Wellington Florida. Our family has been putting up our display for over 40 years here in South Florida.",
                    "image_url": "/static/images/martino.jpg",
                    "website_url": "https://www.facebook.com/MartinoFamilyChristmasLights/",
                    "confirmed_2025": false
                },
                "2414 Gabriel Ln, West Palm Beach, FL 33406": {
                    "title": "Gabriel Lane - The Christmas Street",
                    "description": "Tune to 88.7 FM Lights and music on at 6:30 pm Off at 10pm Friday and Saturday. Off at 9 pm Sunday through Thursday.",
                    "image_url": "/static/images/gabrielLane.jpg",
                    "website_url": "https://foursquare.com/v/gabriel-lane--the-christmas-street/4c439ccedd1f2d7f28cc7ef9",
                    "confirmed_2025": true
                },
                "910 South Patrick Circle, West Palm Beach, 33406": {
                    "title": "Kazen's Christmas Light Display",
                    "description": "Come by and check us out!</br>910 South Patrick Circle</br>West Palm Beach</br>33406</br>",
                    "image_url": "/static/images/kazenFamily.jpg",
                    "website_url": "https://www.facebook.com/christmaslightdisplay/",
                    "confirmed_2025": false
                },
                "Northlake Blvd & Seminole Pratt Whitney Rd, Florida, 33470": {
                    "title": "The Grinch of Northlake",
                    "description": "The grinch directs traffic on Northlake Blvd and Seminole Pratt usually between 8-9PM nightly. Check his website to see if he is out!",
                    "image_url": "/static/images/grinch.jpg",
                    "website_url": "https://www.facebook.com/Grinchofnorthlake",
                    "confirmed_2025": true
                },
                "11106 150th Ct N, Jupiter, FL 33478": {
                    "title": "Pig Farm Christmas Light Show",
                    "description": "The show is on a loop. Tune to 97.1 FM or listen on outdoor speakers.",
                    "image_url": "/static/images/pigFarm.jpg",
                    "website_url": "https://www.facebook.com/pigfarmlightshow/",
                    "confirmed_2025": true
                },
                "15944 84th Ave N, Palm Beach Gardens Palm Beach Gardens, FL 33418": {
                    "title": "Country Roads Christmas Light Show",
                    "description": "Daily shows at promptly 6:30, 7:30, 8:30pm.",
                    "image_url": "/static/images/country_roads.jpg",
                    "website_url": "https://www.facebook.com/countryroadslights",
                    "confirmed_2025": true
                },
                "Heights Blvd, Jupiter, FL 33458": {
                    "title": "Heights of Jupiter",
                    "description": "The Heights neighborhood decorated for Christmas with lighted arches and Candy Cane Lane.",
                    "image_url": "/static/images/whovillerJup.jpg",
                    "website_url": "https://www.yelp.com/biz/heights-of-jupiter-jupiter",
                    "confirmed_2025": false
                },
                "6342 Ungerer St Jupiter, FL 33458": {
                    "title": "Who-Ville Experience Jupiter",
                    "description": "Who-ville Experience offers immersive and interactive experiences for visitors of all ages.",
                    "image_url": "/static/images/whovillerJup.jpg",
                    "website_url": "https://www.yelp.com/biz/who-ville-experience-jupiter",
                    "confirmed_2025": false
                },
                "110 Segovia Ave, royal palm beach, FL": {
                    "title": "Lights on Segovia Ave",
                    "description": "Runs 6-9 every night until new years",
                    "image_url": "placeholder.png",
                    "website_url": "https://www.facebook.com/share/AM5VQqWBMpLj4ok4/?mibextid=wwXIfr",
                    "confirmed_2025": false
                }
            };
            this.filteredLocations = {...this.locations};
            console.log('Locations loaded:', Object.keys(this.locations).length);
            console.log('Filtered locations:', Object.keys(this.filteredLocations).length);
        }
    }

    initMap() {
        this.map = L.map('map').setView([26.7153, -80.0534], 10);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(this.map);
    }

    async geocodeAddress(address) {
        try {
            const accessToken = 'sk.eyJ1IjoiY29kZXJzYW0xMDg4IiwiYSI6ImNtaWdrZ3J3NTA4NjEzZHBxbGltZDExeGYifQ.cqmyDtf34CEag_dIpC2MnA'; // pk.xxxxx token with MAP:READ
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${accessToken}&limit=1`
            );
            const data = await response.json();
            
            if (data.features && data.features.length > 0) {
                return {
                    lat: data.features[0].center[1],
                    lng: data.features[0].center[0]
                };
            }
        } catch (error) {
            console.error('Geocoding error:', error);
        }
        return null;
    }

    async addMarkersToMap() {
        const addresses = Object.keys(this.locations);
        let processed = 0;
        let valid = 0;
        
        for (const address of addresses) {
            const location = this.locations[address];
            const coords = await this.geocodeAddress(address);
            console.log(`Location ${address} coordinates ${Object.values(coords)}`);
            
            
            if (coords) {
                valid++;
                const marker = L.marker([coords.lat, coords.lng]).addTo(this.map);
                
                const popupContent = this.createPopupContent(address, location);
                marker.bindPopup(popupContent, { 
                    className: 'custom-popup',
                    maxWidth: 300
                });
                
                this.markers.push({ marker, address, location, coords });
            }
            
            processed++;
            console.log(`Processed ${processed}/${addresses.length} locations`);
            console.log(`Valid locations: ${valid}/${processed}`)
        }
        
        if (this.markers.length > 0) {
            const group = L.featureGroup(this.markers.map(m => m.marker));
            this.map.fitBounds(group.getBounds().pad(0.1));
        }
    }

    createPopupContent(address, location) {
        const imageHtml = location.image_url && location.image_url !== 'placeholder.png' 
            ? `<img src="${location.image_url}" alt="${location.title}" class="popup-image" style="max-width: 100%; height: auto;">` 
            : '';
        
        const websiteHtml = location.website_url 
            ? `<a href="${location.website_url}" target="_blank" class="popup-website">Visit Website</a>` 
            : '';
        
        const confirmedBadge = location.confirmed_2025 
            ? '<span class="confirmed-badge">Confirmed 2025</span>' 
            : '';

        return `
            <div>
                <div class="popup-title">${location.title} ${confirmedBadge}</div>
                <div><strong>${address}</strong></div>
                ${imageHtml}
                <div class="popup-description">${location.description.replace(/(<\/br>|<br>)/gi, '<br>')}</div>
                ${websiteHtml}
                <button class="directions-button" onclick="christmasLightsApp.showDirections('${address.replace(/'/g, "\\'")}')">
                    Get Directions
                </button>
            </div>
        `;
    }

    setupEventListeners() {
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.filterLocations(e.target.value);
        });

        document.getElementById('confirmed-filter').addEventListener('change', () => {
            this.applyFilters();
        });

        document.getElementById('select-all').addEventListener('click', () => {
            this.selectAll();
        });

        document.getElementById('clear-all').addEventListener('click', () => {
            this.clearAll();
        });

        document.getElementById('export-selected').addEventListener('click', () => {
            this.exportSelected();
        });

        document.getElementById('show-selected').addEventListener('click', () => {
            this.showSelectedOnMap();
        });

        document.getElementById('show-all').addEventListener('click', () => {
            this.showAllOnMap();
        });

        document.getElementById('close-directions').addEventListener('click', () => {
            this.closeDirectionsPanel();
        });

        document.getElementById('use-current-location').addEventListener('click', () => {
            this.getCurrentLocation();
        });

        document.getElementById('clear-route').addEventListener('click', () => {
            this.clearRoute();
        });
        
        document.getElementById('plan-trip').addEventListener('click', () => {
            this.openTripPlanner();
        });
        
        document.getElementById('close-trip').addEventListener('click', () => {
            this.closeTripPanel();
        });

        document.getElementById('trip-use-current-location').addEventListener('click', () => {
            this.getTripCurrentLocation();
        });

        document.getElementById('create-trip').addEventListener('click', () => {
            this.createTrip();
        });

        document.getElementById('submit-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitLocation();
        });

        document.querySelector('.close').addEventListener('click', () => {
            document.getElementById('location-modal').style.display = 'none';
        });

        document.getElementById('search-radius-btn').addEventListener('click', () => {
            this.searchByRadius();
        });

        document.getElementById('toggle-search').addEventListener('click', () => {
            this.toggleSearchSection();
        });

        window.addEventListener('click', (e) => {
            const modal = document.getElementById('location-modal');
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    toggleSearchSection() {
        const content = document.getElementById('search-content');
        const icon = document.getElementById('toggle-icon');
        
        if (content.classList.contains('collapsed')) {
            content.classList.remove('collapsed');
            content.classList.add('expanded');
            icon.textContent = '▼';
        } else {
            content.classList.add('collapsed');
            content.classList.remove('expanded');
            icon.textContent = '▶';
        }
    }

    async searchByRadius() {
        const searchAddress = document.getElementById('search-input').value;
        const radius = parseFloat(document.getElementById('radius-input').value);
        
        if (!searchAddress || !radius) {
            alert('Please enter both an address and radius.');
            return;
        }
        
        // Geocode the search address
        const centerCoords = await this.geocodeAddress(searchAddress);
        
        if (!centerCoords) {
            alert('Could not find the address. Please try again.');
            return;
        }
        
        // Filter locations within radius
        const confirmedOnly = document.getElementById('confirmed-filter').checked;
        this.filteredLocations = {};
        
        for (const [address, location] of Object.entries(this.locations)) {
            const markerData = this.markers.find(m => m.address === address);
            
            if (markerData && markerData.coords) {
                const distance = this.calculateDistance(
                    centerCoords.lat,
                    centerCoords.lng,
                    markerData.coords.lat,
                    markerData.coords.lng
                );
                
                // Convert km to miles
                const distanceMiles = distance * 0.621371;
                
                const withinRadius = distanceMiles <= radius;
                const matchesConfirmed = !confirmedOnly || location.confirmed_2025;
                
                if (withinRadius && matchesConfirmed) {
                    this.filteredLocations[address] = location;
                }
            }
        }

        // Clear selections that are not in filtered locations
        const selectionsToRemove = [];
        this.selectedLocations.forEach(address => {
            if (!this.filteredLocations[address]) {
                selectionsToRemove.push(address);
            }
        });
        selectionsToRemove.forEach(address => {
            this.selectedLocations.delete(address);
        });
        
        console.log(`Found ${Object.keys(this.filteredLocations).length} locations within ${radius} miles`);
        this.renderLocationsList();
        this.showFilteredOnMap();
        this.updateTripButton();
        
        // Add a circle to show the search radius
        this.showSearchRadius(centerCoords, radius);
    }

    showFilteredOnMap() {
        // Hide all markers first
        this.markers.forEach(({ marker }) => {
            marker.remove();
        });
        
        // Show only filtered markers
        const filteredMarkers = [];
        this.markers.forEach(({ marker, address }) => {
            if (this.filteredLocations[address]) {
                marker.addTo(this.map);
                filteredMarkers.push(marker);
            }
        });
        
        if (filteredMarkers.length > 0) {
            const group = L.featureGroup(filteredMarkers);
            this.map.fitBounds(group.getBounds().pad(0.1));
        }
    }

    showSearchRadius(center, radiusMiles) {
        // Remove existing radius circle if any
        if (this.radiusCircle) {
            this.map.removeLayer(this.radiusCircle);
        }
        
        // Convert miles to meters for Leaflet circle
        const radiusMeters = radiusMiles * 1609.34;
        
        // Add circle to map
        this.radiusCircle = L.circle([center.lat, center.lng], {
            color: '#2c5aa0',
            fillColor: '#2c5aa0',
            fillOpacity: 0.1,
            radius: radiusMeters
        }).addTo(this.map);
        
        // Add center marker
        if (this.radiusCenterMarker) {
            this.map.removeLayer(this.radiusCenterMarker);
        }
        
        this.radiusCenterMarker = L.marker([center.lat, center.lng], {
            icon: L.divIcon({
                className: 'custom-marker',
                html: '<div style="background: #2c5aa0; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">📍</div>',
                iconSize: [30, 30]
            })
        }).addTo(this.map).bindPopup(`Search Center<br>${radiusMiles} mile radius`);
    }

    filterLocations(searchTerm) {
        const term = searchTerm.toLowerCase();
        const confirmedOnly = document.getElementById('confirmed-filter').checked;
        
        this.filteredLocations = {};
        
        for (const [address, location] of Object.entries(this.locations)) {
            const matchesSearch = !term || term.trim() === '' ||
                address.toLowerCase().includes(term) ||
                location.title.toLowerCase().includes(term) ||
                location.description.toLowerCase().includes(term);
            
            const matchesConfirmed = !confirmedOnly || location.confirmed_2025;
            
            if (matchesSearch && matchesConfirmed) {
                this.filteredLocations[address] = location;
            }
        }
            // Clear selections that are not in filtered locations
        const selectionsToRemove = [];
        this.selectedLocations.forEach(address => {
            if (!this.filteredLocations[address]) {
                selectionsToRemove.push(address);
            }
        });
        selectionsToRemove.forEach(address => {
            this.selectedLocations.delete(address);
        });
        console.log('Filter applied. Results:', Object.keys(this.filteredLocations).length);
        this.renderLocationsList();
    }

    applyFilters() {
        const searchTerm = document.getElementById('search-input').value;
        this.filterLocations(searchTerm);
    }

    renderLocationsList() {
        const container = document.getElementById('locations-list');

        if (!container) {
            console.error('locations-list container not found!');
            return;
        }
        container.innerHTML = '';
        
        console.log('Rendering locations list. Filtered count:', Object.keys(this.filteredLocations).length);


        if (Object.keys(this.filteredLocations).length === 0) {
            container.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">No locations found</div>';
            return;
        }

        for (const [address, location] of Object.entries(this.filteredLocations)) {
            const item = document.createElement('div');
            item.className = `location-item ${this.selectedLocations.has(address) ? 'selected' : ''}`;
            
            const confirmedBadge = location.confirmed_2025 
                ? '<span class="confirmed-badge">Confirmed 2025</span>' 
                : '';

            const truncatedDescription = location.description
                .replace(/(<\/br>|<br>)/gi, ' ')
                .substring(0, 150);

            item.innerHTML = `
                <div class="location-header">
                    <input type="checkbox" class="location-checkbox" ${this.selectedLocations.has(address) ? 'checked' : ''}>
                    <div class="location-title">${location.title}</div>
                    ${confirmedBadge}
                </div>
                <div class="location-address">${address}</div>
                <div class="location-description">${truncatedDescription}${location.description.length > 150 ? '...' : ''}</div>
            `;

            const checkbox = item.querySelector('.location-checkbox');
            checkbox.addEventListener('change', (e) => {
                e.stopPropagation();
                this.toggleSelection(address);
            });

            item.addEventListener('click', (e) => {
                if (e.target !== checkbox) {
                    this.toggleSelection(address);
                    this.showLocationDetails(address, location);
                }
            });

            container.appendChild(item);
        }
        console.log('Rendered', container.children.length, 'location items');
    }

    toggleSelection(address) {
        if (this.selectedLocations.has(address)) {
            this.selectedLocations.delete(address);
        } else {
            this.selectedLocations.add(address);
        }
        this.renderLocationsList();
        this.updateTripButton();
    }

    selectAll() {
        for (const address of Object.keys(this.filteredLocations)) {
            this.selectedLocations.add(address);
        }
        this.renderLocationsList();
        this.updateTripButton();
    }

    clearAll() {
        this.selectedLocations.clear();
        this.renderLocationsList();
        this.updateTripButton();
    }

    updateTripButton() {
        const button = document.getElementById('plan-trip');
        const count = this.selectedLocations.size;
        
        if (count < 2) {
            button.disabled = true;
            button.textContent = 'Plan Trip (Select 2+)';
        } else {
            button.disabled = false;
            button.textContent = `Plan Trip with ${count} Stops`;
        }
    }

    exportSelected() {
        if (this.selectedLocations.size === 0) {
            alert('Please select at least one location to export.');
            return;
        }

        const selectedData = {};
        for (const address of this.selectedLocations) {
            if (this.locations[address]) {
                selectedData[address] = this.locations[address];
            }
        }

        const dataStr = JSON.stringify(selectedData, null, 4);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'selected_locations.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        this.exportAsTextList(selectedData);
    }

    exportAsTextList(data) {
        let textList = 'Selected Christmas Light Show Locations\n';
        textList += '='.repeat(50) + '\n\n';

        for (const [address, location] of Object.entries(data)) {
            textList += `${location.title}\n`;
            textList += `Address: ${address}\n`;
            textList += `Confirmed 2025: ${location.confirmed_2025 ? 'Yes' : 'No'}\n`;
            if (location.website_url) {
                textList += `Website: ${location.website_url}\n`;
            }
            textList += `\nDescription:\n${location.description.replace(/(<\/br>|<br>)/gi, '\n')}\n`;
            textList += '-'.repeat(50) + '\n\n';
        }

        const textBlob = new Blob([textList], { type: 'text/plain' });
        const url = URL.createObjectURL(textBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'selected_locations.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    showSelectedOnMap() {
        if (this.selectedLocations.size === 0) {
            alert('Please select at least one location.');
            return;
        }

        this.markers.forEach(({ marker }) => {
            marker.remove();
        });

        const selectedMarkers = [];
        this.markers.forEach(({ marker, address }) => {
            if (this.selectedLocations.has(address)) {
                marker.addTo(this.map);
                selectedMarkers.push(marker);
            }
        });

        if (selectedMarkers.length > 0) {
            const group = L.featureGroup(selectedMarkers);
            this.map.fitBounds(group.getBounds().pad(0.1));
        }
    }

    showAllOnMap() {
        this.markers.forEach(({ marker }) => {
            marker.addTo(this.map);
        });

        if (this.markers.length > 0) {
            const group = L.featureGroup(this.markers.map(m => m.marker));
            this.map.fitBounds(group.getBounds().pad(0.1));
        }
    }

    showLocationDetails(address, location) {
        const modal = document.getElementById('location-modal');
        const modalBody = document.getElementById('modal-body');

        const imageHtml = location.image_url && location.image_url !== 'placeholder.png' 
            ? `<img src="${location.image_url}" alt="${location.title}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 15px 0;">` 
            : '';
        
        const websiteHtml = location.website_url 
            ? `<p><a href="${location.website_url}" target="_blank" style="color: #2c5aa0; text-decoration: none;">Visit Website →</a></p>` 
            : '';
        
        const confirmedBadge = location.confirmed_2025 
            ? '<span class="confirmed-badge" style="display: inline-block; margin-left: 10px;">Confirmed 2025</span>' 
            : '';

        modalBody.innerHTML = `
            <h2>${location.title} ${confirmedBadge}</h2>
            <p><strong>Address:</strong> ${address}</p>
            ${imageHtml}
            <div style="line-height: 1.6;">
                ${location.description.replace(/(<\/br>|<br>)/gi, '<br>')}
            </div>
            ${websiteHtml}
            <button class="directions-button" onclick="christmasLightsApp.showDirections('${address.replace(/'/g, "\\'")}')">
                Get Directions
            </button>
            <div class="external-directions">
                <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}" target="_blank">
                    Open in Google Maps
                </a>
                <a href="https://maps.apple.com/?daddr=${encodeURIComponent(address)}" target="_blank">
                    Open in Apple Maps
                </a>
            </div>
        `;

        modal.style.display = 'block';
    }

    async showDirections(address) {
        document.getElementById('directions-panel').classList.add('active');
        document.getElementById('clear-route').style.display = 'block';

        const markerData = this.markers.find(m => m.address === address);
        
        if (!markerData || !markerData.coords) {
            alert('Unable to find coordinates for this location.');
            return;
        }

        const destination = markerData.coords;
        const startInput = document.getElementById('start-location');
        let startCoords = this.userLocation;

        if (startInput.value && !this.userLocation) {
            startCoords = await this.geocodeAddress(startInput.value);
        }

        if (!startCoords) {
            document.getElementById('directions-result').innerHTML = `
                <div style="padding: 20px; text-align: center; color: #666;">
                    <p>Please enter your starting location or use your current location.</p>
                </div>
            `;
            return;
        }

        this.createRoute(startCoords, destination, address);
        this.showExternalDirectionLinks(address, startInput.value || 'Current Location');
    }

    createRoute(start, end, destinationAddress) {
        if (this.routingControl) {
            this.map.removeControl(this.routingControl);
        }

        this.routingControl = L.Routing.control({
            waypoints: [
                L.latLng(start.lat, start.lng),
                L.latLng(end.lat, end.lng)
            ],
            routeWhileDragging: false,
            show: false,
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            showAlternatives: false,
            lineOptions: {
                styles: [{ color: '#2c5aa0', opacity: 0.8, weight: 6 }]
            },
            createMarker: function() { return null; }
        }).addTo(this.map);

        this.routingControl.on('routesfound', (e) => {
            const routes = e.routes;
            this.displayRouteInstructions(routes[0], destinationAddress);
        });

        this.routingControl.on('routingerror', (e) => {
            console.error('Routing error:', e);
            document.getElementById('directions-result').innerHTML = `
                <div style="padding: 20px; color: #dc3545;">
                    <p>Unable to calculate route. Please try using external mapping services.</p>
                </div>
            `;
        });
    }

    displayRouteInstructions(route, destinationAddress) {
        const summary = route.summary;
        const instructions = route.instructions;

        const distance = (summary.totalDistance / 1000).toFixed(1);
        const duration = Math.round(summary.totalTime / 60);

        let html = `
            <div class="route-summary">
                <h4>Route to ${destinationAddress}</h4>
                <div class="route-info">
                    <span>Distance:</span>
                    <strong>${distance} km (${(distance * 0.621371).toFixed(1)} mi)</strong>
                </div>
                <div class="route-info">
                    <span>Duration:</span>
                    <strong>${duration} minutes</strong>
                </div>
            </div>
            <h4>Turn-by-turn Directions:</h4>
            <ol class="directions-steps">
        `;

        instructions.forEach((instruction, index) => {
            const dist = instruction.distance > 1000 
                ? `${(instruction.distance / 1000).toFixed(1)} km` 
                : `${Math.round(instruction.distance)} m`;
            
            html += `
                <li>
                    <span class="step-number">${index + 1}</span>
                    <span class="step-instruction">${instruction.text}</span>
                    <span class="step-distance">${dist}</span>
                </li>
            `;
        });

        html += '</ol>';
        document.getElementById('directions-result').innerHTML = html;
    }

    showExternalDirectionLinks(address, startLocation) {
        const resultDiv = document.getElementById('directions-result');
        
        const linksHtml = `
            <div class="external-directions">
                <a href="https://www.google.com/maps/dir/${encodeURIComponent(startLocation)}/${encodeURIComponent(address)}" target="_blank">
                    Open in Google Maps
                </a>
                <a href="https://maps.apple.com/?saddr=${encodeURIComponent(startLocation)}&daddr=${encodeURIComponent(address)}" target="_blank">
                    Open in Apple Maps
                </a>
                <a href="https://waze.com/ul?q=${encodeURIComponent(address)}" target="_blank">
                    Open in Waze
                </a>
            </div>
        `;

        resultDiv.innerHTML += linksHtml;
    }

    getCurrentLocation() {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }

        const button = document.getElementById('use-current-location');
        button.textContent = 'Getting location...';
        button.disabled = true;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                document.getElementById('start-location').value = 'Current Location';
                button.textContent = 'Location Set ✓';
                
                setTimeout(() => {
                    button.textContent = 'Use Current Location';
                    button.disabled = false;
                }, 2000);

                alert('Current location set! Click "Get Directions" on any location to see the route.');
            },
            (error) => {
                console.error('Geolocation error:', error);
                alert('Unable to get your location. Please enter your address manually.');
                button.textContent = 'Use Current Location';
                button.disabled = false;
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    }

    clearRoute() {
        if (this.routingControl) {
            this.map.removeControl(this.routingControl);
            this.routingControl = null;
        }
        
        this.closeDirectionsPanel();
        //document.getElementById('clear-route').style.display = 'none';
    }

    closeDirectionsPanel() {
        //document.getElementById('directions-panel').classList.remove('active');
        //document.getElementById('directions-result').innerHTML = '';
    }

    openTripPlanner() {
        if (this.selectedLocations.size < 2) {
            alert('Please select at least 2 locations to plan a trip.');
            return;
        }

        this.tripStops = Array.from(this.selectedLocations).map(address => ({
            address,
            location: this.locations[address]
        }));

        this.renderTripStops();
        document.getElementById('trip-panel').classList.add('active');
        document.getElementById('stops-count').textContent = this.tripStops.length;
    }

    closeTripPanel() {
        document.getElementById('trip-panel').classList.remove('active');
        document.getElementById('trip-result').innerHTML = '';
        this.clearRoute();
    }

    renderTripStops() {
        const container = document.getElementById('stops-list');
        container.innerHTML = '';

        this.tripStops.forEach((stop, index) => {
            const stopItem = document.createElement('div');
            stopItem.className = 'stop-item';
            stopItem.draggable = true;
            stopItem.dataset.index = index;

            stopItem.innerHTML = `
                <div class="stop-number">${index + 1}</div>
                <div class="stop-info">
                    <div class="stop-title">${stop.location.title}</div>
                    <div class="stop-address">${stop.address}</div>
                </div>
                <div class="stop-controls">
                    <button class="stop-btn remove" onclick="christmasLightsApp.removeStop(${index})">✕</button>
                </div>
            `;

            stopItem.addEventListener('dragstart', (e) => {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/html', stopItem.innerHTML);
                stopItem.classList.add('dragging');
                e.dataTransfer.setData('index', index);
            });

            stopItem.addEventListener('dragend', () => {
                stopItem.classList.remove('dragging');
            });

            stopItem.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            });

            stopItem.addEventListener('drop', (e) => {
                e.preventDefault();
                const fromIndex = parseInt(e.dataTransfer.getData('index'));
                const toIndex = index;
                
                if (fromIndex !== toIndex) {
                    this.reorderStops(fromIndex, toIndex);
                }
            });

            container.appendChild(stopItem);
        });
    }

    removeStop(index) {
        this.tripStops.splice(index, 1);
        this.renderTripStops();
        document.getElementById('stops-count').textContent = this.tripStops.length;
        
        if (this.tripStops.length < 2) {
            alert('You need at least 2 stops to plan a trip.');
            this.closeTripPanel();
        }
    }

    reorderStops(fromIndex, toIndex) {
        const item = this.tripStops.splice(fromIndex, 1)[0];
        this.tripStops.splice(toIndex, 0, item);
        this.renderTripStops();
    }

    getTripCurrentLocation() {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }

        const button = document.getElementById('trip-use-current-location');
        button.textContent = 'Getting location...';
        button.disabled = true;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                document.getElementById('trip-start-location').value = 'Current Location';
                button.textContent = 'Location Set ✓';
                
                setTimeout(() => {
                    button.textContent = 'Use Current Location';
                    button.disabled = false;
                }, 2000);
            },
            (error) => {
                console.error('Geolocation error:', error);
                alert('Unable to get your location. Please enter your address manually.');
                button.textContent = 'Use Current Location';
                button.disabled = false;
            }
        );
    }

    async createTrip() {
        const startInput = document.getElementById('trip-start-location');
        const optimize = document.getElementById('optimize-route').checked;
        const returnToStart = document.getElementById('return-to-start').checked;

        if (!startInput.value && !this.userLocation) {
            alert('Please enter a starting location or use your current location.');
            return;
        }

        const createButton = document.getElementById('create-trip');
        createButton.textContent = 'Creating route...';
        createButton.disabled = true;

        try {
            let startCoords = this.userLocation;
            if (startInput.value && startInput.value !== 'Current Location') {
                startCoords = await this.geocodeAddress(startInput.value);
            }

            if (!startCoords) {
                alert('Unable to geocode starting location.');
                createButton.textContent = 'Create Trip Route';
                createButton.disabled = false;
                return;
            }

            const waypoints = [L.latLng(startCoords.lat, startCoords.lng)];
            const stopCoords = [];

            for (const stop of this.tripStops) {
                const markerData = this.markers.find(m => m.address === stop.address);
                if (markerData && markerData.coords) {
                    stopCoords.push({
                        coords: markerData.coords,
                        address: stop.address,
                        location: stop.location
                    });
                    waypoints.push(L.latLng(markerData.coords.lat, markerData.coords.lng));
                }
            }

            if (optimize && stopCoords.length > 2) {
                const optimized = this.optimizeRoute(startCoords, stopCoords);
                waypoints.length = 1;
                this.tripStops = [];
                
                optimized.forEach(item => {
                    waypoints.push(L.latLng(item.coords.lat, item.coords.lng));
                    this.tripStops.push({
                        address: item.address,
                        location: item.location
                    });
                });
                
                this.renderTripStops();
            }

            if (returnToStart) {
                waypoints.push(L.latLng(startCoords.lat, startCoords.lng));
            }

            this.createMultiStopRoute(waypoints, startInput.value || 'Current Location', returnToStart);

        } catch (error) {
            console.error('Trip creation error:', error);
            alert('Error creating trip. Please try again.');
        } finally {
            createButton.textContent = 'Create Trip Route';
            createButton.disabled = false;
        }
    }

    optimizeRoute(start, stops) {
        const optimized = [];
        const remaining = [...stops];
        let current = start;

        while (remaining.length > 0) {
            let nearestIndex = 0;
            let nearestDistance = this.calculateDistance(
                current.lat, 
                current.lng, 
                remaining[0].coords.lat, 
                remaining[0].coords.lng
            );

            for (let i = 1; i < remaining.length; i++) {
                const distance = this.calculateDistance(
                    current.lat, 
                    current.lng, 
                    remaining[i].coords.lat, 
                    remaining[i].coords.lng
                );
                
                if (distance < nearestDistance) {
                    nearestDistance = distance;
                    nearestIndex = i;
                }
            }

            optimized.push(remaining[nearestIndex]);
            current = remaining[nearestIndex].coords;
            remaining.splice(nearestIndex, 1);
        }

        return optimized;
    }

    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371;
        const dLat = this.toRad(lat2 - lat1);
        const dLng = this.toRad(lng2 - lng1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    toRad(degrees) {
        return degrees * (Math.PI / 180);
    }

    createMultiStopRoute(waypoints, startLocation, returnToStart) {
        if (this.routingControl) {
            this.map.removeControl(this.routingControl);
        }

        this.routingControl = L.Routing.control({
            waypoints: waypoints,
            routeWhileDragging: false,
            show: false,
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            showAlternatives: false,
            lineOptions: {
                styles: [{ color: '#ff6b6b', opacity: 0.8, weight: 6 }]
            },
            createMarker: (i, waypoint, n) => {
                let markerIcon;
                if (i === 0) {
                    markerIcon = L.divIcon({
                        className: 'custom-marker',
                        html: '<div style="background: #28a745; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">S</div>',
                        iconSize: [30, 30]
                    });
                } else if (i === n - 1 && returnToStart) {
                    markerIcon = L.divIcon({
                        className: 'custom-marker',
                        html: '<div style="background: #28a745; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">E</div>',
                        iconSize: [30, 30]
                    });
                } else {
                    markerIcon = L.divIcon({
                        className: 'custom-marker',
                        html: `<div style="background: #ff6b6b; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${i}</div>`,
                        iconSize: [30, 30]
                    });
                }
                return L.marker(waypoint.latLng, { icon: markerIcon });
            }
        }).addTo(this.map);

        document.getElementById('clear-route').style.display = 'block';

        this.routingControl.on('routesfound', (e) => {
            const routes = e.routes;
            this.displayTripSummary(routes[0], startLocation, returnToStart);
        });

        this.routingControl.on('routingerror', (e) => {
            console.error('Routing error:', e);
            document.getElementById('trip-result').innerHTML = `
                <div style="padding: 20px; color: #dc3545;">
                    <p>Unable to calculate complete route. Some segments may not be routable.</p>
                    <p>Try using external mapping services below.</p>
                </div>
            `;
            this.showExternalTripLinks(startLocation, returnToStart);
        });
    }

    displayTripSummary(route, startLocation, returnToStart) {
        const summary = route.summary;
        const instructions = route.instructions;

        const totalDistance = (summary.totalDistance / 1000).toFixed(1);
        const totalMiles = (totalDistance * 0.621371).toFixed(1);
        const totalDuration = Math.round(summary.totalTime / 60);
        const hours = Math.floor(totalDuration / 60);
        const minutes = totalDuration % 60;

        let html = `
            <div class="trip-summary">
                <h4>Trip Summary</h4>
                <div class="trip-stats">
                    <div class="trip-stat">
                        <span class="trip-stat-value">${this.tripStops.length}</span>
                        <span class="trip-stat-label">Stops</span>
                    </div>
                    <div class="trip-stat">
                        <span class="trip-stat-value">${totalDistance} km</span>
                        <span class="trip-stat-label">${totalMiles} miles</span>
                    </div>
                    <div class="trip-stat">
                        <span class="trip-stat-value">${hours}h ${minutes}m</span>
                        <span class="trip-stat-label">Drive Time</span>
                    </div>
                    <div class="trip-stat">
                        <span class="trip-stat-value">${this.tripStops.length * 15}</span>
                        <span class="trip-stat-label">Est. Visit Time (min)</span>
                    </div>
                </div>
                <div class="trip-actions">
                    <button class="export-trip-btn" onclick="christmasLightsApp.exportTrip()">Export JSON/TXT</button>
                    <button class="print-trip-btn" onclick="christmasLightsApp.printTrip()">Print</button>
                </div>
                <div class="trip-actions" style="margin-top: 10px;">
                    <button class="export-trip-btn" style="background: #4285F4;" onclick="christmasLightsApp.exportForGoogleMaps()">📍 Google Maps</button>
                    <button class="export-trip-btn" style="background: #007AFF;" onclick="christmasLightsApp.exportForAppleMaps()">🍎 Apple Maps</button>
                </div>
                <div class="trip-actions" style="margin-top: 10px;">
                    <button class="export-trip-btn" style="background: #34A853;" onclick="christmasLightsApp.exportAsKML()">Export KML</button>
                    <button class="export-trip-btn" style="background: #FBBC05; color: #333;" onclick="christmasLightsApp.exportAsGPX()">Export GPX</button>
                </div>
            </div>

            <h4>Trip Route:</h4>
            <div class="trip-directions">
        `;

        let currentLeg = 0;
        let legInstructions = [];
        let legDistance = 0;

        instructions.forEach((instruction, index) => {
            legInstructions.push(instruction);
            legDistance += instruction.distance;

            const isLastOfLeg = instruction.text.toLowerCase().includes('arrive') || 
                                index === instructions.length - 1;

            if (isLastOfLeg && legInstructions.length > 0) {
                const legTitle = currentLeg === 0 
                    ? `Start: ${startLocation}` 
                    : currentLeg <= this.tripStops.length 
                        ? `Stop ${currentLeg}: ${this.tripStops[currentLeg - 1].location.title}`
                        : returnToStart 
                            ? `Return: ${startLocation}`
                            : `Stop ${currentLeg}`;

                const legDistanceKm = (legDistance / 1000).toFixed(1);

                html += `
                    <div class="trip-leg">
                        <div class="trip-leg-header">
                            <div class="trip-leg-icon">${currentLeg === 0 ? 'S' : currentLeg > this.tripStops.length ? 'E' : currentLeg}</div>
                            <div class="trip-leg-info">
                                <div class="trip-leg-title">${legTitle}</div>
                                <div class="trip-leg-distance">${legDistanceKm} km (${(legDistanceKm * 0.621371).toFixed(1)} mi)</div>
                            </div>
                        </div>
                        <div class="trip-leg-steps">
                            ${legInstructions.map((inst, i) => 
                                `<div style="margin-bottom: 8px;">
                                    <strong>${i + 1}.</strong> ${inst.text}
                                    ${inst.distance > 0 ? `<span style="color: #999;"> (${inst.distance > 1000 ? (inst.distance/1000).toFixed(1) + ' km' : Math.round(inst.distance) + ' m'})</span>` : ''}
                                </div>`
                            ).join('')}
                        </div>
                    </div>
                `;

                currentLeg++;
                legInstructions = [];
                legDistance = 0;
            }
        });

        html += '</div>';

        document.getElementById('trip-result').innerHTML = html;

        this.showExternalTripLinks(startLocation, returnToStart);
    }

    showExternalTripLinks(startLocation, returnToStart) {
        const resultDiv = document.getElementById('trip-result');
        
        const waypoints = this.tripStops.map(stop => stop.address).join('|');
        const destination = returnToStart ? startLocation : this.tripStops[this.tripStops.length - 1].address;



        //resultDiv.innerHTML += linksHtml;
    }

    exportTrip() {
        const tripData = {
            created: new Date().toISOString(),
            startLocation: document.getElementById('trip-start-location').value || 'Current Location',
            stops: this.tripStops.map((stop, index) => ({
                order: index + 1,
                title: stop.location.title,
                address: stop.address,
                description: stop.location.description,
                image_url: stop.location.image_url,
                website_url: stop.location.website_url,
                confirmed_2025: stop.location.confirmed_2025
            })),
            settings: {
                optimized: document.getElementById('optimize-route').checked,
                returnToStart: document.getElementById('return-to-start').checked
            }
        };

        const dataStr = JSON.stringify(tripData, null, 4);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `christmas-lights-trip-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        this.exportTripAsText(tripData);
    }

    exportTripAsText(tripData) {
        let text = '🎄 CHRISTMAS LIGHTS TOUR 🎄\n';
        text += '='.repeat(50) + '\n\n';
        text += `Created: ${new Date(tripData.created).toLocaleString()}\n`;
        text += `Starting Location: ${tripData.startLocation}\n`;
        text += `Number of Stops: ${tripData.stops.length}\n`;
        text += `Optimized Route: ${tripData.settings.optimized ? 'Yes' : 'No'}\n`;
        text += `Return to Start: ${tripData.settings.returnToStart ? 'Yes' : 'No'}\n\n`;
        text += '='.repeat(50) + '\n\n';

        tripData.stops.forEach((stop, index) => {
            text += `STOP ${stop.order}: ${stop.title}\n`;
            text += `-`.repeat(50) + '\n';
            text += `Address: ${stop.address}\n`;
            if (stop.confirmed_2025) {
                text += `✓ Confirmed for 2025\n`;
            }
            text += `\nDescription:\n${stop.description.replace(/(<\/br>|<br>)/gi, '\n')}\n`;
            if (stop.website_url) {
                text += `Website: ${stop.website_url}\n`;
            }
            text += '\n' + '='.repeat(50) + '\n\n';
        });

        const textBlob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(textBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `christmas-lights-trip-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        alert('Trip exported as JSON and TXT files!');
    }

    printTrip() {
        const tripContent = document.getElementById('trip-result').innerHTML;
        const startLocation = document.getElementById('trip-start-location').value || 'Current Location';

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Christmas Lights Trip - Print</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 20px;
                        max-width: 800px;
                        margin: 0 auto;
                    }
                    h1 {
                        color: #ff6b6b;
                        text-align: center;
                        border-bottom: 3px solid #ff6b6b;
                        padding-bottom: 10px;
                    }
                    .print-date {
                        text-align: center;
                        color: #666;
                        margin-bottom: 20px;
                    }
                    .trip-summary {
                        background: #f8f9fa;
                        padding: 20px;
                        border-radius: 8px;
                        margin: 20px 0;
                    }
                    .trip-stats {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 15px;
                        margin: 15px 0;
                    }
                    .trip-stat {
                        text-align: center;
                        padding: 10px;
                        background: white;
                        border-radius: 4px;
                        border: 1px solid #ddd;
                    }
                    .trip-stat-value {
                        display: block;
                        font-size: 20px;
                        font-weight: bold;
                        color: #ff6b6b;
                    }
                    .trip-stat-label {
                        display: block;
                        font-size: 11px;
                        color: #666;
                        text-transform: uppercase;
                        margin-top: 5px;
                    }
                    .stops-list {
                        margin: 20px 0;
                    }
                    .stops-list h3 {
                        color: #333;
                        border-bottom: 2px solid #ff6b6b;
                        padding-bottom: 8px;
                    }
                    .stop-item {
                        margin: 15px 0;
                        padding: 15px;
                        background: #f8f9fa;
                        border-left: 4px solid #ff6b6b;
                        page-break-inside: avoid;
                    }
                    .stop-number {
                        display: inline-block;
                        background: #ff6b6b;
                        color: white;
                        width: 28px;
                        height: 28px;
                        border-radius: 50%;
                        text-align: center;
                        line-height: 28px;
                        font-weight: bold;
                        margin-right: 10px;
                    }
                    .stop-title {
                        font-weight: bold;
                        font-size: 16px;
                        color: #333;
                    }
                    .stop-address {
                        color: #666;
                        margin-top: 5px;
                        font-size: 14px;
                    }
                    .trip-leg {
                        margin: 20px 0;
                        padding: 15px;
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        page-break-inside: avoid;
                    }
                    .trip-leg-header {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        margin-bottom: 10px;
                        padding-bottom: 10px;
                        border-bottom: 1px solid #eee;
                    }
                    .trip-leg-icon {
                        background: #ff6b6b;
                        color: white;
                        width: 32px;
                        height: 32px;
                        border-radius: 50%;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                    }
                    .trip-leg-info {
                        flex: 1;
                    }
                    .trip-leg-title {
                        font-weight: bold;
                        font-size: 16px;
                    }
                    .trip-leg-distance {
                        font-size: 12px;
                        color: #666;
                    }
                    .trip-leg-steps {
                        font-size: 13px;
                        line-height: 1.6;
                    }
                    .trip-actions, .external-trip-links, button {
                        display: none !important;
                    }
                    @media print {
                        body { padding: 10px; }
                        .trip-leg { page-break-inside: avoid; }
                        .stop-item { page-break-inside: avoid; }
                    }
                </style>
            </head>
            <body>
                <h1>🎄 Christmas Lights Tour 🎄</h1>
                <p class="print-date">Generated: ${new Date().toLocaleString()}</p>
                <p style="text-align: center;"><strong>Starting Location:</strong> ${startLocation}</p>
                
                <div class="stops-list">
                    <h3>Trip Stops (${this.tripStops.length})</h3>
                    ${this.tripStops.map((stop, index) => `
                        <div class="stop-item">
                            <span class="stop-number">${index + 1}</span>
                            <span class="stop-title">${stop.location.title}</span>
                            <div class="stop-address">${stop.address}</div>
                        </div>
                    `).join('')}
                </div>

                ${tripContent}

                <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #ddd; text-align: center; color: #666; font-size: 12px;">
                    <p>Have a wonderful time visiting these Christmas light displays!</p>
                    <p>Drive safely and enjoy the holiday season! 🎅🎄</p>
                </div>
            </body>
            </html>
        `);
        
        printWindow.document.close();
        
        setTimeout(() => {
            printWindow.print();
        }, 500);
    }
        // Export for Google Maps (opens directly in Google Maps with all waypoints)
    // Export for Google Maps (opens directly in Google Maps with all waypoints)
    exportForGoogleMaps() {
        const startLocation = document.getElementById('trip-start-location').value || 'Current Location';
        const returnToStart = document.getElementById('return-to-start').checked;
        
        // Google Maps URL with waypoints
        // Format: https://www.google.com/maps/dir/origin/waypoint1/waypoint2/destination
        
        let url = 'https://www.google.com/maps/dir/';
        
        // Add start location
        url += encodeURIComponent(startLocation);
        
        // Add all stops as waypoints - ADD SLASH BEFORE EACH
        this.tripStops.forEach(stop => {
            url += '/' + encodeURIComponent(stop.address);
        });
        
        // Add return to start if needed
        if (returnToStart) {
            url += '/' + encodeURIComponent(startLocation);
        }
        
        // Open in new tab
        window.open(url, '_blank');
        
        // Also copy to clipboard
        this.copyToClipboard(url, 'Google Maps link copied to clipboard!');
    }

    // Export for Apple Maps (iOS/Mac)
    exportForAppleMaps() {
        const startLocation = document.getElementById('trip-start-location').value || 'Current Location';
        const returnToStart = document.getElementById('return-to-start').checked;
        
        if (this.tripStops.length === 0) {
            alert('Please add stops to your trip first!');
            return;
        }
        
        if (this.tripStops.length === 1) {
            // Single destination - this works perfectly
            const url = `https://maps.apple.com/?saddr=${encodeURIComponent(startLocation)}&daddr=${encodeURIComponent(this.tripStops[0].address)}`;
            window.open(url, '_blank');
            this.copyToClipboard(url, 'Apple Maps link copied to clipboard!');
        } else {
        // Multiple destinations - use daddr with + separator
        let url = `https://maps.apple.com/?saddr=${encodeURIComponent(startLocation)}`;
        
        // Apple Maps supports multiple destinations with "+" separator
        const destinations = this.tripStops.map(stop => stop.address);
        if (returnToStart) {
            destinations.push(startLocation);
        }
        
        url += '&daddr=' + destinations.map(addr => encodeURIComponent(addr)).join('+to:');
        
        window.open(url, '_blank');
        this.copyToClipboard(url, 'Apple Maps link copied to clipboard!');
            
        }
    }

    // Export as KML (Google Earth format - works with Google Maps)
    exportAsKML() {
        const startLocation = document.getElementById('trip-start-location').value || 'Current Location';
        const returnToStart = document.getElementById('return-to-start').checked;
        
        let kml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        kml += '<kml xmlns="http://www.opengis.net/kml/2.2">\n';
        kml += '<Document>\n';
        kml += `<name>Christmas Lights Tour - ${new Date().toLocaleDateString()}</name>\n`;
        kml += '<description>A tour of Christmas light displays</description>\n';
        
        // Style for markers
        kml += '<Style id="startIcon">\n';
        kml += '  <IconStyle>\n';
        kml += '    <color>ff00ff00</color>\n';
        kml += '    <scale>1.2</scale>\n';
        kml += '    <Icon><href>http://maps.google.com/mapfiles/kml/paddle/grn-circle.png</href></Icon>\n';
        kml += '  </IconStyle>\n';
        kml += '</Style>\n';
        
        kml += '<Style id="stopIcon">\n';
        kml += '  <IconStyle>\n';
        kml += '    <color>ff0000ff</color>\n';
        kml += '    <scale>1.1</scale>\n';
        kml += '    <Icon><href>http://maps.google.com/mapfiles/kml/paddle/red-circle.png</href></Icon>\n';
        kml += '  </IconStyle>\n';
        kml += '</Style>\n';
        
        // Add start location (if we have coordinates)
        if (this.userLocation) {
            kml += '<Placemark>\n';
            kml += `<name>Start: ${startLocation}</name>\n`;
            kml += '<styleUrl>#startIcon</styleUrl>\n';
            kml += '<Point>\n';
            kml += `<coordinates>${this.userLocation.lng},${this.userLocation.lat},0</coordinates>\n`;
            kml += '</Point>\n';
            kml += '</Placemark>\n';
        }
        
        // Add each stop
        this.tripStops.forEach((stop, index) => {
            const markerData = this.markers.find(m => m.address === stop.address);
            if (markerData && markerData.coords) {
                kml += '<Placemark>\n';
                kml += `<name>Stop ${index + 1}: ${stop.location.title}</name>\n`;
                kml += `<description><![CDATA[`;
                kml += `<b>${stop.address}</b><br/>`;
                kml += `${stop.location.description.replace(/(<\/br>|<br>)/gi, '<br/>')}`;
                if (stop.location.website_url) {
                    kml += `<br/><a href="${stop.location.website_url}">Website</a>`;
                }
                kml += `]]></description>\n`;
                kml += '<styleUrl>#stopIcon</styleUrl>\n';
                kml += '<Point>\n';
                kml += `<coordinates>${markerData.coords.lng},${markerData.coords.lat},0</coordinates>\n`;
                kml += '</Point>\n';
                kml += '</Placemark>\n';
            }
        });
        
        // Add route line
        if (this.markers.length > 0) {
            kml += '<Placemark>\n';
            kml += '<name>Route</name>\n';
            kml += '<Style>\n';
            kml += '  <LineStyle>\n';
            kml += '    <color>ffff0000</color>\n';
            kml += '    <width>4</width>\n';
            kml += '  </LineStyle>\n';
            kml += '</Style>\n';
            kml += '<LineString>\n';
            kml += '<coordinates>\n';
            
            if (this.userLocation) {
                kml += `${this.userLocation.lng},${this.userLocation.lat},0\n`;
            }
            
            this.tripStops.forEach(stop => {
                const markerData = this.markers.find(m => m.address === stop.address);
                if (markerData && markerData.coords) {
                    kml += `${markerData.coords.lng},${markerData.coords.lat},0\n`;
                }
            });
            
            if (returnToStart && this.userLocation) {
                kml += `${this.userLocation.lng},${this.userLocation.lat},0\n`;
            }
            
            kml += '</coordinates>\n';
            kml += '</LineString>\n';
            kml += '</Placemark>\n';
        }
        
        kml += '</Document>\n';
        kml += '</kml>';
        
        // Download KML file
        const blob = new Blob([kml], { type: 'application/vnd.google-earth.kml+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `christmas-lights-trip-${new Date().toISOString().split('T')[0]}.kml`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        alert('KML file downloaded! You can:\n\n1. Open it in Google Earth\n2. Import it to Google My Maps\n3. Open it in Google Maps app (on mobile)\n\nInstructions:\n- Desktop: Go to google.com/maps, click menu, "Your places", "Maps", "Create Map", then import the KML\n- Mobile: Open the file with Google Maps app');
    }

    // Export as GPX (GPS Exchange Format - works with Apple Maps, Garmin, etc.)
    exportAsGPX() {
        const startLocation = document.getElementById('trip-start-location').value || 'Current Location';
        const returnToStart = document.getElementById('return-to-start').checked;
        
        let gpx = '<?xml version="1.0" encoding="UTF-8"?>\n';
        gpx += '<gpx version="1.1" creator="Christmas Lights Tour App"\n';
        gpx += '     xmlns="http://www.topografix.com/GPX/1/1"\n';
        gpx += '     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n';
        gpx += '     xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">\n';
        
        gpx += '<metadata>\n';
        gpx += `<name>Christmas Lights Tour - ${new Date().toLocaleDateString()}</name>\n`;
        gpx += '<description>A tour of Christmas light displays</description>\n';
        gpx += `<time>${new Date().toISOString()}</time>\n`;
        gpx += '</metadata>\n';
        
        // Add waypoints
        if (this.userLocation) {
            gpx += '<wpt lat="' + this.userLocation.lat + '" lon="' + this.userLocation.lng + '">\n';
            gpx += `<name>Start: ${startLocation}</name>\n`;
            gpx += '<sym>Flag, Green</sym>\n';
            gpx += '</wpt>\n';
        }
        
        this.tripStops.forEach((stop, index) => {
            const markerData = this.markers.find(m => m.address === stop.address);
            if (markerData && markerData.coords) {
                gpx += '<wpt lat="' + markerData.coords.lat + '" lon="' + markerData.coords.lng + '">\n';
                gpx += `<name>Stop ${index + 1}: ${stop.location.title}</name>\n`;
                gpx += `<desc>${stop.address}</desc>\n`;
                gpx += '<sym>Flag, Red</sym>\n';
                gpx += '</wpt>\n';
            }
        });
        
        // Add route as a track
        gpx += '<trk>\n';
        gpx += '<name>Christmas Lights Route</name>\n';
        gpx += '<trkseg>\n';
        
        if (this.userLocation) {
            gpx += '<trkpt lat="' + this.userLocation.lat + '" lon="' + this.userLocation.lng + '"></trkpt>\n';
        }
        
        this.tripStops.forEach(stop => {
            const markerData = this.markers.find(m => m.address === stop.address);
            if (markerData && markerData.coords) {
                gpx += '<trkpt lat="' + markerData.coords.lat + '" lon="' + markerData.coords.lng + '"></trkpt>\n';
            }
        });
        
        if (returnToStart && this.userLocation) {
            gpx += '<trkpt lat="' + this.userLocation.lat + '" lon="' + this.userLocation.lng + '"></trkpt>\n';
        }
        
        gpx += '</trkseg>\n';
        gpx += '</trk>\n';
        gpx += '</gpx>';
        
        // Download GPX file
        const blob = new Blob([gpx], { type: 'application/gpx+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `christmas-lights-trip-${new Date().toISOString().split('T')[0]}.gpx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        alert('GPX file downloaded! You can:\n\n1. Open it in Apple Maps (iOS: tap file, choose Maps)\n2. Import to Google Maps\n3. Use with GPS devices (Garmin, etc.)\n4. Open in hiking/navigation apps\n\nOn iPhone/iPad:\n- Save the GPX file to Files app\n- Tap the file and select "Open in Maps"');
    }

    // Helper function to copy text to clipboard
    copyToClipboard(text, successMessage) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                if (successMessage) alert(successMessage);
            }).catch(err => {
                console.error('Could not copy text: ', err);
            });
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                if (successMessage) alert(successMessage);
            } catch (err) {
                console.error('Could not copy text: ', err);
            }
            document.body.removeChild(textArea);
        }
    }

    submitLocation() {
        const newLocation = {
            address: document.getElementById('address').value,
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            image_url: document.getElementById('image-url').value || 'placeholder.png',
            website_url: document.getElementById('website-url').value || null,
            confirmed_2025: document.getElementById('confirmed-2025').checked
        };

        this.locations[newLocation.address] = {
            title: newLocation.title,
            description: newLocation.description,
            image_url: newLocation.image_url,
            website_url: newLocation.website_url,
            confirmed_2025: newLocation.confirmed_2025
        };

        this.filteredLocations = {...this.locations};

        this.addNewMarker(newLocation.address, this.locations[newLocation.address]);

        this.renderLocationsList();

        document.getElementById('submit-form').reset();

        alert('Location submitted successfully! Note: This is only stored locally. In a real application, this would be saved to a database.');

        showTab('browse');

        this.downloadUpdatedJSON();
    }

    async addNewMarker(address, location) {
        const coords = await this.geocodeAddress(address);
        
        if (coords) {
            const marker = L.marker([coords.lat, coords.lng]).addTo(this.map);
            
            const popupContent = this.createPopupContent(address, location);
            marker.bindPopup(popupContent, { 
                className: 'custom-popup',
                maxWidth: 300
            });
            
            this.markers.push({ marker, address, location, coords });
            
            this.map.flyTo([coords.lat, coords.lng], 15);
        } else {
            alert('Could not geocode the address. Please check that it is valid.');
        }
    }

    downloadUpdatedJSON() {
        const dataStr = JSON.stringify(this.locations, null, 4);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'address_data_updated.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

// Global function for tab switching (called from HTML)
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(`${tabName}-tab`).classList.add('active');
    const tabIndex = tabName === 'browse' ? 0 : 1;
    document.querySelectorAll('.tab-btn')[tabIndex].classList.add('active');
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing app');
    const app = new ChristmasLightsApp();
    
    // Make app accessible globally for debugging and onclick handlers
    window.christmasLightsApp = app;
    console.log('App initialized');
});