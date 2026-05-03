import { FirebaseAdminRepository } from '../infrastructure/FirebaseAdminRepository.js';
import { ManageCollectionUseCase } from '../../../../core/domain/use_cases/ManageCollectionUseCase.js';

const adminRepo = new FirebaseAdminRepository();
const manageUsersUseCase = new ManageCollectionUseCase(adminRepo, 'users');

const userModal = document.getElementById('user-modal');
const userForm = document.getElementById('user-form');
const modalTitle = document.getElementById('modal-title');
const usersList = []; // Cache local para edição

async function loadUsers() {
    const tableBody = document.getElementById('users-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center">Carregando usuários...</td></tr>';

    const users = await manageUsersUseCase.list('name');
    usersList.length = 0;
    usersList.push(...users);

    if (users.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center">Nenhum usuário cadastrado.</td></tr>';
        return;
    }

    tableBody.innerHTML = users.map(user => {
        const date = user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString('pt-BR') : 'N/A';
        const roleBadge = user.role === 'admin' ? 'badge-danger' : (user.role === 'editor' ? 'badge-info' : 'badge-secondary');
        const roleName = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Membro';

        return `
            <tr>
                <td>
                    <div class="user-cell">
                        <img src="${user.photoURL || '../../img/logo.png'}" alt="avatar">
                        <strong>${user.name || 'Sem Nome'}</strong>
                    </div>
                </td>
                <td>${user.email || 'N/A'}</td>
                <td><span class="badge ${roleBadge}">${roleName}</span></td>
                <td>${date}</td>
                <td class="action-buttons">
                    <button title="Editar" class="edit-btn" data-id="${user.id}"><i class="fas fa-pencil-alt"></i></button>
                    <button title="Excluir" class="delete-btn" data-id="${user.id}"><i class="fas fa-trash-alt"></i></button>
                </td>
            </tr>
        `;
    }).join('');

    attachEventListeners();
}

function attachEventListeners() {
    // Botão Excluir
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.onclick = async (e) => {
            const id = e.currentTarget.dataset.id;
            if (confirm('Tem certeza que deseja excluir este usuário?')) {
                const result = await manageUsersUseCase.delete(id);
                if (result.success) loadUsers();
            }
        };
    });

    // Botão Editar
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.onclick = (e) => {
            const id = e.currentTarget.dataset.id;
            const user = usersList.find(u => u.id === id);
            if (user) openModal(user);
        };
    });
}

function openModal(user = null) {
    if (user) {
        modalTitle.textContent = "Editar Usuário";
        document.getElementById('user-id').value = user.id;
        document.getElementById('user-name').value = user.name || '';
        document.getElementById('user-email').value = user.email || '';
        document.getElementById('user-role').value = user.role || 'membro';
        document.getElementById('user-pgm').value = user.pgm || '';
    } else {
        modalTitle.textContent = "Adicionar Usuário";
        userForm.reset();
        document.getElementById('user-id').value = '';
    }
    userModal.classList.add('active');
}

function closeModal() {
    userModal.classList.remove('active');
}

document.addEventListener('DOMContentLoaded', () => {
    loadUsers();

    // Botão Adicionar Usuário (na Header)
    const addBtn = document.querySelector('.btn-primary');
    if (addBtn) addBtn.addEventListener('click', () => openModal());

    // Botões de fechar modal
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // Submit do Formulário
    if (userForm) {
        userForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('user-id').value;
            const userData = {
                name: document.getElementById('user-name').value,
                email: document.getElementById('user-email').value,
                role: document.getElementById('user-role').value,
                pgm: document.getElementById('user-pgm').value
            };

            let result;
            if (id) {
                result = await manageUsersUseCase.update(id, userData);
            } else {
                result = await manageUsersUseCase.add(userData);
            }

            if (result.success) {
                closeModal();
                loadUsers();
            } else {
                alert("Erro ao salvar usuário: " + result.error);
            }
        });
    }
});



