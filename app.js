let currentUser = null;
let imageList = [];

// 1. Fungsi Login
async function handleLogin() {
    const userIn = document.getElementById('username').value;
    const passIn = document.getElementById('password').value;

    try {
        const response = await fetch('users.json');
        const data = await response.json();
        const user = data.users.find(u => u.username === userIn && u.password === passIn);

        if (user) {
            currentUser = user;
            showDashboard();
            loadImages();
        } else {
            alert('Username atau password salah!');
        }
    } catch (e) {
        console.error("Gagal load user.json", e);
    }
}

// 2. Tampilkan Dashboard sesuai Role
/*
function showDashboard() {
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('main-page').classList.remove('hidden');
    document.getElementById('display-user').innerText = currentUser.username;

    // Tampilkan header hanya untuk admin
    if (currentUser.role === 'admin') {
        document.getElementById('admin-header').classList.remove('hidden');
    }
}
*/
function showDashboard() {
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('main-page').classList.remove('hidden');
    document.getElementById('display-user').innerText = currentUser.username;

    const header = document.getElementById('admin-header');
    
    // Validasi: Hanya admin yang bisa lihat tombol Tambah & Hapus
    if (currentUser.role === 'admin') {
        header.classList.remove('hidden'); // Munculkan header
    } else {
        header.classList.add('hidden');    // Sembunyikan header untuk user biasa
    }
}


// 3. Load Data Gambar
/*
async function loadImages() {
    try {
        const response = await fetch('data_gambar.json');
        imageList = await response.json();
        renderTable();
    } catch (e) {
        console.log("Memulai dengan list kosong");
    }
}
*/
/*
async function loadImages() {
    const owner = "karyasahabatcerdas-ui"; // Username GitHub kamu
    const repo = "temp_site";             // Nama repository
    const path = "gambar";                 // Nama folder gambar

    try {
        // Mengambil daftar isi direktori dari GitHub API
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`);
        const files = await response.json();

        // Filter hanya file gambar (jpg, png, webp, dll)
        imageList = files
            .filter(file => /\.(jpe?g|png|gif|webp)$/i.test(file.name))
            .map(file => ({
                id: file.sha, // Gunakan SHA unik dari GitHub sebagai ID
                url: file.download_url, // URL langsung untuk menampilkan gambar
                name: file.name
            }));

        renderTable();
    } catch (e) {
        console.error("Gagal mengambil daftar gambar dari GitHub API", e);
    }
}
*/
/*
async function loadImages() {
    const owner = "karyasahabatcerdas-ui"; 
    const repo = "temp_site";             
    const path = "gambar"; // Pastikan video juga ditaruh di sini atau sesuaikan foldernya

    try {
        const response = await fetch(`https://api.github.com{owner}/${repo}/contents/${path}`);
        const files = await response.json();

        if (Array.isArray(files)) {
            imageList = files
                .filter(file => /\.(jpe?g|png|webp|mp4)$/i.test(file.name)) // Tambah mp4 di sini
                .map(file => ({
                    id: file.sha,
                    url: file.download_url,
                    type: file.name.split('.').pop().toLowerCase() // Simpan tipe filenya
                }));
            renderTable();
        }
    } catch (e) {
        console.error("Gagal load file:", e);
    }
}
*/
// 4. Render Tabel
/*
function renderTable() {
    const tbody = document.getElementById('image-table-body');
    tbody.innerHTML = imageList.map(img => `
        <tr class="border-b">
            <td class="p-2 text-center"><input type="checkbox" class="row-checkbox" value="${img.id}"></td>
            <td class="p-2"><img src="${img.url}" class="w-16 h-16 object-cover rounded shadow"></td>
        </tr>
    `).join('');
}
*/
/*
function renderTable() {
    const tbody = document.getElementById('image-table-body');
    
    tbody.innerHTML = imageList.map(item => {
        let content = '';

        // Cek apakah filenya video mp4
        if (item.type === 'mp4') {
            content = `
                <video class="w-24 h-16 object-cover rounded shadow" muted>
                    <source src="${item.url}" type="video/mp4">
                    Browser tidak support video.
                </video>`;
        } else {
            // Jika gambar (webp, jpg, dll)
            content = `<img src="${item.url}" class="w-16 h-16 object-cover rounded shadow">`;
        }

        return `
            <tr class="border-b">
                <td class="p-2 text-center">
                    <input type="checkbox" class="row-checkbox" value="${item.id}">
                </td>
                <td class="p-2 flex items-center gap-4">
                    ${content}
                    <span class="text-xs text-gray-500">${item.type.toUpperCase()}</span>
                </td>
            </tr>
        `;
    }).join('');
}
*/
async function loadData() {
    const owner = "karyasahabatcerdas-ui"; 
    const repo = "temp_site";             
    const folderPath = "gambar"; // Ganti jika folder berbeda

    try {
        const response = await fetch(`https://api.github.com{owner}/${repo}/contents/${folderPath}`);
        const files = await response.json();

        if (Array.isArray(files)) {
            // Filter JPG, PNG, WEBP, dan MP4
            imageList = files
                .filter(file => /\.(jpe?g|png|webp|mp4)$/i.test(file.name))
                .map(file => {
                    const ext = file.name.split('.').pop().toLowerCase();
                    return {
                        id: file.sha,
                        url: file.download_url,
                        type: ext === 'mp4' ? 'video' : 'image'
                    };
                });
            renderTable();
        }
    } catch (e) {
        console.error("Gagal ambil data:", e);
    }
}

function renderTable() {
    const tbody = document.getElementById('image-table-body');
    tbody.innerHTML = imageList.map(item => `
        <tr class="border-b">
            <td class="p-2 text-center"><input type="checkbox" class="row-checkbox" value="${item.id}"></td>
            <td class="p-2">
                ${item.type === 'video' 
                    ? `<video src="${item.url}" class="w-20 h-14 object-cover rounded" muted></video>` 
                    : `<img src="${item.url}" class="w-16 h-16 object-cover rounded shadow">`
                }
            </td>
        </tr>
    `).join('');
}


// 5. Upload Gambar (Camera/Gallery)
function uploadImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const newImg = {
                id: Date.now(),
                url: e.target.result // Simpan base64 untuk simulasi testing
            };
            imageList.push(newImg);
            renderTable();
        };
        reader.readAsDataURL(file);
    }
}

// 6. Hapus Terpilih
function deleteSelected() {
    const checkboxes = document.querySelectorAll('.row-checkbox:checked');
    const idsToDelete = Array.from(checkboxes).map(cb => parseInt(cb.value));
    
    imageList = imageList.filter(img => !idsToDelete.includes(img.id));
    renderTable();
    document.getElementById('check-all').checked = false;
}

// 7. Checkbox All
function toggleAll(source) {
    const checkboxes = document.querySelectorAll('.row-checkbox');
    checkboxes.forEach(cb => cb.checked = source.checked);
}

// 8. Logout
function handleLogout() {
    location.reload(); // Refresh halaman untuk reset state
}
