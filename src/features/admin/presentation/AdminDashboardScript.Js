import { FirebaseAdminRepository } from '../infrastructure/FirebaseAdminRepository.js';

const adminRepo = new FirebaseAdminRepository();

async function loadDashboardStats() {
    const [users, notices, events, videos] = await Promise.all([
        adminRepo.getAllFromCollection('users'),
        adminRepo.getAllFromCollection('notices'),
        adminRepo.getAllFromCollection('events'),
        adminRepo.getAllFromCollection('videos')
    ]);

    document.getElementById('count-users').textContent = users.length;
    document.getElementById('count-notices').textContent = notices.length;
    document.getElementById('count-events').textContent = events.length;
    document.getElementById('count-videos').textContent = videos.length;
}

document.addEventListener('DOMContentLoaded', () => {
    loadDashboardStats();
});



