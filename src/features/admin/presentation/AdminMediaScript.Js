import { FirebaseStorageRepository } from '../../src/infra/repositories/firebase_storage_repository.js';

const storageRepo = new FirebaseStorageRepository();
const mediaGrid = document.getElementById('media-grid');
const fileInput = document.getElementById('file-input');
const uploadZone = document.getElementById('upload-zone');

async function loadMedia() {
    if (!mediaGrid) return;
    mediaGrid.innerHTML = '<p style="grid-column: 1/-1; text-align:center;">Carregando mídia...</p>';

    const images = await storageRepo.listImages('gallery'); // Usando pasta 'gallery'

    if (images.length === 0) {
        mediaGrid.innerHTML = '<p style="grid-column: 1/-1; text-align:center;">Nenhuma imagem na biblioteca.</p>';
        return;
    }

    mediaGrid.innerHTML = images.map(img => `
        <div class="media-item">
            <div class="media-preview" style="background-image: url('${img.url}')"></div>
            <div class="media-info">
                <span title="${img.name}">${img.name.length > 15 ? img.name.substring(0, 12) + '...' : img.name}</span>
            </div>
            <div class="media-actions">
                <button title="Copiar Link" onclick="navigator.clipboard.writeText('${img.url}'); alert('Link copiado!')"><i class="fas fa-link"></i></button>
                <button title="Excluir" class="delete-media-btn" data-path="${img.fullPath}"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');

    attachDeleteListeners();
}

function attachDeleteListeners() {
    document.querySelectorAll('.delete-media-btn').forEach(btn => {
        btn.onclick = async (e) => {
            const path = e.currentTarget.dataset.path;
            if (confirm('Deseja realmente excluir esta imagem?')) {
                const result = await storageRepo.deleteImage(path);
                if (result.success) loadMedia();
            }
        };
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadMedia();

    if (uploadZone) {
        uploadZone.onclick = () => fileInput.click();
        
        fileInput.onchange = async (e) => {
            const files = e.target.files;
            if (files.length === 0) return;

            for (const file of files) {
                const path = `gallery/${Date.now()}_${file.name}`;
                const result = await storageRepo.uploadImage(file, path);
                if (!result.success) alert("Erro ao subir arquivo: " + result.error);
            }
            loadMedia();
        };
    }
});



