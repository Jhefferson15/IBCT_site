import { FirebaseAdminRepository } from '../infrastructure/FirebaseAdminRepository.js';
import { ManageCollectionUseCase } from '../../../../core/domain/use_cases/ManageCollectionUseCase.js';

const adminRepo = new FirebaseAdminRepository();
const managePostsUseCase = new ManageCollectionUseCase(adminRepo, 'notices');

const postModal = document.getElementById('post-modal');
const postForm = document.getElementById('post-form');
const modalTitle = document.getElementById('modal-title');
const postsList = [];

async function loadPosts() {
    const tableBody = document.getElementById('posts-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center">Carregando postagens...</td></tr>';

    const posts = await managePostsUseCase.list('createdAt');
    postsList.length = 0;
    postsList.push(...posts);

    if (posts.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center">Nenhuma postagem encontrada.</td></tr>';
        return;
    }

    tableBody.innerHTML = posts.map(post => {
        const date = post.createdAt ? new Date(post.createdAt.seconds * 1000).toLocaleDateString('pt-BR') : 'N/A';
        const statusBadge = post.status === 'rascunho' ? 'badge-warning' : 'badge-success';
        const statusName = post.status === 'rascunho' ? 'Rascunho' : 'Publicado';

        return `
            <tr>
                <td><strong>${post.title || 'Sem Título'}</strong></td>
                <td>${post.author || 'Admin'}</td>
                <td>${post.category || 'Geral'}</td>
                <td>${date}</td>
                <td><span class="badge ${statusBadge}">${statusName}</span></td>
                <td class="action-buttons">
                    <button title="Editar" class="edit-btn" data-id="${post.id}"><i class="fas fa-pencil-alt"></i></button>
                    <button title="Excluir" class="delete-btn" data-id="${post.id}"><i class="fas fa-trash-alt"></i></button>
                </td>
            </tr>
        `;
    }).join('');

    attachEventListeners();
}

function attachEventListeners() {
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.onclick = async (e) => {
            const id = e.currentTarget.dataset.id;
            if (confirm('Tem certeza que deseja excluir esta postagem?')) {
                const result = await managePostsUseCase.delete(id);
                if (result.success) loadPosts();
            }
        };
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.onclick = (e) => {
            const id = e.currentTarget.dataset.id;
            const post = postsList.find(p => p.id === id);
            if (post) openModal(post);
        };
    });
}

function openModal(post = null) {
    if (post) {
        modalTitle.textContent = "Editar Postagem";
        document.getElementById('post-id').value = post.id;
        document.getElementById('post-title').value = post.title || '';
        document.getElementById('post-category').value = post.category || 'Geral';
        document.getElementById('post-content').value = post.content || post.message || '';
        document.getElementById('post-status').value = post.status || 'publicado';
    } else {
        modalTitle.textContent = "Criar Postagem";
        postForm.reset();
        document.getElementById('post-id').value = '';
    }
    postModal.classList.add('active');
}

function closeModal() {
    postModal.classList.remove('active');
}

document.addEventListener('DOMContentLoaded', () => {
    loadPosts();

    const addBtn = document.querySelector('.btn-primary');
    if (addBtn) addBtn.addEventListener('click', () => openModal());

    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    if (postForm) {
        postForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('post-id').value;
            const postData = {
                title: document.getElementById('post-title').value,
                category: document.getElementById('post-category').value,
                content: document.getElementById('post-content').value,
                status: document.getElementById('post-status').value,
                author: "Admin User" // Idealmente pegar do Auth
            };

            let result;
            if (id) {
                result = await managePostsUseCase.update(id, postData);
            } else {
                result = await managePostsUseCase.add(postData);
            }

            if (result.success) {
                closeModal();
                loadPosts();
            } else {
                alert("Erro ao salvar postagem: " + result.error);
            }
        });
    }
});



