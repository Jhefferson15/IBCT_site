import { FirebaseSettingsRepository } from '../../src/infra/repositories/firebase_settings_repository.js';

const settingsRepo = new FirebaseSettingsRepository();

async function loadSettings() {
    const settings = await settingsRepo.getSettings();
    if (settings) {
        document.getElementById('site-title').value = settings.siteTitle || '';
        document.getElementById('site-description').value = settings.siteDescription || '';
        document.getElementById('maintenance-mode').checked = settings.maintenanceMode || false;
    }
}

async function saveSettings() {
    const settings = {
        siteTitle: document.getElementById('site-title').value,
        siteDescription: document.getElementById('site-description').value,
        maintenanceMode: document.getElementById('maintenance-mode').checked,
        lastUpdated: new Date()
    };

    const result = await settingsRepo.updateSettings(settings);
    if (result.success) {
        alert("Configurações salvas com sucesso!");
    } else {
        alert("Erro ao salvar: " + result.error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadSettings();

    const saveBtn = document.querySelector('.btn-primary');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveSettings);
    }

    // Gerenciar troca de abas (UI apenas)
    const tabs = document.querySelectorAll('.tab-link');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
});



