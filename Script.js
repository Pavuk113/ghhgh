// --------------------------
// Расчет расстояния (гаверсин)
// --------------------------
function calcDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;

    return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2);
}

// --------------------------
// Загрузка JSON с достопримечательностями
// --------------------------
async function loadPlacesJSON() {
    const response = await fetch("JSON.json");
    return response.json();
}

// --------------------------
// Отрисовка карточек
// --------------------------
function renderPlaces(userLat, userLon, data) {
    const container = document.getElementById("places-container");
    container.innerHTML = ""; // очищаем перед вставкой

    // Считаем расстояние и сортируем
    const sorted = data.places
        .filter(p => p.country === "Kazakhstan")
        .map(p => ({ ...p, distance: calcDistance(userLat, userLon, p.lat, p.lon) }))
        .sort((a, b) => a.distance - b.distance);

    // Вставка карточек
    sorted.forEach(place => {
        const cardHTML = `
            <div class="card">
                <img src="${place.img}" alt="${place.title}">
                <h3>${place.title}</h3>
                <p>Расстояние: ${place.distance} км</p>
            </div>
        `;
        container.insertAdjacentHTML("beforeend", cardHTML);
    });
}

// --------------------------
// Определение местоположения
// --------------------------
async function detectLocation() {
    const places = await loadPlacesJSON();
    document.getElementById("location-status").innerHTML = "";
    {

    }
    if (!navigator.geolocation) {
        alert("Геолокация не поддерживается вашим браузером.");
        return;
    }

    navigator.geolocation.getCurrentPosition(pos => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        renderPlaces(lat, lon, places);

    }, () => {
        alert("Не удалось определить ваше местоположение.");
    });
}

detectLocation();
